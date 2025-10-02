import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { slugify } from '@/lib/utils'
import { processMockTestFile } from '@/lib/docx-parser'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Mock test upload started');
    const formData = await request.formData()
    const file = formData.get('file') as File
    const testName = formData.get('testName') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const duration = parseInt(formData.get('duration') as string)
    const totalMarks = parseInt(formData.get('totalQuestions') as string)
    const negativeMarking = formData.get('negativeMarking') ? 
      parseFloat(formData.get('negativeMarking') as string) : null
    const sectionsJson = formData.get('sections') as string
    const sections = sectionsJson ? JSON.parse(sectionsJson) : null

    console.log('Form data parsed:', { 
      fileName: file?.name, 
      fileSize: file?.size,
      testName, 
      category, 
      duration, 
      totalMarks,
      sectionsCount: sections?.length || 0 
    });

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Get category from database or create if it doesn't exist
    let examCategory = await prisma.examCategory.findFirst({
      where: { 
        name: category
      }
    })

    if (!examCategory) {
      console.log(`Category "${category}" not found, creating new category`);
      examCategory = await prisma.examCategory.create({
        data: {
          name: category,
          slug: slugify(category),
          isActive: true
        }
      })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'mock-tests')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = new Date().getTime()
    const filename = `${timestamp}-${file.name}`
    const filepath = path.join(uploadsDir, filename)

    // Save file
    console.log(`Saving file to ${filepath}`);
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)
    console.log('File saved successfully');

    // Create DOCX upload record if it's a DOCX file
    let docxUpload = null
    if (file.name.toLowerCase().endsWith('.docx')) {
      console.log('Creating DOCX upload record');
      docxUpload = await prisma.docxUpload.create({
        data: {
          originalName: file.name,
          fileName: filename,
          filePath: `/uploads/mock-tests/${filename}`,
          fileSize: file.size,
          uploadedBy: 'admin', // TODO: Replace with actual user ID
          status: 'UPLOADED'
        }
      })
      console.log('DOCX upload record created with ID:', docxUpload.id);
    }

    // Create PDF upload record for other file types
    let pdfUpload = null
    if (!docxUpload) {
      console.log('Creating PDF upload record');
      pdfUpload = await prisma.pdfUpload.create({
        data: {
          originalName: file.name,
          fileName: filename,
          filePath: `/uploads/mock-tests/${filename}`,
          fileSize: file.size,
          uploadedBy: 'admin', // TODO: Replace with actual user ID
          status: 'UPLOADED',
          categoryId: examCategory.id
        }
      })
      console.log('PDF upload record created with ID:', pdfUpload.id);
    }

    // Create mock test record in database
    console.log('Creating mock test record');
    const mockTest = await prisma.mockTest.create({
      data: {
        title: testName,
        slug: slugify(testName),
        description,
        duration,
        totalMarks,
        negativeMarking,
        isActive: true,
        isFree: true,
        categoryId: examCategory.id,
        pdfUploadId: pdfUpload?.id,
        docxUploadId: docxUpload?.id,
        instructions: `This is a mock test for ${category}. Total duration is ${duration} minutes. Total marks are ${totalMarks}.`
      }
    })
    console.log('Mock test created with ID:', mockTest.id);

    // Create test sections in the database if provided
    const dbSections = []
    if (sections && sections.length > 0) {
      console.log(`Creating ${sections.length} test sections`);
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        console.log(`Creating section: ${section.name}`);
        const dbSection = await prisma.testSection.create({
          data: {
            mockTestId: mockTest.id,
            name: section.name,
            order: i + 1,
            duration: null, // Optional section-specific duration
            totalMarks: section.marks
          }
        })
        console.log(`Section created with ID: ${dbSection.id}`);
        dbSections.push({
          ...dbSection,
          questions: section.questions
        })
      }
    }

    // Process the file to extract questions
    try {
      // Only process DOCX files
      if (file.name.toLowerCase().endsWith('.docx')) {
        // Update DOCX upload status
        if (docxUpload) {
          await prisma.docxUpload.update({
            where: { id: docxUpload.id },
            data: { status: 'PROCESSING' }
          })
        }

        console.log('Starting DOCX processing for question extraction');
        // Process the file
        const processedData = await processMockTestFile(buffer, mockTest.id, sections)
        console.log('DOCX processing completed, processedData:', 
          Array.isArray(processedData) ? `Array with ${processedData.length} items` : 'Not an array');
        
        if (sections && sections.length > 0 && dbSections.length > 0) {
          // Process sectional questions
          let questionNumber = 1
          // processedData is an array of section objects with questions
          type SectionData = {
            sectionName: string
            questions: Array<{
              questionNumber: number
              questionText: string
              optionA: string
              optionB: string
              optionC: string
              optionD: string
              correctOption: string
              explanation?: string
              mockTestId: string
              subject: string
              marks: number
            }>
          }
          
          console.log('Processing sectional questions');
          for (const sectionData of processedData as SectionData[]) {
            // Find the matching db section
            const dbSection = dbSections.find(s => s.name === sectionData.sectionName)
            
            if (dbSection) {
              console.log(`Found matching section "${dbSection.name}" with ID ${dbSection.id}`);
              console.log(`Processing ${sectionData.questions.length} questions for section "${sectionData.sectionName}"`);
              
              for (const question of sectionData.questions) {
                console.log(`Creating question ${questionNumber}: ${question.questionText.substring(0, 30)}...`);
                await prisma.question.create({
                  data: {
                    mockTestId: mockTest.id,
                    sectionId: dbSection.id, // Associate with the correct section
                    questionNumber: questionNumber++,
                    questionText: question.questionText,
                    optionA: question.optionA,
                    optionB: question.optionB,
                    optionC: question.optionC,
                    optionD: question.optionD,
                    correctOption: question.correctOption,
                    explanation: question.explanation,
                    subject: question.subject,
                    marks: question.marks
                  }
                })
              }
            } else {
              console.warn(`No matching section found for "${sectionData.sectionName}"`);
            }
          }
        } else {
          // Process all questions without sections
          // processedData is an array of question objects
          type QuestionData = {
            questionNumber: number
            questionText: string
            optionA: string
            optionB: string
            optionC: string
            optionD: string
            correctOption: string
            explanation?: string
            mockTestId: string
            marks: number
          }
          
          console.log('Processing questions without sections');
          const questions = processedData as QuestionData[]
          console.log(`Found ${questions.length} questions to create`);
          
          for (const question of questions) {
            console.log(`Creating question ${question.questionNumber}: ${question.questionText.substring(0, 30)}...`);
            await prisma.question.create({
              data: {
                mockTestId: mockTest.id,
                questionNumber: question.questionNumber,
                questionText: question.questionText,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD,
                correctOption: question.correctOption,
                explanation: question.explanation,
                marks: question.marks
              }
            })
          }
        }
        
        // Update upload status to PROCESSED
        if (docxUpload) {
          console.log('Updating DOCX upload status to PROCESSED');
          await prisma.docxUpload.update({
            where: { id: docxUpload.id },
            data: { 
              status: 'PROCESSED',
              processingLog: JSON.stringify({ 
                questionsExtracted: true,
                timestamp: new Date().toISOString() 
              })
            }
          })
        }
      }
    } catch (error) {
      console.error('Error processing questions:', error)
      // Update upload status to FAILED
      if (docxUpload) {
        console.log('Updating DOCX upload status to FAILED');
        await prisma.docxUpload.update({
          where: { id: docxUpload.id },
          data: { 
            status: 'FAILED',
            processingLog: JSON.stringify({ 
              error: (error as Error).message,
              stack: (error as Error).stack
            })
          }
        })
      }
      
      // Return error but don't fail the request since the mock test was created
      return NextResponse.json({
        message: 'Mock test created but question extraction failed',
        error: (error as Error).message,
        mockTest
      })
    }

    // Count the questions that were actually created
    const questionCount = await prisma.question.count({
      where: { mockTestId: mockTest.id }
    })
    console.log(`Total questions created for mock test: ${questionCount}`);

    return NextResponse.json({
      message: 'Mock test uploaded successfully',
      mockTest,
      questionsCount: questionCount
    })
  } catch (error) {
    console.error('Error uploading mock test:', error)
    return NextResponse.json(
      { error: 'Failed to upload mock test: ' + (error as Error).message },
      { status: 500 }
    )
  }
}