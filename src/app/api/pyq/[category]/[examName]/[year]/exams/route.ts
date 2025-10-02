import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; examName: string; year: string }> }
) {
  try {
    const { category, examName, year } = await params;
    const yearInt = parseInt(year);

    if (isNaN(yearInt)) {
      return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
    }

    // Find the category
    const categoryData = await prisma.examCategory.findFirst({
      where: { slug: category }
    });

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Find the exam name
    const examNameData = await prisma.examName.findFirst({
      where: { 
        slug: examName,
        categoryId: categoryData.id
      }
    });

    if (!examNameData) {
      return NextResponse.json({ error: 'Exam name not found' }, { status: 404 });
    }

    // Find exams for the specific exam name, category, and year
    const exams = await prisma.exam.findMany({
      where: {
        examType: 'pyq',
        examNameId: examNameData.id,
        examYear: {
          year: yearInt,
          categoryId: categoryData.id
        }
      },
      include: {
        examYear: {
          include: {
            category: true
          }
        },
        examName: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({ exams });
  } catch (error) {
    console.error('Error fetching exam name exams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 