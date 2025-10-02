import { prisma } from '@/lib/prisma'
import mammoth from 'mammoth'

interface ParsedQuestion {
  text: string
  options: { a: string; b: string; c: string; d: string }
  correctAnswer: string // a/b/c/d (lowercase)
  solution?: string
  section?: string | null
  questionImages?: string[]
  optionImages?: {
    a: string[]
    b: string[]
    c: string[]
    d: string[]
  }
  solutionImages?: string[]
}

function parseOptionsBlock(text: string) {
  const clean = (s: string) => s.replace(/\[IMAGE:\d+\]/g, '').replace(/\s+/g, ' ').trim()
  
  // Try multiple option patterns
  const patterns = [
    // a. b. c. d. format
    { name: 'a. b. c. d.', regex: /a\.\s*(.*?)\s*b\.\s*(.*?)\s*c\.\s*(.*?)\s*d\.\s*(.*?)(?=\s*(?:Ans\.|Answer|Sol\.|Solution|$))/s },
    // A) B) C) D) format
    { name: 'A) B) C) D)', regex: /A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)(?=\s*(?:Ans\.|Answer|Sol\.|Solution|$))/s },
    // (A) (B) (C) (D) format
    { name: '(A) (B) (C) (D)', regex: /\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*?)(?=\s*(?:Ans\.|Answer|Sol\.|Solution|$))/s },
    // 1. 2. 3. 4. format
    { name: '1. 2. 3. 4.', regex: /1\.\s*(.*?)\s*2\.\s*(.*?)\s*3\.\s*(.*?)\s*4\.\s*(.*?)(?=\s*(?:Ans\.|Answer|Sol\.|Solution|$))/s },
    // A. B. C. D. format (uppercase)
    { name: 'A. B. C. D.', regex: /A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*?)\s*D\.\s*(.*?)(?=\s*(?:Ans\.|Answer|Sol\.|Solution|$))/s }
  ]
  
  for (const pattern of patterns) {
    const m = pattern.regex.exec(text)
    if (m) {
      console.log(`[WORD-PROCESSOR] Using option pattern "${pattern.name}"`)
      return { 
        a: clean(m[1]), 
        b: clean(m[2]), 
        c: clean(m[3]), 
        d: clean(m[4]) 
      }
    }
  }
  
  console.log('[WORD-PROCESSOR] No option patterns found in block')
  return null
}

function extractAnswerLetter(text: string) {
  const answerRegex = /(?:Ans\.?|Answer:?|Correct Answer:?|ans\.?|answer:?)(?:\s*is)?\s*([a-dA-D1-4])/i
  const m = answerRegex.exec(text)
  if (!m) return null
  const v = m[1].toString().toUpperCase()
  if (['1','2','3','4'].includes(v)) {
    return ({ '1':'A','2':'B','3':'C','4':'D' } as const)[v]
  }
  return v
}

function extractSolution(text: string) {
  const solutionRegex = /(?:Sol\.?|Solution:?|Explanation:?)[\s:-]*([\s\S]*?)$/i
  const m = solutionRegex.exec(text)
  if (!m) return ''
  return m[1].trim()
}

function splitQuestions(text: string) {
  // Normalize line breaks and clean up text
  const normalized = text.replace(/\r\n?/g, '\n').trim()
  
  // Try multiple question patterns in order of preference
  const patterns = [
    { name: 'Q1., Q2.', regex: /Q\d+\./g },
    { name: 'Q 1, Q 2', regex: /Q\s+\d+/g },
    { name: '1., 2.', regex: /^\d+\./gm },
    { name: 'Question 1', regex: /Question\s+\d+/gi },
    { name: 'Q1)', regex: /Q\d+\)/g }
  ]
  
  for (const pattern of patterns) {
    const matches: RegExpMatchArray[] = []
    let match: RegExpExecArray | null
    
    // Reset regex
    pattern.regex.lastIndex = 0
    
    while ((match = pattern.regex.exec(normalized)) !== null) {
      matches.push(match)
    }
    
    if (matches.length >= 2) { // Need at least 2 questions to be valid
      console.log(`[WORD-PROCESSOR] Using pattern "${pattern.name}", found ${matches.length} question markers`)
      
      const blocks: string[] = []
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index
        const end = i + 1 < matches.length ? matches[i + 1].index : normalized.length
        const block = normalized.slice(start, end).trim()
        if (block) {
          blocks.push(block)
        }
      }
      
      console.log(`[WORD-PROCESSOR] Split into ${blocks.length} blocks`)
      return blocks
    }
  }
  
  console.log('[WORD-PROCESSOR] No question patterns found with 2+ matches, returning whole text')
  return [normalized]
}

