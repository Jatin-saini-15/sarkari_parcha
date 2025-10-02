'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TeachingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

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
    return { text: "Start Free Trial", href: "#" };
  };

  const buttonConfig = getButtonConfig();

  const teachingExams = [
    {
      name: "CTET",
      fullName: "Central Teacher Eligibility Test",
      description: "National level eligibility test for teaching positions in central government schools across India",
      posts: "Primary Teacher (Class I-V), Elementary Teacher (Class VI-VIII)",
      eligibility: "12th + D.El.Ed / B.Ed",
      ageLimit: "18-35 years",
      salary: "₹9,300 - ₹34,800",
      icon: "🎓",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "Medium",
      popularity: "Very High",
      validity: "Lifetime"
    },
    {
      name: "UPTET",
      fullName: "Uttar Pradesh Teacher Eligibility Test",
      description: "State-level eligibility test for teaching positions in UP government schools",
      posts: "Assistant Teacher (Primary & Upper Primary)",
      eligibility: "12th + D.El.Ed / B.Ed",
      ageLimit: "18-35 years",
      salary: "₹9,300 - ₹34,800",
      icon: "📚",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "Medium",
      popularity: "Very High",
      validity: "Lifetime"
    },
    {
      name: "Super TET",
      fullName: "Uttar Pradesh Super TET",
      description: "Additional eligibility test for assistant teacher recruitment in UP after clearing UPTET",
      posts: "Assistant Teacher in Government Primary Schools",
      eligibility: "UPTET Qualified + B.Ed",
      ageLimit: "18-35 years",
      salary: "₹9,300 - ₹34,800",
      icon: "⭐",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "High",
      popularity: "High",
      validity: "3 Years"
    },
    {
      name: "REET",
      fullName: "Rajasthan Eligibility Examination for Teachers",
      description: "State-level teacher eligibility test for teaching positions in Rajasthan government schools",
      posts: "3rd Grade Teacher (Class I-V & VI-VIII)",
      eligibility: "12th + D.El.Ed / B.Ed",
      ageLimit: "18-40 years",
      salary: "₹23,700 - ₹75,100",
      icon: "🏫",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "Medium",
      popularity: "High",
      validity: "Lifetime"
    },
    {
      name: "HTET",
      fullName: "Haryana Teacher Eligibility Test",
      description: "State-level eligibility test for teaching positions in Haryana government schools",
      posts: "PRT (Primary), TGT (Trained Graduate Teacher)",
      eligibility: "12th + D.El.Ed / B.Ed",
      ageLimit: "18-42 years",
      salary: "₹10,300 - ₹34,800",
      icon: "🎯",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "Medium",
      popularity: "High",
      validity: "3 Years"
    },
    {
      name: "MPTET",
      fullName: "Madhya Pradesh Teacher Eligibility Test",
      description: "State-level teacher eligibility test for teaching positions in MP government schools",
      posts: "Primary Teacher, Middle School Teacher",
      eligibility: "12th + D.El.Ed / B.Ed",
      ageLimit: "18-40 years",
      salary: "₹15,600 - ₹39,100",
      icon: "📖",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "Medium",
      popularity: "High",
      validity: "7 Years"
    }
  ];

  const teachingBenefits = [
    {
      icon: "🌟",
      title: "Noble Profession",
      description: "Shape young minds and contribute to nation-building through quality education",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "⏰",
      title: "Work-Life Balance",
      description: "Fixed working hours with weekends and holidays off for personal time",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🏖️",
      title: "Long Vacations",
      description: "Extended summer and winter breaks for rest, travel, and personal development",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "💼",
      title: "Job Security",
      description: "Permanent government position with complete job security and pension benefits",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Clear promotion pathways from teacher to principal and administrative positions",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "🎓",
      title: "Continuous Learning",
      description: "Opportunities for professional development and higher education support",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const preparationTips = [
    {
      phase: "Foundation Phase",
      duration: "2-3 Months",
      focus: "Basic Concepts & Child Psychology",
      topics: ["Child Development", "Learning Theories", "Teaching Methods", "Educational Psychology", "Curriculum & Pedagogy"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      phase: "Subject Mastery",
      duration: "3-4 Months",
      focus: "Subject Knowledge & Practice",
      topics: ["Mathematics", "Science", "Social Studies", "Hindi/English", "Environmental Studies"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      phase: "Test Preparation",
      duration: "1-2 Months",
      focus: "Mock Tests & Revision",
      topics: ["Previous Year Papers", "Mock Tests", "Time Management", "Exam Strategy", "Final Revision"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Teaching Excellence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Teaching Exams</span>
            <br />
            <span className="text-gray-800">Shape Tomorrow</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Become a certified teacher and inspire the next generation. Master all teacher eligibility tests with our comprehensive preparation program designed by education experts.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "30L+", label: "Teaching Aspirants", icon: "👩‍🏫" },
              { number: "5L+", label: "Annual Vacancies", icon: "🎯" },
              { number: "28", label: "States Covered", icon: "🗺️" },
              { number: "100%", label: "Job Security", icon: "🛡️" },
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

      {/* Teaching Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🎓</span>
              <span>All Teaching Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Teaching Path</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each teacher eligibility test and find your perfect opportunity to educate and inspire.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {teachingExams.map((exam, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${exam.bgColor} rounded-3xl p-6 md:p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-[1.02]`}>
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${exam.color} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 flex-shrink-0 mx-auto sm:mx-0`}>
                      <span className="text-2xl">{exam.icon}</span>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                          {exam.name}
                        </h3>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            exam.difficulty === 'High' ? 'bg-red-100 text-red-700' :
                            exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {exam.difficulty}
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                            {exam.validity}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm font-semibold text-gray-600 mb-3">{exam.fullName}</p>
                      <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">{exam.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm mb-4">
                        <div>
                          <span className="font-semibold text-gray-700">Eligibility:</span>
                          <span className="text-gray-600 ml-1">{exam.eligibility}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Age Limit:</span>
                          <span className="text-gray-600 ml-1">{exam.ageLimit}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-semibold text-gray-700">Salary Range:</span>
                          <span className="text-green-600 ml-1 font-semibold">{exam.salary}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white/70 rounded-xl border border-white/50 mb-6">
                        <span className="font-semibold text-gray-700 text-sm">Key Posts: </span>
                        <span className="text-gray-600 text-sm">{exam.posts}</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className={`px-4 md:px-6 py-3 bg-gradient-to-r ${exam.color} text-white rounded-xl font-semibold shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-200 text-sm md:text-base`}>
                          Start Preparation
                        </button>
                        <button className="px-4 md:px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-200 text-sm md:text-base">
                          View Syllabus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🌟</span>
              <span>Teaching Career Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">Teaching Profession?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the unique rewards and satisfaction that comes with a career in teaching - making a difference in young lives every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachingBenefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                    <span className="text-2xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Strategy */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              <span>📚</span>
              <span>Preparation Strategy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Your <span className="gradient-text-primary">Success Blueprint</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our proven 3-phase preparation strategy designed by teaching experts to maximize your success in teacher eligibility tests.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="group relative">
                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
                )}
                
                <div className={`bg-gradient-to-br ${tip.bgColor} rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 relative z-10`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {tip.phase}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">{tip.duration}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h4 className="font-bold text-gray-800 mb-3">{tip.focus}</h4>
                    <div className="space-y-2">
                      {tip.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="inline-block px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-white/50 mr-2 mb-2">
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-green-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become a <span className="text-yellow-300">Certified Teacher?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your journey towards a fulfilling teaching career today. Join thousands of educators who have qualified through our comprehensive preparation program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={buttonConfig.href} className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              {buttonConfig.text}
            </Link>
            <Link href="#" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              Download Syllabus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 