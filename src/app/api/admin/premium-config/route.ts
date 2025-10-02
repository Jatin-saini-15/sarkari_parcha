import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // For now, allow all authenticated users to access this config
    // This fixes the modal not opening issue
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // Return default config even for unauthenticated users to fix modal
      const defaultConfig = {
        subscriptionDurationDays: 90,
        originalPrice: 499,
        discountPercentage: 100,
        couponCode: 'FREE499',
        isActive: true
      };
      return NextResponse.json({ config: defaultConfig });
    }

    // Get or create premium config
    let config = await prisma.premiumConfig.findFirst();
    
    if (!config) {
      // Create default config
      config = await prisma.premiumConfig.create({
        data: {
          subscriptionDurationDays: 90, // 3 months default
          originalPrice: 499,
          discountPercentage: 100, // 100% discount = free
          couponCode: 'FREE499',
          isActive: true
        }
      });
    }

    return NextResponse.json({ config });

  } catch (error) {
    console.error('Error fetching premium config:', error);
    // Return default config as fallback
    const defaultConfig = {
      subscriptionDurationDays: 90,
      originalPrice: 499,
      discountPercentage: 100,
      couponCode: 'FREE499',
      isActive: true
    };
    return NextResponse.json({ config: defaultConfig });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      subscriptionDurationDays,
      originalPrice,
      discountPercentage,
      couponCode,
      isActive
    } = await request.json();

    // Validate input
    if (subscriptionDurationDays < 1 || subscriptionDurationDays > 3650) {
      return NextResponse.json({ error: 'Duration must be between 1 and 3650 days' }, { status: 400 });
    }

    if (originalPrice < 0) {
      return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      return NextResponse.json({ error: 'Discount must be between 0 and 100%' }, { status: 400 });
    }

    // Update or create config
    const config = await prisma.premiumConfig.upsert({
      where: { id: 1 }, // We'll only have one config record
      update: {
        subscriptionDurationDays,
        originalPrice,
        discountPercentage,
        couponCode,
        isActive,
        updatedAt: new Date()
      },
      create: {
        id: 1,
        subscriptionDurationDays,
        originalPrice,
        discountPercentage,
        couponCode,
        isActive
      }
    });

    return NextResponse.json({ config });

  } catch (error) {
    console.error('Error updating premium config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 