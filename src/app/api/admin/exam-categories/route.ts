import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hardcoded categories as fallback
const hardcodedCategories = [
  { id: 'ssc', name: 'SSC Exams', slug: 'ssc', isActive: true, _count: { examYears: 5 } },
  { id: 'banking', name: 'Banking', slug: 'banking', isActive: true, _count: { examYears: 4 } },
  { id: 'railways', name: 'Railways (RRB)', slug: 'railways', isActive: true, _count: { examYears: 3 } },
  { id: 'defence', name: 'Defence', slug: 'defence', isActive: true, _count: { examYears: 4 } },
  { id: 'teaching', name: 'Teaching', slug: 'teaching', isActive: true, _count: { examYears: 5 } },
  { id: 'upsc', name: 'UPSC', slug: 'upsc', isActive: true, _count: { examYears: 3 } },
  { id: 'state-psc', name: 'State PSC', slug: 'state-psc', isActive: true, _count: { examYears: 4 } },
  { id: 'police', name: 'Police Recruitment', slug: 'police', isActive: true, _count: { examYears: 3 } },
  { id: 'insurance', name: 'Insurance', slug: 'insurance', isActive: true, _count: { examYears: 2 } },
  { id: 'judiciary', name: 'Judiciary', slug: 'judiciary', isActive: true, _count: { examYears: 2 } },
  { id: 'entrance', name: 'Entrance Exams', slug: 'entrance', isActive: true, _count: { examYears: 3 } }
];

export async function GET() {
  try {
    // Try database first
    try {
      const categories = await prisma.examCategory.findMany({
        include: {
          _count: {
            select: {
              examYears: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      if (categories.length > 0) {
        return NextResponse.json({ categories });
      }
    } catch (dbError) {
      console.log('Database error, using hardcoded categories:', dbError);
    }

    // Fallback to hardcoded categories
    return NextResponse.json({ categories: hardcodedCategories });
  } catch (error) {
    console.error('Error fetching exam categories:', error);
    // Even if everything fails, return hardcoded categories
    return NextResponse.json({ categories: hardcodedCategories });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-expect-error - NextAuth session type
    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.examCategory.create({
      data: {
        name,
        slug,
        description,
        isActive: true
      }
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error creating exam category:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 