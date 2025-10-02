import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, city, state, preferredExams } = body

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user profile with only non-null values
    const updateData: {
      name?: string
      phone?: string | null
      city?: string | null
      state?: string | null
      preferredExams?: string | null
      updatedAt: Date
    } = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone || null
    if (city !== undefined) updateData.city = city || null
    if (state !== undefined) updateData.state = state || null
    if (preferredExams !== undefined) {
      updateData.preferredExams = Array.isArray(preferredExams) ? JSON.stringify(preferredExams) : null
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
      }
    })

    return NextResponse.json(
      { 
        message: "Profile updated successfully", 
        user: {
          ...updatedUser,
          preferredExams: updatedUser.preferredExams ? JSON.parse(updatedUser.preferredExams) : [],
          isPremium: updatedUser.isPremium
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { 
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        ...user,
        preferredExams: user.preferredExams ? JSON.parse(user.preferredExams) : [],
        isPremium: user.isPremium
      }
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
} 