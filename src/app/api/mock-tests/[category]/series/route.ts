import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Find the category
    const categoryData = await prisma.examCategory.findUnique({
      where: { slug: category }
    });

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Return empty test series for now since testSeries model is not properly configured
    const testSeries: never[] = [];

    return NextResponse.json({ testSeries, category: categoryData });
  } catch (error) {
    console.error('Error fetching test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 