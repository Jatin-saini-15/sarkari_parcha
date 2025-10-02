import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userEmail, couponUsed, amountPaid } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // Calculate premium end date (365 days from now)
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + 365);

    // Update user to premium
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        isPremium: true,
        premiumUntil: premiumUntil,
        updatedAt: new Date()
      }
    });

    // Log the premium upgrade (you could add a separate table for this)
    console.log(`Premium upgrade completed for user: ${userEmail}`, {
      couponUsed,
      amountPaid,
      premiumUntil,
      timestamp: new Date()
    });

    return NextResponse.json({ 
      message: 'Premium upgrade successful',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        premiumUntil: updatedUser.premiumUntil
      }
    });

  } catch (error) {
    console.error('Error upgrading to premium:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 