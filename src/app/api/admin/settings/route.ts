import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Default settings
const DEFAULT_SETTINGS = {
  defaultFreeDuration: 90, // days
  defaultPremiumDuration: 365, // days
  promotionalMessage: 'Limited Time Offer: All Exams Test Series for 1 Year @ ₹0',
  isPromotionActive: true,
  maxFreeTrials: 1,
  referralBonus: 30, // days
};

export async function GET() {
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

    // Try to get settings from database
    const settings = await prisma.adminSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!settings) {
      // Create default settings if none exist
      const newSettings = await prisma.adminSettings.create({
        data: {
          ...DEFAULT_SETTINGS,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      return NextResponse.json({ settings: newSettings });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const {
      defaultFreeDuration,
      defaultPremiumDuration,
      promotionalMessage,
      isPromotionActive,
      maxFreeTrials,
      referralBonus
    } = body;

    // Validate input
    if (defaultFreeDuration && (defaultFreeDuration < 1 || defaultFreeDuration > 365)) {
      return NextResponse.json({ error: 'Free duration must be between 1 and 365 days' }, { status: 400 });
    }

    if (defaultPremiumDuration && (defaultPremiumDuration < 1 || defaultPremiumDuration > 1095)) {
      return NextResponse.json({ error: 'Premium duration must be between 1 and 1095 days' }, { status: 400 });
    }

    const now = new Date();

    // Check if settings exist
    const existingSettings = await prisma.adminSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let updatedSettings;

    if (existingSettings) {
      // Update existing settings
      updatedSettings = await prisma.adminSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...(defaultFreeDuration !== undefined && { defaultFreeDuration }),
          ...(defaultPremiumDuration !== undefined && { defaultPremiumDuration }),
          ...(promotionalMessage !== undefined && { promotionalMessage }),
          ...(isPromotionActive !== undefined && { isPromotionActive }),
          ...(maxFreeTrials !== undefined && { maxFreeTrials }),
          ...(referralBonus !== undefined && { referralBonus }),
          updatedAt: now,
        }
      });
    } else {
      // Create new settings
      updatedSettings = await prisma.adminSettings.create({
        data: {
          defaultFreeDuration: defaultFreeDuration ?? DEFAULT_SETTINGS.defaultFreeDuration,
          defaultPremiumDuration: defaultPremiumDuration ?? DEFAULT_SETTINGS.defaultPremiumDuration,
          promotionalMessage: promotionalMessage ?? DEFAULT_SETTINGS.promotionalMessage,
          isPromotionActive: isPromotionActive ?? DEFAULT_SETTINGS.isPromotionActive,
          maxFreeTrials: maxFreeTrials ?? DEFAULT_SETTINGS.maxFreeTrials,
          referralBonus: referralBonus ?? DEFAULT_SETTINGS.referralBonus,
          createdAt: now,
          updatedAt: now,
        }
      });
    }

    return NextResponse.json({ 
      settings: updatedSettings,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 