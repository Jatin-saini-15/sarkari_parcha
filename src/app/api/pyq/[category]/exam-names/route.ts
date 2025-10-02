import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Find the category
    const categoryData = await prisma.examCategory.findFirst({
      where: { slug: category }
    });

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Find exam names for the category that have PYQ exams
    const examNames = await prisma.examName.findMany({
      where: {
        categoryId: categoryData.id,
        exams: {
          some: {
            examType: 'pyq'
          }
        }
      },
      include: {
        _count: {
          select: {
            exams: {
              where: {
                examType: 'pyq'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ 
      examNames,
      category: {
        name: categoryData.name,
        description: categoryData.description
      }
    });
  } catch (error) {
    console.error('Error fetching exam names:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 