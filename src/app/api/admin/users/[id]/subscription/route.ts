import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin/owner role
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action, days } = await request.json();

    if (!action || !days || days <= 0) {
      return NextResponse.json({ error: 'Invalid action or days' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    let newEndDate: Date;
    // Create unique subscription type with timestamp to avoid conflicts
    const subscriptionType = `ADMIN_${action.toUpperCase()}_${Date.now()}`;
    let subscriptionStatus = 'ACTIVE';

    // Calculate new end date based on current subscription
    if (user.isPremium && user.premiumUntil && user.premiumUntil > now) {
      // User has active premium, modify from current end date
      newEndDate = new Date(user.premiumUntil);
    } else {
      // User doesn't have active premium, start from now
      newEndDate = new Date(now);
    }

    // Modify the date based on action
    if (action === 'add') {
      newEndDate.setDate(newEndDate.getDate() + days);
    } else if (action === 'remove') {
      newEndDate.setDate(newEndDate.getDate() - days);
      // If the new date is in the past or equal to now, set status to expired
      if (newEndDate <= now) {
        subscriptionStatus = 'EXPIRED';
        newEndDate = now; // Set end date to now for expired subscriptions
      }
    }

    // Create a new subscription record for admin action tracking
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        type: subscriptionType,
        status: subscriptionStatus,
        startDate: now,
        endDate: newEndDate,
        amount: 0,
        currency: 'INR',
        couponCode: `ADMIN_${action.toUpperCase()}_${days}DAYS`,
        createdAt: now,
        updatedAt: now,
      }
    });

    // Update user premium status
    const isPremium = newEndDate > now;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium,
        premiumUntil: isPremium ? newEndDate : null,
        updatedAt: now,
      }
    });

    // Mark any existing active subscriptions as expired if user is no longer premium
    if (!isPremium) {
      await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          status: 'ACTIVE',
          id: { not: subscription.id } // Don't update the subscription we just created
        },
        data: {
          status: 'EXPIRED',
          updatedAt: now
        }
      });
    }

    // Fetch updated user data with subscription info
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to fetch updated user' }, { status: 500 });
    }

    // Calculate remaining days
    let remainingDays = 0;
    if (updatedUser.isPremium && updatedUser.premiumUntil) {
      const endDate = new Date(updatedUser.premiumUntil);
      if (endDate > now) {
        remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    // Format response
    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      state: updatedUser.state,
      isPremium: updatedUser.isPremium,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      latestSubscription: updatedUser.subscriptions[0] ? {
        id: updatedUser.subscriptions[0].id,
        type: updatedUser.subscriptions[0].type,
        status: updatedUser.subscriptions[0].status,
        startDate: updatedUser.subscriptions[0].startDate,
        endDate: updatedUser.subscriptions[0].endDate,
        couponCode: updatedUser.subscriptions[0].couponCode,
        amount: updatedUser.subscriptions[0].amount
      } : null,
      remainingDays
    };

    return NextResponse.json({ 
      user: userResponse,
      message: `Successfully ${action === 'add' ? 'added' : 'removed'} ${days} days`
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 