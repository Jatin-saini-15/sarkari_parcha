import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const prismaClient = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let users;
    try {
      users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching users from database:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Process users with subscription info and remaining days calculation
    const usersWithSubscriptionInfo = users.map((user) => {
      const latestSubscription = user.subscriptions[0] || null;
      
      let remainingDays = 0;
      try {
        if (user.isPremium && user.premiumUntil) {
          const endDate = new Date(user.premiumUntil);
          const now = new Date();
          if (endDate > now) {
            remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          }
        } else if (latestSubscription && latestSubscription.status === 'ACTIVE') {
          const endDate = new Date(latestSubscription.endDate);
          const now = new Date();
          if (endDate > now) {
            remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          }
        }
      } catch (error) {
        console.error('Error calculating remaining days for user:', user.id, error);
        remainingDays = 0;
      }

      let preferredExams = [];
      try {
        preferredExams = user.preferredExams ? JSON.parse(user.preferredExams) : [];
      } catch (error) {
        console.error('Error parsing preferred exams for user:', user.id, error);
        preferredExams = [];
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        role: user.role,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
        preferredExams,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        latestSubscription: latestSubscription ? {
          id: latestSubscription.id,
          type: latestSubscription.type,
          status: latestSubscription.status,
          startDate: latestSubscription.startDate,
          endDate: latestSubscription.endDate,
          couponCode: latestSubscription.couponCode,
          amount: latestSubscription.amount
        } : null,
        remainingDays
      };
    });

    return NextResponse.json({ users: usersWithSubscriptionInfo });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, role = 'user' } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        role
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 