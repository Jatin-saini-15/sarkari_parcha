import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Get live tests for this category
    const tests = await prisma.exam.findMany({
      where: {
        examType: 'live',
        isActive: true,
        examYear: {
          categoryId: categoryData.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching live tests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 