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

    // For each category, count live tests properly
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const liveTestCount = await prisma.exam.count({
          where: {
            examType: 'live',
            isActive: true,
            examYear: {
              categoryId: category.id
            }
          }
        });

        return {
          ...category,
          _count: {
            exams: liveTestCount
          }
        };
      })
    );

    // Filter out categories with no live tests
    const categoriesWithLiveTests = categoriesWithCounts.filter(category => category._count.exams > 0);

    return NextResponse.json({ categories: categoriesWithLiveTests });
  } catch (error) {
    console.error('Error fetching live test categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 