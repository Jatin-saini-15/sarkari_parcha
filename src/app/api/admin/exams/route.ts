import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [exams, examYears] = await Promise.all([
      prisma.exam.findMany({
        include: {
          examYear: {
            include: {
              category: true
            }
          },
          examName: true,
          testSeries: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          title: 'asc'
        }
      }),
      prisma.examYear.findMany({
        include: {
          category: true,
          _count: {
            select: {
              exams: true
            }
          }
        },
        orderBy: [
          { category: { name: 'asc' } },
          { year: 'desc' }
        ]
      })
    ]);

    return NextResponse.json({ exams, examYears });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      examUrl, 
      examType, 
      isFree, 
      duration, 
      totalMarks, 
      categoryId, 
      examNameId, 
      year,
      testSeriesId,
      scheduledAt,
      examEndTime
    } = body;

    console.log('Received data:', body);

    // Validate required fields
    if (!title || !examUrl || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For PYQ exams, year is required
    if (examType === 'pyq' && !year) {
      return NextResponse.json({ error: 'Year is required for PYQ exams' }, { status: 400 });
    }

    let examYear = null;
    const currentYear = new Date().getFullYear();
    
    // Create or get exam year for all exam types
    if (examType === 'pyq' && year) {
      // For PYQ, use the actual year
      examYear = await prisma.examYear.upsert({
        where: {
          categoryId_year: {
            categoryId,
            year: parseInt(year)
          }
        },
        update: {},
        create: {
          year: parseInt(year),
          categoryId,
          isActive: true
        }
      });
    } else {
      // For live tests and mock tests, use current year
      examYear = await prisma.examYear.upsert({
        where: {
          categoryId_year: {
            categoryId,
            year: currentYear
          }
        },
        update: {},
        create: {
          year: currentYear,
          categoryId,
          isActive: true
        }
      });
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Prepare exam data
    const examData = {
      title,
      slug,
      examUrl,
      examType: examType || 'mock',
      isActive: true,
      isFree: Boolean(isFree),
      duration: duration ? parseInt(duration) : null,
      totalMarks: totalMarks ? parseInt(totalMarks) : null,
      yearId: examYear.id,
      examNameId: examNameId || null,
      testSeriesId: testSeriesId || null,
      ...(examType === 'live' && scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      ...(examType === 'live' && examEndTime ? { examEndTime: new Date(examEndTime) } : {})
    };

    console.log('Creating exam with data:', examData);

    // Create exam
    const exam = await prisma.exam.create({
      data: examData,
      include: {
        examYear: {
          include: {
            category: true
          }
        },
        examName: true
      }
    });

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 