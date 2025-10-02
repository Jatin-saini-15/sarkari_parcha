import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all test series directly instead of categories
    const testSeries = await prisma.testSeries.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true,
        _count: {
          select: {
            exams: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ testSeries });
  } catch (error) {
    console.error('Error fetching test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 