import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sarkari Parcha CMS',
  description: 'Content Management System for Sarkari Parcha - Manage Mock Tests, Content, and Platform Data',
  keywords: ['CMS', 'Sarkari Parcha', 'Admin Panel', 'Mock Tests', 'Content Management'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}