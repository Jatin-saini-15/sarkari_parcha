'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StartFreeTrialButton from '../../components/StartFreeTrialButton';

export default function SSCExamsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sscExams = [
    {
      name: "SSC CGL",
      fullName: "Combined Graduate Level",
      description: "One of the most prestigious exams for graduate-level posts in various ministries and departments",
      posts: "Assistant Audit Officer, Income Tax Inspector, Sub Inspector, Assistant Section Officer",
      eligibility: "Bachelor's Degree",
      ageLimit: "18-32 years",
      salary: "₹25,500 - ₹81,100",
      icon: "🏛️",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "High",
      popularity: "Very High",
      slug: "cgl"
    },
    {
      name: "SSC CHSL",
      fullName: "Combined Higher Secondary Level",
      description: "For 12th pass candidates seeking clerical and data entry positions in government offices",
      posts: "Lower Division Clerk, Data Entry Operator, Postal Assistant, Court Clerk",
      eligibility: "12th Pass",
      ageLimit: "18-27 years",
      salary: "₹19,900 - ₹63,200",
      icon: "📋",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "Medium",
      popularity: "Very High",
      slug: "chsl"
    },
    {
      name: "SSC MTS",
      fullName: "Multi Tasking Staff",
      description: "Entry-level positions for 10th pass candidates in various government departments",
      posts: "Peon, Daftary, Jamadar, Safaiwala, Mali, Chowkidar",
      eligibility: "10th Pass",
      ageLimit: "18-25 years",
      salary: "₹18,000 - ₹56,900",
      icon: "🔧",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "Low",
      popularity: "High",
      slug: "mts"
    },
    {
      name: "SSC GD Constable",
      fullName: "General Duty Constable",
      description: "For recruitment in paramilitary forces like BSF, CRPF, CISF, ITBP, SSB",
      posts: "Constable (GD) in BSF, CRPF, CISF, ITBP, SSB, NIA, SSF, Rifleman in AR",
      eligibility: "10th Pass",
      ageLimit: "18-23 years",
      salary: "₹21,700 - ₹69,100",
      icon: "🛡️",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "Medium",
      popularity: "Very High",
      slug: "gd"
    },
    {
      name: "SSC CPO",
      fullName: "Central Police Organisation",
      description: "For recruitment of Sub-Inspectors in Delhi Police and Central Armed Police Forces",
      posts: "Sub Inspector in Delhi Police, CAPF, Assistant Sub Inspector in CISF",
      eligibility: "Bachelor's Degree",
      ageLimit: "20-25 years",
      salary: "₹35,400 - ₹1,12,400",
      icon: "👮",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "High",
      popularity: "High",
      slug: "cpo"
    },
    {
      name: "SSC JE",
      fullName: "Junior Engineer",
      description: "For engineering graduates seeking technical positions in government departments",
      posts: "Junior Engineer in Civil, Mechanical, Electrical, Quantity Surveying & Contract",
      eligibility: "Engineering Degree/Diploma",
      ageLimit: "18-32 years",
      salary: "₹35,400 - ₹1,12,400",
      icon: "⚙️",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "High",
      popularity: "High",
      slug: "je"
    }
  ];

  const preparationTips = [
    {
      icon: "📚",
      title: "Structured Study Plan",
      description: "Create a comprehensive study schedule covering all subjects with adequate time for revision",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "📝",
      title: "Regular Mock Tests",
      description: "Take daily mock tests to improve speed, accuracy, and time management skills",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "📊",
      title: "Analyze Performance",
      description: "Review your test results, identify weak areas, and focus on improvement strategies",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "📖",
      title: "Current Affairs",
      description: "Stay updated with daily current affairs, especially government schemes and policies",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">SSC Exam Preparation</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">SSC Exams</span>
            <br />
            <span className="text-gray-800">Complete Guide</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Master all Staff Selection Commission exams with our comprehensive preparation platform. From CGL to CHSL, we&apos;ve got you covered with expert guidance and practice materials.
          </p>

          {/* Take Test Button */}
          <div className="mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Take Test
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "6+", label: "SSC Exams", icon: "📋" },
              { number: "50L+", label: "Annual Vacancies", icon: "💼" },
              { number: "95%", label: "Success Rate", icon: "🎯" },
              { number: "24/7", label: "Study Support", icon: "📚" },
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

      {/* SSC Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🏛️</span>
              <span>All SSC Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">SSC Exam</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore detailed information about each SSC exam, including eligibility, syllabus, and career prospects.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {sscExams.map((exam, index) => (
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
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                            {exam.popularity}
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
                        <Link href={`/exam-categories/ssc/${exam.slug}`} className={`px-4 md:px-6 py-3 bg-gradient-to-r ${exam.color} text-white rounded-xl font-semibold shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-200 text-sm md:text-base text-center`}>
                          Start Preparation
                        </Link>
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

      {/* Preparation Strategy */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🎯</span>
              <span>Preparation Strategy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Master Your <span className="gradient-text-primary">SSC Preparation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our proven strategies and tips to maximize your chances of success in SSC exams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Roadmap */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              <span>📚</span>
              <span>Success Roadmap</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Your <span className="gradient-text-primary">Victory Path</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our proven 3-phase preparation strategy designed by SSC experts to maximize your success rate.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                phase: "Foundation Phase",
                duration: "2-3 Months",
                focus: "Basic Concepts & Fundamentals",
                activities: ["Mathematics Basics", "English Grammar", "General Knowledge", "Reasoning Fundamentals", "Current Affairs"],
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                phase: "Intensive Phase",
                duration: "3-4 Months",
                focus: "Advanced Topics & Practice",
                activities: ["Previous Year Papers", "Mock Tests", "Speed & Accuracy", "Advanced Reasoning", "Sectional Tests"],
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100"
              },
              {
                phase: "Final Phase",
                duration: "1-2 Months",
                focus: "Revision & Mock Tests",
                activities: ["Complete Revision", "Full-Length Tests", "Time Management", "Weak Area Practice", "Exam Strategy"],
                color: "from-orange-500 to-orange-600",
                bgColor: "from-orange-50 to-orange-100"
              }
            ].map((phase, index) => (
              <div key={index} className="group relative">
                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
                )}
                
                <div className={`bg-gradient-to-br ${phase.bgColor} rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 relative z-10`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {phase.phase}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">{phase.duration}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h4 className="font-bold text-gray-800 mb-3">{phase.focus}</h4>
                    <div className="space-y-2">
                      {phase.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="inline-block px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-white/50 mr-2 mb-2">
                          {activity}
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Crack <span className="text-yellow-300">SSC Exams?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful candidates who have achieved their government job dreams through our comprehensive SSC preparation program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <StartFreeTrialButton className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg" />
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