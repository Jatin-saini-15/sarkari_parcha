declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      isPremium?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    isPremium?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    isPremium?: boolean
  }
} 