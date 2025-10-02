'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DefencePage() {
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

  const defenceExams = [
    {
      name: "Agniveer",
      fullName: "Agniveer (Army/Navy/Airforce)",
      description: "New recruitment scheme for Indian Armed Forces offering 4-year service with modern training and benefits",
      posts: "Agniveer General Duty, Technical, Clerk/Store Keeper Technical, Tradesman",
      eligibility: "10th/12th Pass",
      ageLimit: "17.5-21 years",
      salary: "₹30,000 - ₹40,000",
      icon: "⚔️",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      difficulty: "Medium",
      popularity: "Very High",
      vacancies: "46,000+"
    },
    {
      name: "NDA",
      fullName: "National Defence Academy",
      description: "Premier tri-service academy for training officers for Army, Navy, and Air Force",
      posts: "Officer in Indian Army, Navy, Air Force",
      eligibility: "12th Pass (PCM for Air Force & Navy)",
      ageLimit: "16.5-19.5 years",
      salary: "₹56,100 - ₹1,77,500",
      icon: "🎖️",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      difficulty: "High",
      popularity: "Very High",
      vacancies: "400+"
    },
    {
      name: "CDS",
      fullName: "Combined Defence Services",
      description: "Entry for graduate officers in Indian Military Academy, Naval Academy, and Air Force Academy",
      posts: "Officer in IMA, INA, AFA",
      eligibility: "Bachelor's Degree",
      ageLimit: "19-25 years",
      salary: "₹56,100 - ₹1,77,500",
      icon: "🏅",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "340+"
    },
    {
      name: "AFCAT",
      fullName: "Air Force Common Admission Test",
      description: "Entry for commissioned officers in Indian Air Force in Flying and Ground Duty branches",
      posts: "Flying Officer, Technical Officer, Ground Duty Officer",
      eligibility: "Bachelor's Degree",
      ageLimit: "20-24 years",
      salary: "₹56,100 - ₹1,77,500",
      icon: "✈️",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "300+"
    },
    {
      name: "CAPF",
      fullName: "Central Armed Police Forces",
      description: "Assistant Commandant positions in BSF, CRPF, CISF, ITBP, SSB paramilitary forces",
      posts: "Assistant Commandant in BSF, CRPF, CISF, ITBP, SSB",
      eligibility: "Bachelor's Degree",
      ageLimit: "20-25 years",
      salary: "₹44,900 - ₹1,42,400",
      icon: "🛡️",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      difficulty: "High",
      popularity: "High",
      vacancies: "300+"
    },
    {
      name: "Indian Coast Guard",
      fullName: "Assistant Commandant",
      description: "Officer positions in Indian Coast Guard for maritime security and search & rescue operations",
      posts: "Assistant Commandant (General Duty/Technical)",
      eligibility: "Bachelor's Degree",
      ageLimit: "21-25 years",
      salary: "₹44,900 - ₹1,42,400",
      icon: "⚓",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      difficulty: "High",
      popularity: "Medium",
      vacancies: "100+"
    }
  ];

  const defenceBenefits = [
    {
      icon: "🏅",
      title: "Honor & Prestige",
      description: "Serve the nation with pride and earn respect in society as a defender of the motherland",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "💪",
      title: "Physical Fitness",
      description: "Maintain peak physical condition with structured training and fitness programs",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🎯",
      title: "Leadership Skills",
      description: "Develop exceptional leadership, decision-making, and team management abilities",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🏠",
      title: "Accommodation",
      description: "Free furnished accommodation with all amenities for officers and their families",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "🏥",
      title: "Medical Benefits",
      description: "Comprehensive healthcare for serving personnel and their dependents",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🎓",
      title: "Education Support",
      description: "Educational allowances and quality schooling facilities for children",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const preparationPhases = [
    {
      phase: "Foundation Building",
      duration: "3-4 Months",
      focus: "Basic Concepts & Physical Fitness",
      activities: ["Mathematics Fundamentals", "English Grammar", "General Knowledge", "Physical Training", "Current Affairs"],
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100"
    },
    {
      phase: "Intensive Preparation",
      duration: "4-5 Months",
      focus: "Advanced Topics & Mock Tests",
      activities: ["Previous Year Papers", "Mock Tests", "Interview Preparation", "SSB Training", "Personality Development"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      phase: "Final Preparation",
      duration: "1-2 Months",
      focus: "Revision & SSB Preparation",
      activities: ["Complete Revision", "Group Discussions", "Personal Interview", "Psychological Tests", "Final Mock Tests"],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-red-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-red-200/50 mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Serve the Nation</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Defence Exams</span>
            <br />
            <span className="text-gray-800">Honor, Courage, Commitment</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Join the elite ranks of Indian Armed Forces. From NDA to Agniveer, prepare for all defence exams with our comprehensive training program designed by military experts.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "15L+", label: "Defence Aspirants", icon: "👨‍✈️" },
              { number: "50,000+", label: "Annual Vacancies", icon: "🎯" },
              { number: "3", label: "Armed Forces", icon: "⚔️" },
              { number: "24/7", label: "Nation Service", icon: "🇮🇳" },
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

      {/* Defence Exams Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-6">
              <span>⚔️</span>
              <span>All Defence Exams</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Service Branch</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive information about each defence exam and find your path to serve the nation with honor and distinction.
            </p>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 md:gap-8">
            {defenceExams.map((exam, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${exam.bgColor} rounded-3xl p-6 md:p-8 border border-gray-200/50 hover:border-red-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-[1.02]`}>
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${exam.color} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 flex-shrink-0 mx-auto sm:mx-0`}>
                      <span className="text-2xl">{exam.icon}</span>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-red-700 transition-colors duration-300">
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
                        <button className="px-4 md:px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-all duration-200 text-sm md:text-base">
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

      {/* Defence Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>🏅</span>
              <span>Defence Career Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose <span className="gradient-text-primary">Defence Services?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the unique benefits and honor that comes with serving in the Indian Armed Forces - a career of purpose and pride.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defenceBenefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-red-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                    <span className="text-2xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-700 transition-colors duration-300">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>🎯</span>
              <span>Preparation Strategy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Your <span className="gradient-text-primary">Victory Roadmap</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our proven 3-phase preparation strategy designed by defence experts to maximize your success in defence exams.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {preparationPhases.map((phase, index) => (
              <div key={index} className="group relative">
                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
                )}
                
                <div className={`bg-gradient-to-br ${phase.bgColor} rounded-3xl p-8 border border-gray-200/50 hover:border-red-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 relative z-10`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-700 transition-colors duration-300">
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
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 via-blue-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Serve <span className="text-yellow-300">Mother India?</span>
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Take the first step towards a prestigious career in Indian Armed Forces. Join thousands of brave hearts who have chosen to serve the nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={buttonConfig.href} className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              {buttonConfig.text}
            </Link>
            <Link href="#" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 text-lg">
              Download Syllabus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 