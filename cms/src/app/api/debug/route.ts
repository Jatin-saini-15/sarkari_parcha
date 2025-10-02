import { NextRequest, NextResponse } from 'next/server';
import { parseDocxQuestions, processMockTestFile } from '@/lib/docx-parser';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const mockTestId = url.searchParams.get('mockTestId');
    
    if (!mockTestId) {
      return NextResponse.json({ error: 'mockTestId is required' }, { status: 400 });
    }
    
    // Get the mock test
    const mockTest = await prisma.mockTest.findUnique({
      where: { id: mockTestId },
      include: {
        docxUpload: true,
        pdfUpload: true,
        questions: true,
        sections: true
      }
    });
    
    if (!mockTest) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }
    
    // Check if we have a DOCX file
    let filePath = '';
    if (mockTest.docxUpload) {
      filePath = path.join(process.cwd(), 'public', mockTest.docxUpload.filePath);
    } else if (mockTest.pdfUpload && mockTest.pdfUpload.filePath.endsWith('.docx')) {
      filePath = path.join(process.cwd(), 'public', mockTest.pdfUpload.filePath);
    } else {
      return NextResponse.json({ 
        error: 'No DOCX file found for this mock test',
        mockTest: {
          id: mockTest.id,
          title: mockTest.title,
          questionsCount: mockTest.questions.length,
          sectionsCount: mockTest.sections.length
        }
      }, { status: 400 });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        error: 'DOCX file not found on disk',
        filePath,
        mockTest: {
          id: mockTest.id,
          title: mockTest.title
        }
      }, { status: 404 });
    }
    
    // Read the file and parse questions
    const buffer = fs.readFileSync(filePath);
    const questions = await parseDocxQuestions(buffer);
    
    return NextResponse.json({
      mockTest: {
        id: mockTest.id,
        title: mockTest.title,
        questionsCount: mockTest.questions.length,
        sectionsCount: mockTest.sections.length
      },
      parsedQuestions: questions,
      parsedQuestionsCount: questions.length,
      success: questions.length > 0
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Failed to debug mock test',
      message: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Check if it's a DOCX file
    if (!file.name.toLowerCase().endsWith('.docx')) {
      return NextResponse.json({ error: 'Only DOCX files are supported' }, { status: 400 });
    }
    
    // Process the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'debug');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the file for reference
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    // Parse questions
    console.log('Parsing questions from uploaded file...');
    const questions = await parseDocxQuestions(buffer);
    
    // Try processing with sections
    const mockSections = [
      { id: '1', name: 'English', questions: 25, marks: 25 },
      { id: '2', name: 'Reasoning', questions: 25, marks: 25 },
      { id: '3', name: 'Quantitative Aptitude', questions: 25, marks: 25 },
      { id: '4', name: 'General Awareness', questions: 25, marks: 25 }
    ];
    
    let sectionedQuestions = null;
    try {
      if (questions.length > 0) {
        sectionedQuestions = await processMockTestFile(buffer, 'debug-test', mockSections);
      }
    } catch (error) {
      console.error('Error processing with sections:', error);
    }
    
    return NextResponse.json({
      filename: file.name,
      fileSize: file.size,
      savedPath: `/uploads/debug/${filename}`,
      parsedQuestions: questions.slice(0, 5), // Only send first 5 questions to keep response size reasonable
      parsedQuestionsCount: questions.length,
      sectionedQuestionsCount: sectionedQuestions ? 
        (Array.isArray(sectionedQuestions) ? sectionedQuestions.length : 'Not an array') : 
        'No sections processed',
      success: questions.length > 0
    });
  } catch (error) {
    console.error('Debug upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to process uploaded file',
      message: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
} 