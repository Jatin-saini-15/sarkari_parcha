import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import mammoth from 'mammoth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const examNameId = formData.get('examNameId') as string;
    const duration = parseInt(formData.get('duration') as string);
    const totalMarks = parseInt(formData.get('totalMarks') as string);
    const negativeMarking = parseFloat(formData.get('negativeMarking') as string || '0');
    const passingMarks = parseInt(formData.get('passingMarks') as string || '0');
    const isFree = formData.get('isFree') === 'true';
    const sections = formData.get('sections') ? JSON.parse(formData.get('sections') as string) : [];

    if (!file || !title || !categoryId || !duration || !totalMarks) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Save upload record
    const docxUpload = await prisma.docxUpload.create({
      data: {
        originalName: file.name,
        fileName: filename,
        filePath: filepath,
        fileSize: file.size,
        uploadedBy: 'admin', // Replace with actual user ID from session
        status: 'UPLOADED',
      },
    });

    // Parse DOCX file
    const result = await mammoth.convertToHtml({ path: filepath });
    const htmlContent = result.value;

    // Parse the HTML content to extract questions
    const questions = await parseQuestionsFromHtml(htmlContent);

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found in the document' }, { status: 400 });
    }

    // Create slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Create mock test
    const mockTest = await prisma.mockTest.create({
      data: {
        title,
        slug,
        duration,
        totalMarks,
        negativeMarking,
        passingMarks,
        isFree,
        categoryId,
        examNameId: examNameId || null,
        docxUploadId: docxUpload.id,
        isActive: true,
      },
    });

    // Create sections if provided
    const sectionMap = new Map();
    if (sections.length > 0) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const testSection = await prisma.testSection.create({
          data: {
            mockTestId: mockTest.id,
            name: section.name,
            order: i + 1,
            duration: section.duration || null,
            totalMarks: section.totalMarks || null,
          },
        });
        sectionMap.set(section.name.toLowerCase(), testSection.id);
      }
    }

    // Create questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Determine section ID if sections are provided
      let sectionId = null;
      if (sectionMap.size > 0 && question.section) {
        sectionId = sectionMap.get(question.section.toLowerCase()) || null;
      }

      await prisma.question.create({
        data: {
          mockTestId: mockTest.id,
          sectionId,
          questionNumber: i + 1,
          questionText: question.text,
          optionA: question.options.a,
          optionB: question.options.b,
          optionC: question.options.c,
          optionD: question.options.d,
          correctOption: question.correctAnswer,
          explanation: question.solution,
          marks: 1,
        },
      });
    }

    // Update upload status
    await prisma.docxUpload.update({
      where: { id: docxUpload.id },
      data: { 
        status: 'PROCESSED',
        processingLog: JSON.stringify({
          questionsFound: questions.length,
          sectionsCreated: sectionMap.size,
          processedAt: new Date(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      mockTest: {
        id: mockTest.id,
        title: mockTest.title,
        questionsCount: questions.length,
        sectionsCount: sectionMap.size,
      },
    });

  } catch (error) {
    console.error('Error processing DOCX upload:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

async function parseQuestionsFromHtml(html: string) {
  const questions = [];
  
  // Split by question patterns (Q.1, Q.2, etc.)
  const questionBlocks = html.split(/Q\.\s*\d+/i).filter(block => block.trim());
  
  for (const block of questionBlocks) {
    try {
      const question = parseQuestionBlock(block);
      if (question) {
        questions.push(question);
      }
    } catch (error) {
      console.warn('Failed to parse question block:', error);
    }
  }
  
  return questions;
}

function parseQuestionBlock(block: string) {
  // Remove HTML tags and clean up
  const cleanText = block.replace(/<[^>]*>/g, '').trim();
  
  if (!cleanText) return null;

  // Split by answer pattern (Ans. or Answer:)
  const parts = cleanText.split(/(?:Ans\.?\s*|Answer:\s*)/i);
  
  if (parts.length < 2) return null;

  const questionPart = parts[0].trim();
  const answerPart = parts[1].trim();

  // Extract question text (everything before options)
  const optionPattern = /[a-d][\.\)]\s*/i;
  const optionMatch = questionPart.search(optionPattern);
  
  if (optionMatch === -1) return null;

  const questionText = questionPart.substring(0, optionMatch).trim();
  const optionsText = questionPart.substring(optionMatch);

  // Parse options
  const options = parseOptions(optionsText);
  if (!options) return null;

  // Extract correct answer
  const correctAnswer = answerPart.charAt(0).toLowerCase();
  if (!['a', 'b', 'c', 'd'].includes(correctAnswer)) return null;

  // Extract solution (everything after the answer)
  const solutionMatch = answerPart.match(/[a-d][\.\)]*\s*(.*)/i);
  const solution = solutionMatch ? solutionMatch[1].trim() : '';

  return {
    text: questionText,
    options,
    correctAnswer,
    solution,
    section: null, // Will be determined based on question content or position
  };
}

function parseOptions(optionsText: string) {
  const options = { a: '', b: '', c: '', d: '' };
  
  // Match options a, b, c, d
  const optionRegex = /([a-d])[\.\)]\s*([^a-d]*?)(?=[a-d][\.\)]|$)/gi;
  let match;
  
  while ((match = optionRegex.exec(optionsText)) !== null) {
    const letter = match[1].toLowerCase();
    const text = match[2].trim();
    
    if (['a', 'b', 'c', 'd'].includes(letter)) {
      options[letter as 'a' | 'b' | 'c' | 'd'] = text;
    }
  }
  
  // Check if all options are found
  if (!options.a || !options.b || !options.c || !options.d) {
    return null;
  }
  
  return options;
}