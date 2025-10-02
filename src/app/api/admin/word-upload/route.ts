// API endpoint for Word file upload and processing
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { simpleWordProcessor } from '@/lib/word-processing';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^\-+/, '')
    .replace(/\-+$/, '')
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const recentTests = await prisma.mockTest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        _count: { select: { questions: true } },
        category: { select: { name: true } },
        examName: { select: { name: true } }
      }
    });

    const formattedTests = recentTests.map((test: any) => ({
      id: test.id,
      title: test.title,
      category: test.category?.name,
      examName: test.examName?.name,
      duration: test.duration,
      totalMarks: test.totalMarks,
      questionsCount: test._count.questions,
      isFree: test.isFree,
      isActive: test.isActive,
      createdAt: test.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data: formattedTests });
  } catch (error) {
    console.error('[WORD-UPLOAD][GET] Error fetching uploads:', error);
    return NextResponse.json({ error: 'Failed to fetch uploads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const testName = formData.get('testName') as string;
    const rawCategory = (formData.get('categoryId') as string) || '';
    const testType = (formData.get('testType') as string) || 'mock';
    const examName = (formData.get('examName') as string) || '';
    const year = (formData.get('year') as string) || '';
    const subject = (formData.get('subject') as string) || '';
    const isFree = (formData.get('isFree') as string) === 'true';

    console.log('[WORD-UPLOAD][POST] Incoming', {
      fileName: file?.name,
      fileSize: file?.size,
      testName,
      rawCategory,
      testType,
      examName,
      year,
      subject,
      isFree
    });

    if (!file || !testName || !rawCategory || !examName) {
      return NextResponse.json({ error: 'Missing required fields (file, testName, category, examName)' }, { status: 400 });
    }

    // Validate PYQ requirements
    if (testType === 'pyq' && !year) {
      return NextResponse.json({ error: 'Year is required for Previous Year Questions (PYQ)' }, { status: 400 });
    }

    // Resolve category by id or slug/name; create if missing
    let categoryId = rawCategory
    let category = await prisma.examCategory.findUnique({ where: { id: categoryId } })
    if (!category) {
      const categorySlug = slugify(rawCategory)
      category = await prisma.examCategory.findFirst({ where: { slug: categorySlug } })
      if (!category) {
        // Try name match (case-insensitive fallback: approximate)
        category = await prisma.examCategory.findFirst({ where: { name: rawCategory } })
      }
      if (!category) {
        console.log('[WORD-UPLOAD][POST] Creating missing category', { categorySlug })
        category = await prisma.examCategory.create({
          data: { name: rawCategory, slug: categorySlug, isActive: true }
        })
      }
      categoryId = category.id
    }

    // Find or create ExamName
    const examSlug = slugify(examName);
    let examNameRecord = await prisma.examName.findFirst({
      where: {
        OR: [
          { name: examName, categoryId: categoryId },
          { slug: examSlug, categoryId: categoryId }
        ]
      }
    });

    if (!examNameRecord) {
      try {
        examNameRecord = await prisma.examName.create({
          data: {
            name: examName,
            slug: examSlug,
            categoryId: categoryId,
            isActive: true
          }
        });
        console.log('[WORD-UPLOAD][POST] Created new exam name:', examName);
      } catch (error: any) {
        // If creation fails due to unique constraint, try to find it again
        if (error.code === 'P2002') {
          examNameRecord = await prisma.examName.findFirst({
            where: {
              OR: [
                { name: examName, categoryId: categoryId },
                { slug: examSlug, categoryId: categoryId }
              ]
            }
          });
          if (!examNameRecord) {
            throw error; // Re-throw if we still can't find it
          }
          console.log('[WORD-UPLOAD][POST] Found existing exam name after constraint error:', examName);
        } else {
          throw error;
        }
      }
    }

    const result = await simpleWordProcessor.processDocxFile(
      file,
      testName,
      categoryId,
      {
        testType: testType as 'mock' | 'pyq',
        examNameId: examNameRecord.id,
        year: year ? parseInt(year) : undefined,
        subject,
        isFree
      }
    );

    console.log('[WORD-UPLOAD][POST] Success', {
      mockTestId: result.mockTestId,
      questionsProcessed: result.questionsCount,
    });

    return NextResponse.json({ 
      success: true, 
      mockTestId: result.mockTestId,
      questionsProcessed: result.questionsCount,
      message: 'Word document processed successfully'
    });

  } catch (error) {
    console.error('[WORD-UPLOAD][POST] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process Word document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}