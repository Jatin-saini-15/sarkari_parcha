'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StatePSCPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const statePSCExams = [
    {
      name: "UPPSC",
      fullName: "Uttar Pradesh Public Service Commission",
      description: "State civil services examination for administrative positions in Uttar Pradesh government",
      posts: "Deputy Collector, DSP, Block Development Officer, Assistant Regional Transport Officer",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-40 years",
      salary: "₹9,300 - ₹34,800",
      icon: "🏛️",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "High",
      popularity: "Very High",
      vacancies: "1,500+"
    },
    {
      name: "BPSC",
      fullName: "Bihar Public Service Commission",
      description: "State civil services examination for administrative positions in Bihar government",
      posts: "Deputy Collector, DSP, Block Development Officer, Assistant Commissioner",
      eligibility: "Bachelor's Degree",
      ageLimit: "20-37 years",
      salary: "₹9,300 - ₹34,800",
      icon: "🏢",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "High",
      popularity: "Very High",
      vacancies: "800+"
    },
    {
      name: "MPPSC",
      fullName: "Madhya Pradesh Public Service Commission",
      description: "State civil services examination for administrative positions in MP government",
      posts: "Deputy Collector, DSP, Naib Tehsildar, Assistant Commissioner",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-40 years",
      salary: "₹15,600 - ₹39,100",
      icon: "🏰",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "1,200+"
    },
    {
      name: "RPSC",
      fullName: "Rajasthan Public Service Commission",
      description: "State civil services examination for administrative positions in Rajasthan government",
      posts: "RAS Officer, Deputy Collector, DSP, Block Development Officer",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-40 years",
      salary: "₹23,700 - ₹75,100",
      icon: "🕌",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "900+"
    },
    {
      name: "WBPSC",
      fullName: "West Bengal Public Service Commission",
      description: "State civil services examination for administrative positions in West Bengal government",
      posts: "WBCS Officer, Deputy Collector, DSP, Block Development Officer",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-36 years",
      salary: "₹9,300 - ₹34,800",
      icon: "🏛️",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "600+"
    },
    {
      name: "HPSC",
      fullName: "Haryana Public Service Commission",
      description: "State civil services examination for administrative positions in Haryana government",
      posts: "HCS Officer, Deputy Collector, DSP, Naib Tehsildar",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-42 years",
      salary: "₹10,300 - ₹34,800",
      icon: "🌾",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "700+"
    }
  ];

  const statePSCBenefits = [
    {
      icon: "🏛️",
      title: "Administrative Power",
      description: "Direct involvement in state governance and policy implementation at district level",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🌍",
      title: "Local Impact",
      description: "Make a significant difference in your home state and local community development",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "💼",
      title: "Job Security",
      description: "Permanent state government position with complete job security and benefits",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🏠",
      title: "Home State Service",
      description: "Serve in your home state with better understanding of local culture and language",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Clear promotion pathways from entry level to senior administrative positions",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "🎓",
      title: "Diverse Opportunities",
      description: "Multiple departments and specializations available for career development",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const examStructure = [
    {
      stage: "Preliminary Exam",
      description: "Objective type screening exam with General Studies and CSAT papers",
      duration: "1 Day",
      papers: 2,
      subjects: ["General Studies", "General Aptitude Test", "Current Affairs", "State Specific Knowledge"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      stage: "Main Examination",
      description: "Descriptive exam testing comprehensive knowledge and analytical skills",
      duration: "4-5 Days",
      papers: 6,
      subjects: ["General Hindi", "Essay", "General Studies I-III", "Optional Subject"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      stage: "Interview",
      description: "Personality test to assess suitability for administrative positions",
      duration: "30-45 min",
      papers: 1,
      subjects: ["Personal Interview", "Current Affairs", "State Issues", "Administrative Scenarios"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  const preparationStrategy = [
    {
      phase: "Foundation Building",
      duration: "4-5 Months",
      focus: "Basic Concepts & State Knowledge",
      activities: ["General Studies", "State History & Geography", "Current Affairs", "Optional Subject", "Basic Concepts"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      phase: "Intensive Preparation",
      duration: "5-6 Months",
      focus: "Advanced Topics & Practice",
      activities: ["Previous Year Papers", "Mock Tests", "Answer Writing", "State Specific Issues", "Optional Subject Mastery"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      phase: "Final Preparation",
      duration: "2-3 Months",
      focus: "Revision & Interview Prep",
      activities: ["Complete Revision", "Interview Practice", "Current Affairs Update", "Mock Interviews", "Final Tests"],
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
            <span className="text-sm font-semibold text-gray-700">State Civil Services</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">State PSC Exams</span>
            <br />
            <span className="text-gray-800">Serve Your State</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Build a prestigious career in state administration. Master all State Public Service Commission exams with our comprehensive preparation program tailored for state-specific requirements.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "28", label: "State PSCs", icon: "🏛️" },
              { number: "50K+", label: "Annual Vacancies", icon: "💼" },
              { number: "15L+", label: "Annual Aspirants", icon: "📚" },
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

      {/* State PSC Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🏛️</span>
              <span>All State PSC Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">State Service</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each State PSC exam and find your opportunity to serve in state administration.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {statePSCExams.map((exam, index) => (
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

      {/* State PSC Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🌟</span>
              <span>State PSC Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">State Civil Services?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the unique advantages of serving in state administration and making a direct impact on your home state&apos;s development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statePSCBenefits.map((benefit, index) => (
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

      {/* Exam Structure */}
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
              Understand the complete State PSC examination structure and prepare strategically for each stage.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {examStructure.map((stage, index) => (
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

      {/* Preparation Strategy */}
      <section className="py-20 px-4 bg-white">
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
              Follow our proven 3-phase preparation strategy designed by State PSC experts to maximize your success rate.
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
            Ready to Serve Your <span className="text-yellow-300">Home State?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your journey towards a prestigious career in state administration. Join thousands of officers who are making a difference in their states.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              Download Syllabus
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 