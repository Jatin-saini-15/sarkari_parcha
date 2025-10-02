/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isPremium: user.isPremium || user.role === 'owner' || user.role === 'admin', // Owners and admins are automatically premium
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    signIn: async ({ user, account }: { user: any; account: any }) => {
      // For Google sign-in, ensure user has default role if not set
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (!existingUser) {
            // New user from Google - will be created by adapter with default values
            return true
          } else if (!existingUser.role) {
            // Existing user without role - update with default role
            await prisma.user.update({
              where: { email: user.email },
              data: { role: 'user' }
            })
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error)
        }
      }
      return true
    },
    jwt: async ({ token, user, trigger }: { token: any; user: any; trigger?: "signIn" | "signUp" | "update" }) => {
      if (user) {
        token.role = user.role
        token.isPremium = user.isPremium
      }
      
      // Refresh user data on update trigger or periodically
      if (trigger === "update" || (token.sub && !user)) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, isPremium: true }
          })
          
          if (freshUser) {
            token.role = freshUser.role
            token.isPremium = freshUser.isPremium || freshUser.role === 'owner' || freshUser.role === 'admin'
          }
        } catch (error) {
          console.error('Error refreshing user data:', error)
        }
      }
      
      return token
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role
        session.user.isPremium = token.isPremium
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 