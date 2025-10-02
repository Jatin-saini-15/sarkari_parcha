import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all active categories
    const categories = await prisma.examCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // For each category, count mock tests properly
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const mockTestCount = await prisma.exam.count({
          where: {
            examType: 'mock',
            isActive: true,
            examYear: {
              categoryId: category.id
            }
          }
        });

        return {
          ...category,
          _count: {
            exams: mockTestCount
          }
        };
      })
    );

    // Filter out categories with no mock tests
    const categoriesWithMockTests = categoriesWithCounts.filter(category => category._count.exams > 0);

    return NextResponse.json({ categories: categoriesWithMockTests });
  } catch (error) {
    console.error('Error fetching mock test categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 