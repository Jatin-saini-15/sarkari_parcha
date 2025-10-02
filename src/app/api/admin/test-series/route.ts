import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testSeries = await prisma.testSeries.findMany({
      include: {
        category: true,
        _count: {
          select: {
            exams: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ testSeries });
  } catch (error) {
    console.error('Error fetching test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth check to debug
    // const session = await getServerSession();
    
    const body = await request.json();
    const { name, description, categoryId, isFree } = body;

    console.log('Creating test series with data:', body);

    // Validate required fields
    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create test series
    const testSeries = await prisma.testSeries.create({
      data: {
        name,
        slug,
        description: description || null,
        categoryId,
        isFree: Boolean(isFree),
        isActive: true
      },
      include: {
        category: true,
        _count: {
          select: {
            exams: true
          }
        }
      }
    });

    return NextResponse.json({ testSeries });
  } catch (error) {
    console.error('Error creating test series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 