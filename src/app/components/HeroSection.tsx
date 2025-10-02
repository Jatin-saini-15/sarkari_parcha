'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePremiumModal } from './PremiumModalContext';

export default function HeroSection() {
  const { data: session } = useSession();
  const { showModal } = usePremiumModal();

  // Dynamic button logic
  // @ts-expect-error - NextAuth session type
  const isPremium = session?.user?.isPremium;
  
  const getButtonConfig = () => {
    if (!session) {
      return { text: "Get Started", href: "/auth/signup" };
    }
    if (isPremium) {
      return { text: "Explore Now", href: "/dashboard" };
    }
    return { text: "Start Free Trial", action: showModal };
  };

  const buttonConfig = getButtonConfig();

  // For the "Get Started - It's Free!" button in the journey section
  const getJourneyButtonConfig = () => {
    if (isPremium) {
      return { text: "Get Started", href: "/exam-categories" };
    }
    return { text: "Get Started - It's Free!", href: "/exam-categories" };
  };

  const journeyButtonConfig = getJourneyButtonConfig();

  // Dynamic "Claim Now" button logic
  const handleClaimClick = () => {
    if (!session) {
      // Redirect to signup if not logged in
      window.location.href = "/auth/signup";
    } else {
      // Show premium modal if logged in
      showModal();
    }
  };

  const handleMainButtonClick = () => {
    if (buttonConfig.href) {
      window.location.href = buttonConfig.href;
    } else if (buttonConfig.action) {
      buttonConfig.action();
    }
  };

  return (
    <>
      {/* Announcement Bar - Only show for non-premium users */}
      {!isPremium && (
        <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center py-3 text-sm font-semibold shadow-medium relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-center gap-4 px-4">
            <div className="flex items-center gap-2">
              <span className="animate-pulse">🔥</span>
              <span>Limited Time Offer: All Exams Test Series for 1 Year @ ₹0</span>
              <span className="line-through text-orange-200 ml-1">₹499</span>
            </div>
            <button 
              onClick={handleClaimClick}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-bold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-xs tracking-wide border-2 border-white"
            >
              Claim Now →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-gray-700">Trusted by 50,000+ Students</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text-primary">Master Your</span>
                  <br />
                  <span className="text-gray-800">Government Exams</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Join India&apos;s most comprehensive exam preparation platform. Access live tests, expert guidance, and personalized study plans for SSC, Banking, Railways, and more.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-center">
                {[
                  { number: "50K+", label: "Active Students" },
                  { number: "5000+", label: "Mock Tests" },
                  { number: "95%", label: "Success Rate" },
                ].map((stat, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold gradient-text-primary">{stat.number}</span>
                    <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {buttonConfig.href ? (
                  <Link href={buttonConfig.href} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 text-lg text-center">
                    {buttonConfig.text}
                  </Link>
                ) : (
                  <button onClick={handleMainButtonClick} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 text-lg text-center">
                    {buttonConfig.text}
                  </button>
                )}
                <Link href="/exam-categories" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold shadow-soft hover:shadow-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-200 text-lg text-center">
                  Browse Exams
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free Mock Tests</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Expert Guidance</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Getting Started Guide */}
            <div className="relative">
              {/* Main Getting Started Card */}
              <div className="relative bg-white rounded-3xl shadow-strong p-6 border border-gray-200/50 backdrop-blur-sm overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>

                {/* Header */}
                <div className="text-center mb-3 relative z-10">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-medium mx-auto animate-pulse-glow">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce-soft"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    <span className="gradient-text-primary">Start Your</span>
                    <span className="text-gray-800"> Journey</span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Follow these simple steps to begin your exam preparation with<br />
                    <span className="font-semibold text-blue-600">40+ government exams</span>
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-3 relative z-10">
                  {[
                    { 
                      step: "1", 
                      title: "Choose Your Exam", 
                      description: "Select from 40+ government exams",
                      icon: "🎯",
                      color: "from-blue-500 to-blue-600",
                      bgColor: "from-blue-50 to-blue-100"
                    },
                    { 
                      step: "2", 
                      title: "Take Free Mock Test", 
                      description: "Assess your current preparation level",
                      icon: "📝",
                      color: "from-green-500 to-green-600",
                      bgColor: "from-green-50 to-green-100"
                    },
                    { 
                      step: "3", 
                      title: "Get Personalized Plan", 
                      description: "Receive customized study roadmap",
                      icon: "📚",
                      color: "from-orange-500 to-orange-600",
                      bgColor: "from-orange-50 to-orange-100"
                    },
                    { 
                      step: "4", 
                      title: "Start Preparation", 
                      description: "Access study materials & practice tests",
                      icon: "🚀",
                      color: "from-purple-500 to-purple-600",
                      bgColor: "from-purple-50 to-purple-100"
                    },
                  ].map((item, index) => (
                    <div key={index} className="group relative">
                      {/* Connecting Line */}
                      {index < 3 && (
                        <div className="absolute left-5 top-10 w-0.5 h-3 bg-gradient-to-b from-gray-300 to-gray-200 z-0"></div>
                      )}
                      
                      <div className="flex items-center gap-4 relative z-10">
                        {/* Step Number Circle */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110`}>
                            <span className="text-white font-bold text-sm">{item.step}</span>
                          </div>
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                        </div>
                        
                        {/* Content */}
                        <div className={`flex-1 p-3 bg-gradient-to-br ${item.bgColor} rounded-xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300 group-hover:shadow-soft`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                            <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 relative z-10">
                  <Link href={journeyButtonConfig.href} className="w-full max-w-xs mx-auto block px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-glow-blue hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group text-center">
                    <span className="relative z-10">{journeyButtonConfig.text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                  <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Join 50,000+ successful students
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl animate-bounce-soft"></div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-xl animate-bounce-soft" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 blur-lg animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 