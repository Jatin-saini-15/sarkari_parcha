import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Find the category by slug
    const categoryData = await prisma.examCategory.findUnique({
      where: { slug: category }
    });

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Get mock tests for this category (exclude PYQ tests)
    const mockTests = await prisma.mockTest.findMany({
      where: {
        isActive: true,
        categoryId: categoryData.id,
        testType: 'mock'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isFree: true,
        duration: true,
        totalMarks: true,
        examName: {
          select: {
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    // Transform the data to match expected interface
    const tests = mockTests.map(test => ({
      id: test.id,
      title: test.title,
      slug: test.slug,
      description: test.description || '',
      examUrl: `/test/${test.id}`, // Link to the test interface
      isFree: test.isFree,
      duration: test.duration,
      totalMarks: test.totalMarks,
      examName: test.examName?.name,
      questionsCount: test._count.questions
    }));

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 