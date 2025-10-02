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
    const body = await request.json();
    const { name, email, phone, city, state, isPremium, role, preferredExams } = body;

    // Get current user data to check for premium status changes
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { isPremium: true, premiumUntil: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const updateData: Record<string, unknown> = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(role && { role }),
      ...(preferredExams && { preferredExams: JSON.stringify(preferredExams) }),
      updatedAt: now,
    };

    // Handle premium status changes
    if (isPremium !== undefined && isPremium !== currentUser.isPremium) {
      updateData.isPremium = isPremium;
      
      if (isPremium) {
        // Get admin settings for default duration
        const adminSettings = await prisma.adminSettings.findFirst({
          orderBy: { createdAt: 'desc' }
        });
        const defaultDuration = adminSettings?.defaultFreeDuration || 90;
        
        // Admin is granting premium - use admin-configured duration
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + defaultDuration);
        updateData.premiumUntil = endDate;

        // Create subscription record for admin grant with unique type
        await prisma.subscription.create({
          data: {
            userId: id,
            type: `ADMIN_GRANTED_${Date.now()}`,
            status: 'ACTIVE',
            startDate: now,
            endDate: endDate,
            amount: 0,
            currency: 'INR',
            couponCode: `ADMIN_GRANT_${defaultDuration}DAYS`,
            createdAt: now,
            updatedAt: now,
          }
        });
      } else {
        // Admin is removing premium
        updateData.premiumUntil = null;

        // Create subscription record for admin removal with unique type
        await prisma.subscription.create({
          data: {
            userId: id,
            type: `ADMIN_REMOVED_${Date.now()}`,
            status: 'EXPIRED',
            startDate: now,
            endDate: now,
            amount: 0,
            currency: 'INR',
            couponCode: 'ADMIN_REMOVE_PREMIUM',
            createdAt: now,
            updatedAt: now,
          }
        });

        // Mark any existing active subscriptions as expired
        await prisma.subscription.updateMany({
          where: {
            userId: id,
            status: 'ACTIVE'
          },
          data: {
            status: 'EXPIRED',
            updatedAt: now
          }
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        isPremium: true,
        role: true,
        preferredExams: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Parse preferredExams back to array
    const userWithParsedExams = {
      ...updatedUser,
      preferredExams: updatedUser.preferredExams ? JSON.parse(updatedUser.preferredExams) : []
    };

    return NextResponse.json({ user: userWithParsedExams });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 