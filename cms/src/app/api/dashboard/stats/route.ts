import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get dashboard statistics
    const [
      totalMockTests,
      totalUsers,
      totalQuestions,
      testAttempts,
      recentUploads,
      activeUsers
    ] = await Promise.all([
      prisma.mockTest.count(),
      prisma.user.count(),
      prisma.question.count(),
      prisma.testAttempt.count(),
      prisma.mockTest.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ])

    return NextResponse.json({
      totalMockTests,
      totalUsers,
      totalQuestions,
      testAttempts,
      recentUploads,
      activeUsers
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}