async function parseDocxFileToQuestions(file: File): Promise<ParsedQuestion[]> {
  console.log('[WORD-PROCESSOR] Starting DOCX parse:', { name: file.name, size: file.size })
  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Extract images and convert to base64
  const extractedImages: { [key: string]: string } = {}
  const imageIndex = 0
  
  const result = await mammoth.convertToHtml({ buffer })
  
  const html = result.value
  console.log(`[WORD-PROCESSOR] Extracted ${imageIndex} images from document`)
  
  // Keep image placeholders in text for now, we'll process them later
  const plain = html
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, '$1') // Keep image placeholders
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

  console.log('[WORD-PROCESSOR] Extracted text length:', plain.length)

  const blocks = splitQuestions(plain)
  console.log('[WORD-PROCESSOR] Split into blocks:', blocks.length)

  const parsed: ParsedQuestion[] = []

  // Helper function to extract and replace image placeholders
  function processImages(text: string) {
    const images: string[] = []
    const processedText = text.replace(/\[IMAGE:(\d+)\]/g, (match, index) => {
      const placeholder = `[IMAGE:${index}]`
      if (extractedImages[placeholder]) {
        images.push(extractedImages[placeholder])
        return ` [Image ${images.length}] ` // Replace with readable placeholder
      }
      return match
    })
    return { text: processedText, images }
  }

  for (const [idx, block] of blocks.entries()) {
    const options = parseOptionsBlock(block)
    if (!options) {
      console.log(`[WORD-PROCESSOR] Skipping block ${idx} — no options match`)
      continue
    }
    const answerLetter = extractAnswerLetter(block) || 'A'
    
    // Extract question text (everything before first option)
    const optionPatterns = [/\ba\.\s/, /\bA\)\s/, /\b\(A\)\s/, /\b1\.\s/, /\bA\.\s/]
    let optStart = -1
    for (const pattern of optionPatterns) {
      optStart = block.search(pattern)
      if (optStart > 0) break
    }
    
    let questionText = ''
    if (optStart > 0) {
      questionText = block.slice(0, optStart)
        .replace(/^(?:Q\.?\s*|Question\s*)?\d+[\.\)]\s*/, '') // Remove various question prefixes
        .trim()
    } else {
      questionText = block.replace(/^(?:Q\.?\s*|Question\s*)?\d+[\.\)]\s*/, '').trim()
    }
    
    const solution = extractSolution(block)
    
    // Process images in question text and options
    const questionData = processImages(questionText)
    const optionAData = processImages(options.a)
    const optionBData = processImages(options.b)
    const optionCData = processImages(options.c)
    const optionDData = processImages(options.d)
    const solutionData = processImages(solution)
    
    console.log(`[WORD-PROCESSOR] Parsed question: "${questionData.text.substring(0, 50)}..." Answer: ${answerLetter}`)
    if (questionData.images.length > 0) {
      console.log(`[WORD-PROCESSOR] Question has ${questionData.images.length} images`)
    }

    parsed.push({
      text: questionData.text,
      options: {
        a: optionAData.text,
        b: optionBData.text,
        c: optionCData.text,
        d: optionDData.text
      },
      correctAnswer: answerLetter.toLowerCase(),
      solution: solutionData.text,
      // Store image data for later use
      questionImages: questionData.images,
      optionImages: {
        a: optionAData.images,
        b: optionBData.images,
        c: optionCData.images,
        d: optionDData.images
      },
      solutionImages: solutionData.images
    })
  }

  console.log('[WORD-PROCESSOR] Parsed questions count:', parsed.length)
  return parsed
}

interface TestOptions {
  testType: 'mock' | 'pyq'
  examNameId: string
  year?: number
  subject?: string
  isFree?: boolean
}

