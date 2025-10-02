import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId } = await params;

    // Get the attempt to find the test
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        mockTest: true,
        user: true
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Get all completed attempts for this test, ordered by score and time
    const allAttempts = await prisma.testAttempt.findMany({
      where: {
        mockTestId: attempt.mockTestId,
        isCompleted: true
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { totalMarks: 'desc' },
        { timeTaken: 'asc' }
      ]
    });

    // Create leaderboard with rankings
    const leaderboard = allAttempts.map((att, index) => ({
      rank: index + 1,
      userName: att.user.email === session.user.email ? 'You' : (att.user.name || 'Anonymous'),
      totalMarks: att.totalMarks,
      percentage: att.percentage,
      timeTaken: att.timeTaken || 0,
      attemptNumber: att.attemptNumber,
      isCurrentUser: att.user.email === session.user.email
    }));

    return NextResponse.json({ 
      success: true, 
      leaderboard,
      totalParticipants: allAttempts.length
    });
  } catch (error) {
    console.error('[LEADERBOARD][GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
