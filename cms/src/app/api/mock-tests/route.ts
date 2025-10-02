import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const isActive = url.searchParams.get('isActive')
    
    const where: {
      categoryId?: string;
      isActive?: boolean;
    } = {}
    if (categoryId) where.categoryId = categoryId
    if (isActive) where.isActive = isActive === 'true'
    
    const mockTests = await prisma.mockTest.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        sections: true,
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const transformedTests = mockTests.map(test => ({
      ...test,
      questionCount: test._count.questions,
      _count: undefined
    }))
    
    return NextResponse.json(transformedTests)
  } catch (error) {
    console.error('Error fetching mock tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mock tests' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const mockTest = await prisma.mockTest.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        duration: data.duration,
        totalMarks: data.totalMarks,
        negativeMarking: data.negativeMarking,
        isActive: data.isActive ?? true,
        isFree: data.isFree ?? true,
        instructions: data.instructions
      }
    })

    return NextResponse.json(mockTest)
  } catch (error) {
    console.error('Error creating mock test:', error)
    return NextResponse.json(
      { error: 'Failed to create mock test' },
      { status: 500 }
    )
  }
}