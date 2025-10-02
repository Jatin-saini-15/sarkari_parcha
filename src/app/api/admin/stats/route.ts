import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get today's date boundaries
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance - using only User table
    const [
      totalUsers,
      premiumUsers,
      newUsersToday,
      newUsersThisWeek,
      recentUsers,
      recentPremiumUpgrades
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Premium users
      prisma.user.count({
        where: { isPremium: true }
      }),
      
      // New users today
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday
          }
        }
      }),
      
      // New users this week
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfWeek
          }
        }
      }),
      
      // Recent users (last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: last30Days
          }
        }
      }),
      
      // Recent premium upgrades (last 7 days)
      prisma.user.count({
        where: {
          isPremium: true,
          updatedAt: {
            gte: startOfWeek
          }
        }
      })
    ]);

    // Get user role distribution
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    // Get users by state for geographic insights
    const usersByState = await prisma.user.groupBy({
      by: ['state'],
      where: {
        state: {
          not: null
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const stats = {
      totalUsers,
      premiumUsers,
      newUsersToday,
      newUsersThisWeek,
      recentUsers,
      recentPremiumUpgrades,
      conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100) : 0,
      weeklyConversionRate: newUsersThisWeek > 0 ? ((recentPremiumUpgrades / newUsersThisWeek) * 100) : 0,
      userInsights: {
        roleDistribution: usersByRole.map(role => ({
          role: role.role,
          count: role._count.id
        })),
        topStates: usersByState.map(state => ({
          state: state.state,
          count: state._count.id
        }))
      },
      growthMetrics: {
        last30Days: recentUsers,
        thisWeek: newUsersThisWeek,
        today: newUsersToday,
        premiumUpgrades: recentPremiumUpgrades,
        averageDailySignups: Math.round(recentUsers / 30),
        weeklyGrowthRate: recentUsers > 0 ? ((newUsersThisWeek / recentUsers) * 100) : 0
      }
    };

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 