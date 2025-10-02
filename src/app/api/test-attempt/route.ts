import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mockTestId, action, responses, attemptId } = await request.json();

    // For 'start' action, mockTestId is required
    // For 'submit' action, we'll get mockTestId from attemptId
    if (action === 'start' && !mockTestId) {
      return NextResponse.json({ error: 'Mock test ID is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'start') {
      // Start a new test attempt
      const mockTest = await prisma.mockTest.findUnique({
        where: { id: mockTestId },
        include: {
          _count: { select: { questions: true } }
        }
      });

      if (!mockTest) {
        return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
      }

      // Allow multiple concurrent attempts - removed restriction

      // Get the next attempt number
      const lastAttempt = await prisma.testAttempt.findFirst({
        where: {
          mockTestId,
          userId: user.id
        },
        orderBy: {
          attemptNumber: 'desc'
        }
      });

      const attemptNumber = (lastAttempt?.attemptNumber || 0) + 1;

      // Create new attempt
      const attempt = await prisma.testAttempt.create({
        data: {
          mockTestId,
          userId: user.id,
          attemptNumber,
          startTime: new Date(),
          totalQuestions: mockTest._count.questions,
          isCompleted: false
        }
      });

      return NextResponse.json({ 
        message: 'Test started successfully',
        attemptId: attempt.id,
        startTime: attempt.startTime
      });

    } else if (action === 'submit') {
      // Submit test responses
      if (!attemptId || !responses || !Array.isArray(responses)) {
        return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
      }

      // Get attempt
      const attempt = await prisma.testAttempt.findUnique({
        where: { id: attemptId },
        include: {
          mockTest: {
            include: {
              questions: {
                select: {
                  id: true,
                  questionNumber: true,
                  correctOption: true,
                  marks: true
                }
              }
            }
          }
        }
      });

      if (!attempt) {
        return NextResponse.json({ error: 'Test attempt not found' }, { status: 404 });
      }

      if (attempt.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      if (attempt.isCompleted) {
        return NextResponse.json({ error: 'Test already completed' }, { status: 400 });
      }

      // Calculate results
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let totalMarks = 0;
      const negativeMarking = attempt.mockTest.negativeMarking || 0;

      // Create question responses and calculate score
      for (const response of responses) {
        const question = attempt.mockTest.questions.find((q) => q.id === response.questionId);
        if (!question) continue;

        const isCorrect = response.selectedOption === question.correctOption;
        
        if (response.selectedOption) {
          if (isCorrect) {
            correctAnswers++;
            totalMarks += question.marks;
          } else {
            wrongAnswers++;
            totalMarks -= negativeMarking;
          }
        }

        // Create or update question response
        await prisma.questionResponse.upsert({
          where: {
            attemptId_questionId: {
              attemptId: attempt.id,
              questionId: question.id
            }
          },
          update: {
            selectedOption: response.selectedOption || null,
            isCorrect,
            timeTaken: response.timeTaken || null
          },
          create: {
            attemptId: attempt.id,
            questionId: question.id,
            selectedOption: response.selectedOption || null,
            isCorrect,
            timeTaken: response.timeTaken || null
          }
        });
      }

      const skippedQuestions = attempt.totalQuestions - correctAnswers - wrongAnswers;
      const percentage = attempt.totalQuestions > 0 ? (correctAnswers / attempt.totalQuestions) * 100 : 0;
      const timeTaken = Math.round((Date.now() - attempt.startTime.getTime()) / 1000 / 60); // in minutes

      // Update attempt
      await prisma.testAttempt.update({
        where: { id: attempt.id },
        data: {
          endTime: new Date(),
          attemptedQuestions: correctAnswers + wrongAnswers,
          correctAnswers,
          wrongAnswers,
          skippedQuestions,
          totalMarks,
          percentage,
          timeTaken,
          isCompleted: true
        }
      });

      return NextResponse.json({
        message: 'Test submitted successfully',
        attemptId: attempt.id,
        results: {
          totalQuestions: attempt.totalQuestions,
          attemptedQuestions: correctAnswers + wrongAnswers,
          correctAnswers,
          wrongAnswers,
          skippedQuestions,
          totalMarks,
          percentage: Math.round(percentage * 100) / 100,
          timeTaken
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error handling test attempt:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mockTestId = searchParams.get('mockTestId');
    const attemptId = searchParams.get('attemptId');

    if (!mockTestId && !attemptId) {
      return NextResponse.json({ error: 'Mock test ID or attempt ID is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (attemptId) {
      // Get attempt results with answers
      const attempt = await prisma.testAttempt.findUnique({
        where: { id: attemptId },
        include: {
          mockTest: {
            include: {
              category: true,
              examName: true
            }
          },
          responses: {
            include: {
              question: {
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
                  correctOption: true,
                  explanation: true,
                  subject: true,
                  difficulty: true,
                  marks: true
                }
              }
            }
          }
        }
      });

      if (!attempt) {
        return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
      }

      if (attempt.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      return NextResponse.json({ attempt });
    } else {
      // Get user's latest attempt for this test
      const attempt = await prisma.testAttempt.findFirst({
        where: {
          mockTestId: mockTestId!,
          userId: user.id
        },
        orderBy: {
          attemptNumber: 'desc'
        }
      });

      return NextResponse.json({ attempt });
    }

  } catch (error) {
    console.error('Error fetching test attempt:', error);
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 });
  }
}