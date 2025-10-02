'use client';

import { useState } from "react";
import Header from "./components/Header";
import PromotionalBanner from "./components/PromotionalBanner";
import HeroSection from "./components/HeroSection";
import ExamCategories from "./components/ExamCategories";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <PromotionalBanner />
      
      <main className="flex-1">
        <HeroSection />
        <ExamCategories />
        <Features />
      </main>
      
      <Footer />
    </div>
  );
}
