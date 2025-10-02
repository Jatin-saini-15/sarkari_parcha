'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Dynamic button logic (same as HeroSection)
  // @ts-expect-error - NextAuth session type
  const isPremium = session?.user?.isPremium;
  
  const getButtonConfig = () => {
    if (!session) {
      return { text: "Get Started", href: "/auth/signup" };
    }
    if (isPremium) {
      return { text: "Explore Now", href: "/dashboard" };
    }
    return { text: "Start Free Trial", href: "#" };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">About Sarkari Parcha</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Empowering Dreams,</span>
            <br />
            <span className="text-gray-800">Building Futures</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            We&apos;re on a mission to democratize government exam preparation, making quality education accessible to every aspirant across India. Join us in transforming dreams into reality.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50K+", label: "Students Empowered", icon: "🎓" },
              { number: "40+", label: "Exams Covered", icon: "📚" },
              { number: "95%", label: "Success Rate", icon: "🏆" },
              { number: "5+", label: "Years Experience", icon: "⭐" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200/50">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold gradient-text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200/50 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To provide comprehensive, affordable, and accessible exam preparation resources that empower every government job aspirant to achieve their career goals with confidence and excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 border border-purple-200/50 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To become India&apos;s most trusted and innovative platform for government exam preparation, creating a future where every deserving candidate has equal opportunity to serve the nation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-8">
            <span>📖</span>
            <span>Our Journey</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            The <span className="gradient-text-primary">Story Behind</span> Sarkari Parcha
          </h2>
          
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
            <p className="text-xl mb-6">
              Born from the struggles and aspirations of millions of government job seekers, Sarkari Parcha was founded with a simple yet powerful belief: <strong>quality education should not be a privilege, but a right.</strong>
            </p>
            <p className="mb-6">
              Our founders, having experienced the challenges of exam preparation firsthand, recognized the gap between traditional coaching methods and the evolving needs of modern aspirants. They envisioned a platform that would combine the best of technology with proven pedagogical approaches.
            </p>
            <p className="mb-6">
              Today, we stand as a testament to what&apos;s possible when passion meets purpose. Every feature, every test, every piece of content is crafted with one goal in mind: <em>your success</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Impact & Achievements Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🏆</span>
              <span>Our Impact & Achievements</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Creating <span className="gradient-text-primary">Real Impact</span> in Students&apos; Lives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every success story motivates us to do better. Here&apos;s how we&apos;re making a difference in the government exam preparation landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Personalized Learning",
                description: "AI-powered adaptive learning paths that adjust to each student's pace and learning style",
                stats: "98% students report improved performance",
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                icon: "📊",
                title: "Data-Driven Insights",
                description: "Advanced analytics help students identify strengths and weaknesses for targeted improvement",
                stats: "Average 40% improvement in weak areas",
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100"
              },
              {
                icon: "🌟",
                title: "Quality Content",
                description: "Expert-curated study materials updated regularly to match latest exam patterns",
                stats: "500+ hours of premium content",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100"
              },
              {
                icon: "🤝",
                title: "Community Support",
                description: "Active peer learning community with doubt resolution and motivation support",
                stats: "24/7 community engagement",
                color: "from-orange-500 to-orange-600",
                bgColor: "from-orange-50 to-orange-100"
              },
              {
                icon: "🚀",
                title: "Innovation First",
                description: "Cutting-edge technology including AR/VR learning modules and gamification",
                stats: "Industry-leading tech adoption",
                color: "from-red-500 to-red-600",
                bgColor: "from-red-50 to-red-100"
              },
              {
                icon: "💡",
                title: "Accessibility Focus",
                description: "Multi-language support and affordable pricing to reach every corner of India",
                stats: "Available in 8+ regional languages",
                color: "from-indigo-500 to-indigo-600",
                bgColor: "from-indigo-50 to-indigo-100"
              },
            ].map((achievement, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${achievement.bgColor} rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-xl">{achievement.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {achievement.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-gray-200/50">
                    {achievement.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-gray-200/50">
              <span>💎</span>
              <span>Our Core Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              What <span className="gradient-text-primary">Drives</span> Us Forward
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Excellence",
                description: "We strive for perfection in every aspect of education delivery",
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                icon: "🤝",
                title: "Integrity",
                description: "Honest, transparent, and ethical in all our interactions",
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100"
              },
              {
                icon: "💡",
                title: "Innovation",
                description: "Continuously evolving to meet changing educational needs",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100"
              },
              {
                icon: "🌟",
                title: "Accessibility",
                description: "Making quality education available to everyone, everywhere",
                color: "from-orange-500 to-orange-600",
                bgColor: "from-orange-50 to-orange-100"
              },
              {
                icon: "❤️",
                title: "Empathy",
                description: "Understanding and addressing every student's unique journey",
                color: "from-red-500 to-red-600",
                bgColor: "from-red-50 to-red-100"
              },
              {
                icon: "🚀",
                title: "Growth",
                description: "Fostering continuous learning and personal development",
                color: "from-indigo-500 to-indigo-600",
                bgColor: "from-indigo-50 to-indigo-100"
              },
            ].map((value, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${value.bgColor} rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your <span className="text-yellow-300">Success Story?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful candidates who have transformed their careers with Sarkari Parcha. Your dream job is just one step away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={buttonConfig.href} className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              {buttonConfig.text}
            </Link>
            <Link href="#" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 