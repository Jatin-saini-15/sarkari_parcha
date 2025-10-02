import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use a singleton pattern for Prisma client to avoid too many connections
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mockTest = await prisma.mockTest.findUnique({
      where: {
        id: params.id
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        questions: {
          orderBy: {
            questionNumber: 'asc'
          }
        }
      }
    })

    if (!mockTest) {
      return NextResponse.json(
        { error: 'Mock test not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(mockTest)
  } catch (error) {
    console.error('Error fetching mock test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mock test' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const mockTest = await prisma.mockTest.update({
      where: {
        id: params.id
      },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        instructions: data.instructions,
        duration: data.duration,
        totalMarks: data.totalMarks,
        negativeMarking: data.negativeMarking,
        isActive: data.isActive,
        isFree: data.isFree,
        categoryId: data.categoryId
      }
    })

    return NextResponse.json(mockTest)
  } catch (error) {
    console.error('Error updating mock test:', error)
    return NextResponse.json(
      { error: 'Failed to update mock test' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Starting deletion of mock test with ID: ${params.id}`);
    
    // First check if the mock test exists
    const mockTest = await prisma.mockTest.findUnique({
      where: { id: params.id }
    });
    
    if (!mockTest) {
      console.log(`Mock test with ID ${params.id} not found`);
      return NextResponse.json(
        { error: 'Mock test not found' },
        { status: 404 }
      );
    }
    
    // Delete all questions associated with the mock test
    console.log(`Deleting questions for mock test: ${params.id}`);
    await prisma.question.deleteMany({
      where: { mockTestId: params.id }
    });
    
    // Delete all sections associated with the mock test
    console.log(`Deleting sections for mock test: ${params.id}`);
    await prisma.testSection.deleteMany({
      where: { mockTestId: params.id }
    });
    
    // Delete the mock test
    console.log(`Deleting mock test: ${params.id}`);
    const deletedTest = await prisma.mockTest.delete({
      where: { id: params.id }
    });
    
    console.log(`Successfully deleted mock test: ${deletedTest.title}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Mock test and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mock test:', error);
    return NextResponse.json(
      { error: 'Failed to delete mock test', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 