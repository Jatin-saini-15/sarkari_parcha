import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id: testId } = await params;

    const questions = await prisma.question.findMany({
      where: { mockTestId: testId },
      orderBy: { questionNumber: 'asc' }
    });

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('[QUESTIONS][GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id: testId } = await params;
    const { questionId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation, marks } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(questionText && { questionText }),
        ...(optionA && { optionA }),
        ...(optionB && { optionB }),
        ...(optionC && { optionC }),
        ...(optionD && { optionD }),
        ...(correctOption && { correctOption: correctOption.toUpperCase() }),
        ...(explanation !== undefined && { explanation }),
        ...(marks && { marks: parseInt(marks) })
      }
    });

    console.log('[QUESTIONS][PATCH] Updated question:', questionId);

    return NextResponse.json({ 
      success: true, 
      question: updatedQuestion
    });
  } catch (error) {
    console.error('[QUESTIONS][PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id: testId } = await params;
    const { questionText, optionA, optionB, optionC, optionD, correctOption, explanation, marks } = await request.json();

    // Get the next question number
    const lastQuestion = await prisma.question.findFirst({
      where: { mockTestId: testId },
      orderBy: { questionNumber: 'desc' }
    });

    const questionNumber = (lastQuestion?.questionNumber || 0) + 1;

    // Create new question
    const newQuestion = await prisma.question.create({
      data: {
        mockTestId: testId,
        questionNumber,
        questionText: questionText || '',
        optionA: optionA || '',
        optionB: optionB || '',
        optionC: optionC || '',
        optionD: optionD || '',
        correctOption: (correctOption || 'A').toUpperCase(),
        explanation: explanation || null,
        marks: parseInt(marks) || 1
      }
    });

    console.log('[QUESTIONS][POST] Created question:', newQuestion.id);

    return NextResponse.json({ 
      success: true, 
      question: newQuestion
    });
  } catch (error) {
    console.error('[QUESTIONS][POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Delete question
    await prisma.question.delete({
      where: { id: questionId }
    });

    console.log('[QUESTIONS][DELETE] Deleted question:', questionId);

    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('[QUESTIONS][DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
