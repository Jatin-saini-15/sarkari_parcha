'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function UPSCPage() {
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

  const upscExams = [
    {
      name: "IAS",
      fullName: "Indian Administrative Service",
      description: "The most prestigious civil service exam in India for administrative positions at the highest levels of government",
      posts: "District Collector, Secretary, Joint Secretary, Additional Secretary, Cabinet Secretary",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-32 years",
      salary: "₹56,100 - ₹2,50,000",
      icon: "🏛️",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "Very High",
      popularity: "Very High",
      vacancies: "180+"
    },
    {
      name: "IPS",
      fullName: "Indian Police Service",
      description: "Elite police service for maintaining law and order and ensuring internal security of the nation",
      posts: "Superintendent of Police, Inspector General, Director General of Police",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-32 years",
      salary: "₹56,100 - ₹2,25,000",
      icon: "👮‍♂️",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "Very High",
      popularity: "Very High",
      vacancies: "150+"
    },
    {
      name: "IFS",
      fullName: "Indian Foreign Service",
      description: "Diplomatic service representing India's interests abroad and managing international relations",
      posts: "Foreign Service Officer, Ambassador, High Commissioner, Consul General",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-32 years",
      salary: "₹56,100 - ₹2,25,000",
      icon: "🌍",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "Very High",
      popularity: "High",
      vacancies: "50+"
    },
    {
      name: "IRS",
      fullName: "Indian Revenue Service",
      description: "Tax administration service managing direct and indirect taxes for the Government of India",
      posts: "Income Tax Officer, Commissioner, Chief Commissioner, Member CBDT/CBIC",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-32 years",
      salary: "₹56,100 - ₹2,05,400",
      icon: "💰",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "Very High",
      popularity: "High",
      vacancies: "120+"
    },
    {
      name: "IES",
      fullName: "Indian Engineering Services",
      description: "Technical service for engineering graduates in various government departments and PSUs",
      posts: "Assistant Executive Engineer, Executive Engineer, Chief Engineer",
      eligibility: "Engineering Degree",
      ageLimit: "21-30 years",
      salary: "₹56,100 - ₹1,82,200",
      icon: "⚙️",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "Very High",
      popularity: "High",
      vacancies: "600+"
    },
    {
      name: "IFoS",
      fullName: "Indian Forest Service",
      description: "Environmental service for forest conservation, wildlife protection, and sustainable development",
      posts: "Assistant Conservator of Forests, Conservator, Chief Conservator, Principal Chief Conservator",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-32 years",
      salary: "₹56,100 - ₹2,05,400",
      icon: "🌲",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "Very High",
      popularity: "Medium",
      vacancies: "110+"
    }
  ];

  const upscBenefits = [
    {
      icon: "👑",
      title: "Highest Prestige",
      description: "Most respected and prestigious career option in India with immense social status",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🏛️",
      title: "Policy Making",
      description: "Direct involvement in policy formulation and implementation at national and state levels",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🌍",
      title: "National Impact",
      description: "Opportunity to serve the nation and make a significant difference in people's lives",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "💼",
      title: "Job Security",
      description: "Permanent government position with complete job security and pension benefits",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "🏠",
      title: "Official Residence",
      description: "Government accommodation with all facilities and security arrangements",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🚗",
      title: "Official Vehicle",
      description: "Government vehicle with driver and fuel allowances for official and personal use",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const examStages = [
    {
      stage: "Preliminary Exam",
      duration: "1 Day",
      papers: 2,
      description: "Objective type screening exam with General Studies and CSAT papers",
      subjects: ["General Studies Paper I", "General Studies Paper II (CSAT)"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      stage: "Main Examination",
      duration: "5 Days",
      papers: 9,
      description: "Descriptive exam testing comprehensive knowledge and analytical skills",
      subjects: ["Essay", "General Studies I-IV", "Optional Subject I-II", "Language Papers"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      stage: "Personality Test",
      duration: "30-45 min",
      papers: 1,
      description: "Interview to assess personality, leadership qualities, and suitability for civil services",
      subjects: ["Personal Interview", "Board Interaction", "Current Affairs Discussion"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Union Public Service Commission</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">UPSC Exams</span>
            <br />
            <span className="text-gray-800">Serve the Nation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Achieve your dream of becoming an IAS, IPS, or IFS officer. Master the most prestigious civil services examination with our comprehensive UPSC preparation program.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10L+", label: "Annual Aspirants", icon: "📚" },
              { number: "1,000+", label: "Total Vacancies", icon: "🎯" },
              { number: "0.1%", label: "Success Rate", icon: "🏆" },
              { number: "24", label: "All India Services", icon: "🏛️" },
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

      {/* UPSC Services Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🏛️</span>
              <span>All UPSC Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Civil Service</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each UPSC service and find your calling to serve the nation at the highest levels.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {upscExams.map((exam, index) => (
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
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
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

      {/* UPSC Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>👑</span>
              <span>UPSC Career Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">Civil Services?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the unparalleled benefits and prestige that comes with a career in Indian Civil Services - the ultimate public service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upscBenefits.map((benefit, index) => (
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

      {/* Exam Stages */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
              <span>📋</span>
              <span>Exam Structure</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              <span className="gradient-text-primary">Three-Stage</span> Selection Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understand the complete UPSC examination structure and prepare strategically for each stage of the selection process.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {examStages.map((stage, index) => (
              <div key={index} className="group relative">
                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
                )}
                
                <div className={`bg-gradient-to-br ${stage.bgColor} rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 relative z-10`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {stage.stage}
                    </h3>
                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                      <span>{stage.duration}</span>
                      <span>•</span>
                      <span>{stage.papers} Paper{stage.papers > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 text-center">{stage.description}</p>
                  
                  <div className="space-y-2">
                    {stage.subjects.map((subject, subIndex) => (
                      <div key={subIndex} className="inline-block px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-white/50 mr-2 mb-2">
                        {subject}
                      </div>
                    ))}
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
            Ready to Become an <span className="text-yellow-300">IAS Officer?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your journey towards the most prestigious career in India. Join thousands of aspirants who trust our comprehensive UPSC preparation program.
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