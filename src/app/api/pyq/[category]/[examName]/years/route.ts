import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; examName: string }> }
) {
  try {
    const { category, examName } = await params;

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

    // Find exam years for the specific exam name and category
    const examYears = await prisma.examYear.findMany({
      where: {
        categoryId: categoryData.id,
        exams: {
          some: {
            examType: 'pyq',
            examNameId: examNameData.id
          }
        }
      },
      include: {
        category: true,
        _count: {
          select: {
            exams: {
              where: {
                examType: 'pyq',
                examNameId: examNameData.id
              }
            }
          }
        }
      },
      orderBy: {
        year: 'desc'
      }
    });

    return NextResponse.json({ 
      examYears,
      examName: examNameData
    });
  } catch (error) {
    console.error('Error fetching exam years:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 