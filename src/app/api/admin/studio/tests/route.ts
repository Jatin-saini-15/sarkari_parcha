import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
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

    const tests = await prisma.mockTest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: true } },
        category: { select: { name: true } },
        examName: { select: { name: true } },
        folder: { select: { id: true, name: true } }
      }
    });

    const formattedTests = tests.map((test: any) => ({
      id: test.id,
      title: test.title,
      category: test.category?.name || 'Uncategorized',
      examName: test.examName?.name,
      duration: test.duration,
      totalMarks: test.totalMarks,
      questionsCount: test._count.questions,
      isFree: test.isFree,
      isActive: test.isActive,
      folderId: test.folderId,
      folderName: test.folder?.name,
      createdAt: test.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, tests: formattedTests });
  } catch (error) {
    console.error('[STUDIO-TESTS][GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    const { testId, folderId, title, duration, totalMarks, isFree, isActive } = await request.json();

    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    // Update test
    const updatedTest = await prisma.mockTest.update({
      where: { id: testId },
      data: {
        ...(folderId !== undefined && { folderId: folderId || null }),
        ...(title && { title }),
        ...(duration && { duration: parseInt(duration) }),
        ...(totalMarks && { totalMarks: parseInt(totalMarks) }),
        ...(isFree !== undefined && { isFree }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        category: { select: { name: true } },
        examName: { select: { name: true } },
        folder: { select: { id: true, name: true } },
        _count: { select: { questions: true } }
      }
    });

    // Also update the corresponding Exam record if it exists
    try {
      const correspondingExam = await prisma.exam.findFirst({
        where: { examUrl: `/test/${testId}` }
      });

      if (correspondingExam) {
        await prisma.exam.update({
          where: { id: correspondingExam.id },
          data: {
            ...(title && { title }),
            ...(duration && { duration: parseInt(duration) }),
            ...(totalMarks && { totalMarks: parseInt(totalMarks) }),
            ...(isFree !== undefined && { isFree }),
            ...(isActive !== undefined && { isActive })
          }
        });
        console.log('[STUDIO-TESTS][PATCH] Also updated corresponding Exam record:', correspondingExam.id);
      }
    } catch (error) {
      console.log('[STUDIO-TESTS][PATCH] No corresponding exam found or error updating exam:', error);
    }

    console.log('[STUDIO-TESTS][PATCH] Updated test:', testId);

    return NextResponse.json({ 
      success: true, 
      test: {
        id: updatedTest.id,
        title: updatedTest.title,
        category: updatedTest.category?.name || 'Uncategorized',
        examName: updatedTest.examName?.name,
        duration: updatedTest.duration,
        totalMarks: updatedTest.totalMarks,
        questionsCount: updatedTest._count.questions,
        isFree: updatedTest.isFree,
        isActive: updatedTest.isActive,
        folderId: updatedTest.folderId,
        folderName: updatedTest.folder?.name,
        createdAt: updatedTest.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('[STUDIO-TESTS][PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { testId } = await request.json();

    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    // Delete the test (this will cascade delete questions and attempts due to schema)
    await prisma.mockTest.delete({
      where: { id: testId }
    });

    // Also delete the corresponding Exam record if it exists
    try {
      await prisma.exam.deleteMany({
        where: { 
          examUrl: `/test/${testId}`
        }
      });
    } catch (error) {
      // Ignore if exam doesn't exist
      console.log('[STUDIO-TESTS][DELETE] No corresponding exam found for test:', testId);
    }

    console.log('[STUDIO-TESTS][DELETE] Deleted test:', testId);

    return NextResponse.json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    console.error('[STUDIO-TESTS][DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}

