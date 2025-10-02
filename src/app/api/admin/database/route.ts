import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        preferredExams: true,
        isPremium: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true, // Include password hash for testing
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      users: users
    })
  } catch (error) {
    console.error("Database fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 