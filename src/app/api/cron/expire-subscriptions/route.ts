import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔄 Running automatic premium expiry check...');
    
    const now = new Date();
    
    // Find all users with expired premium memberships
    const expiredUsers = await prisma.user.findMany({
      where: {
        isPremium: true,
        OR: [
          {
            premiumUntil: {
              lt: now
            }
          },
          {
            premiumUntil: null
          }
        ]
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            endDate: 'desc'
          }
        }
      }
    });

    let processedCount = 0;
    let expiredSubscriptionsCount = 0;

    for (const user of expiredUsers) {
      let shouldExpire = false;
      
      // Check if premium is expired based on premiumUntil
      if (user.premiumUntil && user.premiumUntil < now) {
        shouldExpire = true;
      }
      
      // Check active subscriptions for expiry
      for (const subscription of user.subscriptions) {
        if (new Date(subscription.endDate) < now) {
          // Mark subscription as expired
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' }
          });
          expiredSubscriptionsCount++;
          shouldExpire = true;
        }
      }
      
      // If user should be expired, update their status immediately
      if (shouldExpire) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPremium: false,
            premiumUntil: null
          }
        });
        
        console.log(`✅ Expired user: ${user.email} (ID: ${user.id})`);
        processedCount++;
      }
    }

    // Also check for any active subscriptions that have expired
    const expiredActiveSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now
        }
      },
      include: {
        user: true
      }
    });

    for (const subscription of expiredActiveSubscriptions) {
      // Mark subscription as expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' }
      });

      // Update user premium status
      await prisma.user.update({
        where: { id: subscription.userId },
        data: {
          isPremium: false,
          premiumUntil: null
        }
      });

      console.log(`✅ Expired subscription for user: ${subscription.user.email}`);
      expiredSubscriptionsCount++;
    }

    const summary = {
      timestamp: now.toISOString(),
      expiredUsers: processedCount,
      expiredSubscriptions: expiredSubscriptionsCount,
      totalProcessed: processedCount + expiredActiveSubscriptions.length,
      message: 'Premium expiry check completed successfully'
    };

    console.log('📊 Premium Expiry Summary:', summary);

    return NextResponse.json(summary);

  } catch (error) {
    console.error('❌ Error in premium expiry cron job:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
        message: 'Failed to process premium expiries'
      }, 
      { status: 500 }
    );
  }
}

// Also handle POST requests for manual triggers
export async function POST() {
  return GET();
} 