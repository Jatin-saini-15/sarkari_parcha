import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ isPremium: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        isPremium: true,
        premiumUntil: true
      }
    });

    if (!user) {
      return NextResponse.json({ isPremium: false });
    }

    // Check if premium is still valid
    const isPremiumActive = user.isPremium && 
      user.premiumUntil && 
      new Date(user.premiumUntil) > new Date();

    return NextResponse.json({
      isPremium: isPremiumActive || false,
      premiumUntil: user.premiumUntil
    });

  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json({ isPremium: false });
  }
} 