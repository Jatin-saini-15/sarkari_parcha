import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testSeriesId, examIds } = body;

    if (!testSeriesId || !examIds || !Array.isArray(examIds)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // First, remove all exams from this test series
    await prisma.exam.updateMany({
      where: {
        testSeriesId: testSeriesId
      },
      data: {
        testSeriesId: null
      }
    });

    // Then, add the selected exams to this test series
    if (examIds.length > 0) {
      await prisma.exam.updateMany({
        where: {
          id: {
            in: examIds
          }
        },
        data: {
          testSeriesId: testSeriesId
        }
      });
    }

    return NextResponse.json({ message: 'Test series updated successfully' });
  } catch (error) {
    console.error('Error updating test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 