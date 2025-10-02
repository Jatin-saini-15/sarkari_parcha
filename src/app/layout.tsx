import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Tinos } from "next/font/google";
import { Providers } from "@/components/providers";
import { PremiumModalProvider } from "./components/PremiumModalContext";
import PremiumPromoPopup from "./components/PremiumPromoPopup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tinos = Tinos({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-tinos',
});

export const metadata: Metadata = {
  title: "Sarkari Parcha: Exam Prep || Mock Tests & PYQs",
  description: "Mock Tests, PYQs, and Live All India Test Series for SSC & Government Exam Aspirants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tinos.variable} antialiased`}
      >
        <Providers>
          <PremiumModalProvider>
            {children}
            <PremiumPromoPopup />
          </PremiumModalProvider>
        </Providers>
      </body>
    </html>
  );
}
