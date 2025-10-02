import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('Updating exam with data:', body);

    // Get the current exam to check its type and yearId
    const currentExam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examYear: {
          include: {
            category: true
          }
        }
      }
    });

    if (!currentExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      title: body.title,
      examUrl: body.examUrl,
      duration: body.duration,
      totalMarks: body.totalMarks,
      isFree: body.isFree,
      isActive: body.isActive,
    };

    // Handle category changes
    if (body.categoryId && body.categoryId !== currentExam.examYear?.categoryId) {
      if (currentExam.examType === 'pyq' && currentExam.examYear) {
        // For PYQ exams, find or create examYear with the same year but new category
        const examYear = await prisma.examYear.upsert({
          where: {
            categoryId_year: {
              categoryId: body.categoryId,
              year: currentExam.examYear.year
            }
          },
          update: {},
          create: {
            year: currentExam.examYear.year,
            categoryId: body.categoryId,
            isActive: true
          }
        });
        updateData.yearId = examYear.id;
      } else {
        // For live and mock tests, use current year
        const currentYear = new Date().getFullYear();
        const examYear = await prisma.examYear.upsert({
          where: {
            categoryId_year: {
              categoryId: body.categoryId,
              year: currentYear
            }
          },
          update: {},
          create: {
            year: currentYear,
            categoryId: body.categoryId,
            isActive: true
          }
        });
        updateData.yearId = examYear.id;
      }
    }

    // Preserve exam type and other important fields
    if (body.examType) {
      updateData.examType = body.examType;
    }
    if (body.yearId) {
      updateData.yearId = body.yearId;
    }

    // Handle examNameId
    if (body.examNameId !== undefined) {
      updateData.examNameId = body.examNameId || null;
    }

    // Handle scheduling for live tests
    if (body.scheduledAt) {
      updateData.scheduledAt = new Date(body.scheduledAt);
    }
    if (body.examEndTime) {
      updateData.examEndTime = new Date(body.examEndTime);
    }

    console.log('Final update data:', updateData);

    const exam = await prisma.exam.update({
      where: { id },
      data: updateData,
      include: {
        examYear: {
          include: {
            category: true
          }
        },
        examName: true
      }
    });

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Delete the exam
    await prisma.exam.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 