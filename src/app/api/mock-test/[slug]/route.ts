import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to find by slug first, then by ID if slug doesn't work
    let mockTest = await prisma.mockTest.findUnique({
      where: { slug },
      include: {
        category: true,
        examName: true,
        questions: {
          orderBy: { questionNumber: 'asc' },
          select: {
            id: true,
            questionNumber: true,
            questionText: true,
            questionImage: true,
            optionA: true,
            optionAImage: true,
            optionB: true,
            optionBImage: true,
            optionC: true,
            optionCImage: true,
            optionD: true,
            optionDImage: true,
            subject: true,
            difficulty: true,
            marks: true,
            // Don't include correct answer and explanation in the response
          }
        }
      }
    });

    // If not found by slug, try by ID
    if (!mockTest) {
      mockTest = await prisma.mockTest.findUnique({
        where: { id: slug }, // slug parameter might actually be an ID
        include: {
          category: true,
          examName: true,
          questions: {
            orderBy: { questionNumber: 'asc' },
            select: {
              id: true,
              questionNumber: true,
              questionText: true,
              questionImage: true,
              optionA: true,
              optionAImage: true,
              optionB: true,
              optionBImage: true,
              optionC: true,
              optionCImage: true,
              optionD: true,
              optionDImage: true,
              subject: true,
              difficulty: true,
              marks: true,
              // Don't include correct answer and explanation in the response
            }
          }
        }
      });
    }

    if (!mockTest) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    if (!mockTest.isActive) {
      return NextResponse.json({ error: 'Mock test is not active' }, { status: 403 });
    }

    return NextResponse.json({ mockTest });
  } catch (error) {
    console.error('Error fetching mock test:', error);
    return NextResponse.json({ error: 'Failed to fetch mock test' }, { status: 500 });
  }
}