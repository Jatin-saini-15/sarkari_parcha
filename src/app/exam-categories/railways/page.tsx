'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function RailwaysPage() {
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

  const railwayExams = [
    {
      name: "RRB NTPC",
      fullName: "Non-Technical Popular Categories",
      description: "For graduate-level non-technical posts in Indian Railways with excellent career growth opportunities",
      posts: "Station Master, Goods Guard, Senior Commercial cum Ticket Clerk, Senior Clerk cum Typist, Account Clerk cum Typist",
      eligibility: "Bachelor's Degree",
      ageLimit: "18-33 years",
      salary: "₹35,400 - ₹1,12,400",
      icon: "🚂",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "High",
      popularity: "Very High",
      vacancies: "Multiple Posts",
      slug: "ntpc"
    },
    {
      name: "RRB Group D",
      fullName: "Level 1 Posts",
      description: "Entry-level positions in Indian Railways for 10th pass candidates with job security and benefits",
      posts: "Track Maintainer, Helper, Assistant Pointsman, Level-I posts in various departments",
      eligibility: "10th Pass + ITI/Diploma",
      ageLimit: "18-33 years",
      salary: "₹18,000 - ₹56,900",
      icon: "🔧",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "Medium",
      popularity: "Very High",
      vacancies: "Multiple Posts",
      slug: "group-d"
    },
    {
      name: "RRB JE",
      fullName: "Junior Engineer",
      description: "Technical positions for engineering graduates/diploma holders in various engineering disciplines",
      posts: "Junior Engineer (Civil, Mechanical, Electrical, Electronics, Computer Science)",
      eligibility: "Engineering Degree/Diploma",
      ageLimit: "18-33 years",
      salary: "₹35,400 - ₹1,12,400",
      icon: "⚙️",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "Multiple Posts",
      slug: "je"
    },
    {
      name: "RRB ALP",
      fullName: "Assistant Loco Pilot",
      description: "Technical posts for operating and maintaining locomotives with attractive salary packages",
      posts: "Assistant Loco Pilot, Technician (various trades)",
      eligibility: "10th + ITI/Diploma",
      ageLimit: "18-28 years",
      salary: "₹19,900 - ₹63,200",
      icon: "🚄",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "Medium",
      popularity: "High",
      vacancies: "Multiple Posts",
      slug: "alp"
    }
  ];

  const railwayBenefits = [
    {
      icon: "🏠",
      title: "Free Accommodation",
      description: "Railway quarters provided at nominal rent with all basic amenities",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🚂",
      title: "Free Travel Pass",
      description: "Complimentary train travel for employee and family members across India",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🏥",
      title: "Medical Benefits",
      description: "Comprehensive healthcare facilities for employee and dependents",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "🎓",
      title: "Education Allowance",
      description: "Financial support for children's education and skill development",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "💰",
      title: "Pension & PF",
      description: "Attractive pension scheme and provident fund for secure retirement",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Regular promotions and opportunities for professional advancement",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const preparationStrategy = [
    {
      phase: "Foundation Phase",
      duration: "2-3 Months",
      focus: "Basic Concepts & Fundamentals",
      subjects: ["Mathematics", "General Science", "General Awareness", "Reasoning"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      phase: "Intensive Phase",
      duration: "3-4 Months",
      focus: "Advanced Topics & Practice",
      subjects: ["Previous Year Papers", "Mock Tests", "Speed & Accuracy", "Current Affairs"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      phase: "Revision Phase",
      duration: "1-2 Months",
      focus: "Final Preparation & Mock Tests",
      subjects: ["Full-Length Tests", "Weak Area Practice", "Time Management", "Exam Strategy"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-green-200/50 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Railway Recruitment Board</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Railway Exams</span>
            <br />
            <span className="text-gray-800">Your Gateway to Indian Railways</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Join the world&apos;s largest railway network with our comprehensive RRB exam preparation. From NTPC to Group D, achieve your dream of serving the nation through Indian Railways.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "1.7Cr+", label: "Total Applications", icon: "📝" },
              { number: "2L+", label: "Annual Vacancies", icon: "💼" },
              { number: "16", label: "Railway Zones", icon: "🗺️" },
              { number: "68,000+", label: "Railway Stations", icon: "🚉" },
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

      {/* Railway Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🚂</span>
              <span>All Railway Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Railway Career</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each RRB exam and find the perfect match for your qualifications and career goals.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {railwayExams.map((exam, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${exam.bgColor} rounded-3xl p-6 md:p-8 border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-[1.02]`}>
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${exam.color} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 flex-shrink-0 mx-auto sm:mx-0`}>
                      <span className="text-2xl">{exam.icon}</span>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
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
                            {exam.vacancies}
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
                        <Link href={`/exam-categories/railways/${exam.slug}`}>
                          <button className={`w-full px-4 md:px-6 py-3 bg-gradient-to-r ${exam.color} text-white rounded-xl font-semibold shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-200 text-sm md:text-base`}>
                            Start Preparation
                          </button>
                        </Link>
                        <Link href={`/exam-categories/railways/${exam.slug}`}>
                          <button className="w-full px-4 md:px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:border-green-300 hover:text-green-600 transition-all duration-200 text-sm md:text-base">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Railway Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🎁</span>
              <span>Railway Job Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">Indian Railways?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the incredible benefits and perks that come with a career in Indian Railways - one of the most sought-after government jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {railwayBenefits.map((benefit, index) => (
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
              Your <span className="gradient-text-primary">Success Roadmap</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our proven 3-phase preparation strategy designed by railway exam experts to maximize your success rate.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {preparationStrategy.map((phase, index) => (
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
                      {phase.subjects.map((subject, subIndex) => (
                        <div key={subIndex} className="inline-block px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-white/50 mr-2 mb-2">
                          {subject}
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
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join <span className="text-yellow-300">Indian Railways?</span>
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Start your journey towards a prestigious railway career today. Join millions of aspirants who trust our comprehensive preparation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={buttonConfig.href}>
              <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
                {buttonConfig.text}
              </button>
            </Link>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200 text-lg">
              Download Syllabus
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 