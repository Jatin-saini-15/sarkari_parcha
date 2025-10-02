'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PolicePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const policeExams = [
    {
      name: "UP Police",
      fullName: "Uttar Pradesh Police Constable & SI",
      description: "Recruitment for constable and sub-inspector positions in UP Police with excellent career growth opportunities",
      posts: "Police Constable, Sub Inspector, Assistant Sub Inspector",
      eligibility: "12th Pass / Bachelor's Degree",
      ageLimit: "18-25 years",
      salary: "₹21,700 - ₹69,100",
      icon: "👮‍♂️",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "Medium",
      popularity: "Very High",
      vacancies: "60,000+"
    },
    {
      name: "Delhi Police",
      fullName: "Delhi Police Constable",
      description: "Recruitment for constable positions in Delhi Police serving the national capital territory",
      posts: "Police Constable (Executive), Head Constable",
      eligibility: "12th Pass",
      ageLimit: "18-25 years",
      salary: "₹21,700 - ₹69,100",
      icon: "🏛️",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "Medium",
      popularity: "Very High",
      vacancies: "25,000+"
    },
    {
      name: "CISF",
      fullName: "Central Industrial Security Force",
      description: "Paramilitary force responsible for security of industrial installations and government infrastructure",
      posts: "Constable/Tradesmen, Head Constable, Assistant Sub Inspector",
      eligibility: "10th/12th Pass",
      ageLimit: "18-25 years",
      salary: "₹21,700 - ₹69,100",
      icon: "🛡️",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "Medium",
      popularity: "High",
      vacancies: "15,000+"
    },
    {
      name: "BSF",
      fullName: "Border Security Force",
      description: "India's primary border guarding force responsible for securing international borders",
      posts: "Constable, Head Constable, Assistant Sub Inspector",
      eligibility: "10th/12th Pass",
      ageLimit: "18-25 years",
      salary: "₹21,700 - ₹69,100",
      icon: "🚧",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "Medium",
      popularity: "High",
      vacancies: "12,000+"
    },
    {
      name: "CRPF",
      fullName: "Central Reserve Police Force",
      description: "India's largest paramilitary force for internal security and counter-insurgency operations",
      posts: "Constable, Head Constable, Assistant Sub Inspector",
      eligibility: "10th/12th Pass",
      ageLimit: "18-25 years",
      salary: "₹21,700 - ₹69,100",
      icon: "⚔️",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "Medium",
      popularity: "High",
      vacancies: "18,000+"
    },
    {
      name: "State Police",
      fullName: "State Police Recruitment",
      description: "Various state police recruitment for constable and officer positions across different states",
      posts: "Police Constable, Sub Inspector, Assistant Sub Inspector",
      eligibility: "12th Pass / Bachelor's Degree",
      ageLimit: "18-28 years",
      salary: "₹19,900 - ₹63,200",
      icon: "🏢",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "Medium",
      popularity: "Very High",
      vacancies: "1,00,000+"
    }
  ];

  const policeBenefits = [
    {
      icon: "🏅",
      title: "Honor & Respect",
      description: "Serve society with pride and earn respect as a protector of law and order",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "💪",
      title: "Physical Fitness",
      description: "Maintain excellent physical condition with regular training and fitness programs",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "🛡️",
      title: "Job Security",
      description: "Permanent government position with complete job security and pension benefits",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🏠",
      title: "Accommodation",
      description: "Government quarters and housing facilities for police personnel and families",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🏥",
      title: "Medical Benefits",
      description: "Comprehensive healthcare coverage for employee and family members",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Clear promotion pathways from constable to senior officer positions",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const selectionProcess = [
    {
      stage: "Written Examination",
      description: "Computer-based test covering General Knowledge, Reasoning, Mathematics, and Hindi/English",
      duration: "2-3 hours",
      subjects: ["General Knowledge", "Reasoning", "Numerical Ability", "Hindi/English"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      stage: "Physical Standards",
      description: "Height, chest, and weight measurements as per prescribed standards",
      duration: "1 Day",
      subjects: ["Height Measurement", "Chest Measurement", "Weight Check", "Medical Examination"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      stage: "Physical Efficiency Test",
      description: "Running, long jump, high jump, and other physical fitness tests",
      duration: "1 Day",
      subjects: ["1600m/800m Race", "Long Jump", "High Jump", "Shot Put"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      stage: "Document Verification",
      description: "Verification of educational certificates, identity proofs, and other documents",
      duration: "1 Day",
      subjects: ["Educational Certificates", "Identity Proof", "Caste Certificate", "Character Certificate"],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Law Enforcement Careers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Police Recruitment</span>
            <br />
            <span className="text-gray-800">Protect & Serve</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Join the force that maintains law and order. Prepare for all police recruitment exams with our comprehensive training program designed by law enforcement experts.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50L+", label: "Police Aspirants", icon: "👮‍♂️" },
              { number: "2L+", label: "Annual Vacancies", icon: "🎯" },
              { number: "28", label: "States & UTs", icon: "🗺️" },
              { number: "24/7", label: "Public Service", icon: "🚨" },
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

      {/* Police Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>👮‍♂️</span>
              <span>All Police Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Police Force</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each police recruitment exam and find your path to serve and protect the community.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {policeExams.map((exam, index) => (
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
                          View Details
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

      {/* Police Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🏅</span>
              <span>Police Career Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">Police Service?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the honor, respect, and benefits that come with a career in law enforcement - serving and protecting the community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policeBenefits.map((benefit, index) => (
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

      {/* Selection Process */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              <span>📋</span>
              <span>Selection Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              <span className="gradient-text-primary">Four-Stage</span> Selection Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understand the complete police recruitment process and prepare strategically for each stage of the selection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {selectionProcess.map((stage, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${stage.bgColor} rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                        {stage.stage}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600 mb-3">{stage.duration}</p>
                      <p className="text-gray-600 leading-relaxed mb-4">{stage.description}</p>
                      
                      <div className="space-y-2">
                        {stage.subjects.map((subject, subIndex) => (
                          <div key={subIndex} className="inline-block px-3 py-1 bg-white/70 rounded-full text-xs font-semibold text-gray-700 border border-white/50 mr-2 mb-2">
                            {subject}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the <span className="text-yellow-300">Police Force?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your journey towards a noble career in law enforcement. Join thousands of brave individuals who have chosen to protect and serve.
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