export const simpleWordProcessor = {
  async processDocxFile(file: File, testName: string, categoryId: string, options?: TestOptions) {
    console.log('[WORD-PROCESSOR] Creating test shell', { testName, categoryId, options })
    
    const slug = `${testName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}-${Date.now().toString(36)}`
    
    // Create the test based on type
    if (options?.testType === 'pyq') {
      // Create PYQ using Exam model
      // First, find or create ExamYear
      let examYear = null
      if (options.year) {
        examYear = await prisma.examYear.findFirst({
          where: {
            categoryId,
            year: options.year
          }
        })
        
        if (!examYear) {
          examYear = await prisma.examYear.create({
            data: {
              categoryId,
              year: options.year
            }
          })
        }
      }
      
      const pyq = await prisma.exam.create({
        data: {
          title: testName,
          slug,
          examType: 'pyq',
          examUrl: '', // Will be updated with actual test URL later
          duration: 60,
          totalMarks: 0,
          isActive: true,
          isFree: options.isFree ?? true,
          yearId: examYear?.id || null,
          examNameId: options.examNameId
        }
      })
      
      // For PYQs, we still need to create questions in MockTest format for the test interface
      // Create a corresponding MockTest for the test-taking interface
      const mockTest = await prisma.mockTest.create({
        data: {
          title: testName,
          slug: `${slug}-test`,
          duration: 60,
          totalMarks: 0,
          testType: 'pyq',
          categoryId,
          examNameId: options.examNameId,
          isActive: true,
          isFree: options.isFree ?? true
        }
      })
      
      const questions = await parseDocxFileToQuestions(file)
      
      let qNum = 1
      for (const q of questions) {
        try {
          await prisma.question.create({
            data: {
              mockTestId: mockTest.id,
              questionNumber: qNum++,
              questionText: q.text,
              optionA: q.options.a,
              optionB: q.options.b,
              optionC: q.options.c,
              optionD: q.options.d,
              correctOption: q.correctAnswer.toUpperCase(),
              explanation: q.solution || null,
              subject: options.subject || null
            }
          })
        } catch (err) {
          console.error('[WORD-PROCESSOR] Failed to insert PYQ question', { qNum, err })
        }
      }
      
      // Update both Exam and MockTest with total marks
      await Promise.all([
        prisma.exam.update({
          where: { id: pyq.id },
          data: { 
            totalMarks: questions.length,
            examUrl: `/test/${mockTest.id}` // Link to the test interface
          }
        }),
        prisma.mockTest.update({
          where: { id: mockTest.id },
          data: { totalMarks: questions.length }
        })
      ])
      
      console.log('[WORD-PROCESSOR] Completed PYQ processing', { 
        pyqId: pyq.id, 
        mockTestId: mockTest.id, 
        questions: questions.length 
      })
      return { mockTestId: mockTest.id, questionsCount: questions.length, type: 'pyq', examId: pyq.id }
    } else {
      // Create Mock Test (default)
      // First, find or create ExamYear for mock tests (using current year as default)
      const currentYear = options?.year || new Date().getFullYear()
      let examYear = await prisma.examYear.findFirst({
        where: {
          categoryId,
          year: currentYear
        }
      })
      
      if (!examYear) {
        examYear = await prisma.examYear.create({
          data: {
            categoryId,
            year: currentYear
          }
        })
      }

      // Create both Exam entry (for admin/exams and mock-tests pages) and MockTest (for test interface)
      const exam = await prisma.exam.create({
        data: {
          title: testName,
          slug,
          examType: 'mock',
          examUrl: '', // Will be updated with actual test URL later
          duration: 60,
          totalMarks: 0,
          isActive: true,
          isFree: options?.isFree ?? true,
          yearId: examYear.id,
          examNameId: options?.examNameId || null
        }
      })

      const mockTest = await prisma.mockTest.create({
        data: {
          title: testName,
          slug: `${slug}-test`,
          duration: 60,
          totalMarks: 0,
          testType: 'mock',
          categoryId,
          examNameId: options?.examNameId || null,
          isActive: true,
          isFree: options?.isFree ?? true
        }
      })

      const questions = await parseDocxFileToQuestions(file)

      let qNum = 1
      for (const q of questions) {
        try {
          await prisma.question.create({
            data: {
              mockTestId: mockTest.id,
              questionNumber: qNum++,
              questionText: q.text,
              optionA: q.options.a,
              optionB: q.options.b,
              optionC: q.options.c,
              optionD: q.options.d,
              correctOption: q.correctAnswer.toUpperCase(),
              explanation: q.solution || null,
              subject: options?.subject || null
            }
          })
        } catch (err) {
          console.error('[WORD-PROCESSOR] Failed to insert mock test question', { qNum, err })
        }
      }

      // Update both Exam and MockTest with total marks
      await Promise.all([
        prisma.exam.update({
          where: { id: exam.id },
          data: { 
            totalMarks: questions.length,
            examUrl: `/test/${mockTest.id}` // Link to the test interface
          }
        }),
        prisma.mockTest.update({
          where: { id: mockTest.id },
          data: { totalMarks: questions.length }
        })
      ])

      console.log('[WORD-PROCESSOR] Completed mock test processing', { 
        examId: exam.id, 
        mockTestId: mockTest.id, 
        questions: questions.length 
      })
      return { mockTestId: mockTest.id, questionsCount: questions.length, type: 'mock', examId: exam.id }
    }
  }
} 