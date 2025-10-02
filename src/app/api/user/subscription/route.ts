import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate subscription data
    const latestSubscription = user.subscriptions[0];
    let remainingDays = 0;
    let isActive = false;

    if (latestSubscription && latestSubscription.status === 'ACTIVE') {
      const endDate = new Date(latestSubscription.endDate);
      const now = new Date();
      if (endDate > now) {
        remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        isActive = true;
      } else {
        // Subscription has expired, update status
        await prisma.subscription.update({
          where: { id: latestSubscription.id },
          data: { status: 'EXPIRED' }
        });
        
        // Update user premium status
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            isPremium: false,
            premiumUntil: null
          }
        });
      }
    }

    // Return data in the expected format
    return NextResponse.json({
      user: {
        isPremium: isActive,
        premiumUntil: user.premiumUntil
      },
      currentSubscription: latestSubscription,
      remainingDays,
      subscriptionHistory: user.subscriptions,
      totalSubscriptions: user.subscriptions.length
    });

  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { couponCode, paymentDetails } = await request.json();

    // Get admin settings for current subscription duration
    const adminSettings = await prisma.adminSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Get premium configuration for coupon validation
    const config = await prisma.premiumConfig.findFirst();
    
    if (!config || !config.isActive) {
      return NextResponse.json({ error: 'Premium subscriptions are not available at this time' }, { status: 400 });
    }

    // Validate coupon code if provided
    if (couponCode && couponCode.toUpperCase() !== config.couponCode.toUpperCase()) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate subscription duration from admin settings
    const subscriptionDays = adminSettings?.defaultPremiumDuration || config.subscriptionDurationDays || 90;

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + subscriptionDays);

    // Create unique subscription type with timestamp
    const subscriptionType = couponCode 
      ? `COUPON_${couponCode.toUpperCase()}_${Date.now()}`
      : `PREMIUM_${Date.now()}`;

    // Calculate amount based on coupon
    let finalAmount = config.originalPrice;
    if (couponCode && couponCode.toUpperCase() === config.couponCode.toUpperCase()) {
      const discountAmount = (config.originalPrice * config.discountPercentage) / 100;
      finalAmount = config.originalPrice - discountAmount;
    }

    // Create subscription record with unique type
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        type: subscriptionType,
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: paymentDetails?.amount || finalAmount,
        currency: paymentDetails?.currency || 'INR',
        couponCode: couponCode || null,
        createdAt: startDate,
        updatedAt: startDate,
      }
    });

    // Update user premium status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        premiumUntil: endDate,
        updatedAt: startDate,
      }
    });

    return NextResponse.json({
      message: 'Premium subscription activated successfully',
      subscription,
      expiresAt: endDate,
      duration: subscriptionDays
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 