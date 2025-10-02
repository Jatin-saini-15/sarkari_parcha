import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  try {
    const { category, slug } = await params;

    // Find the category by slug
    const categoryData = await prisma.examCategory.findUnique({
      where: { slug: category }
    });

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Find the test series by slug and category
    const testSeries = await prisma.testSeries.findFirst({
      where: { 
        slug: slug,
        categoryId: categoryData.id
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        exams: {
          where: {
            isActive: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!testSeries) {
      return NextResponse.json({ error: 'Test series not found' }, { status: 404 });
    }

    // Transform the response to match the expected interface
    const transformedTestSeries = {
      ...testSeries,
      tests: testSeries.exams // Rename exams to tests for frontend compatibility
    };

    return NextResponse.json({ testSeries: transformedTestSeries });
  } catch (error) {
    console.error('Error fetching test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 