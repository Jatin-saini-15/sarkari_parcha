'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function IBPSPOPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examDetails = {
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection - Probationary Officer",
    icon: "🏦",
    description: "IBPS PO is one of the most prestigious banking exams in India for recruitment of Probationary Officers in public sector banks",
    eligibility: "Graduate in any discipline",
    ageLimit: "20-30 years",
    totalVacancies: "4,000+",
    difficulty: "High",
    salary: "₹23,700 - ₹42,020",
    examMode: "Computer Based Test (CBT)",
    duration: "Variable",
    negativeMarking: "0.25 marks per wrong answer"
  };

  const studyMaterials = [
    {
      category: "Mock Tests",
      icon: "📝",
      items: [
        "Full Length Mock Tests",
        "Prelims & Mains Tests",
        "Subject-wise Tests",
        "Previous Year Papers",
        "Sectional Tests"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      category: "Study Material",
      icon: "📚",
      items: [
        "Complete Study Notes",
        "Banking Awareness",
        "Current Affairs",
        "Video Lectures",
        "E-books & PDFs"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      category: "Previous Year Papers",
      icon: "📄",
      items: [
        "Last 10 Years Papers",
        "Prelims & Mains PYQs",
        "Detailed Solutions",
        "Trend Analysis",
        "Important Questions"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      category: "Interview Preparation",
      icon: "🎤",
      items: [
        "Interview Questions",
        "Group Discussion",
        "Personality Development",
        "Mock Interviews",
        "Banking Knowledge"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  const importantTopics = [
    {
      subject: "Quantitative Aptitude",
      topics: ["Data Interpretation", "Number Series", "Simplification", "Quadratic Equations", "Data Sufficiency", "Arithmetic"],
      weightage: "35%",
      difficulty: "High"
    },
    {
      subject: "Reasoning Ability",
      topics: ["Puzzles & Seating Arrangement", "Syllogism", "Blood Relations", "Direction Sense", "Coding-Decoding", "Inequalities"],
      weightage: "35%",
      difficulty: "High"
    },
    {
      subject: "English Language",
      topics: ["Reading Comprehension", "Cloze Test", "Para Jumbles", "Error Spotting", "Fill in the Blanks", "Vocabulary"],
      weightage: "30%",
      difficulty: "Medium"
    },
    {
      subject: "General Awareness",
      topics: ["Banking Awareness", "Current Affairs", "Static GK", "Financial Awareness", "Government Schemes", "Economic Survey"],
      weightage: "40%",
      difficulty: "Medium"
    }
  ];

  const preparationTips = [
    {
      icon: "📊",
      title: "Data Interpretation",
      description: "Master DI questions as they carry high weightage and can boost your score significantly"
    },
    {
      icon: "🧩",
      title: "Puzzle Solving",
      description: "Practice complex puzzles and seating arrangements daily to improve logical thinking"
    },
    {
      icon: "🏦",
      title: "Banking Awareness",
      description: "Stay updated with latest banking news, RBI policies, and financial developments"
    },
    {
      icon: "⏰",
      title: "Time Management",
      description: "Develop speed and accuracy through regular practice and mock tests"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Breadcrumb */}
      <section className="py-4 px-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/exam-categories" className="hover:text-blue-600">Exam Categories</Link>
            <span>›</span>
            <Link href="/exam-categories/banking" className="hover:text-blue-600">Banking Exams</Link>
            <span>›</span>
            <span className="text-blue-600 font-semibold">IBPS PO</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="text-2xl">{examDetails.icon}</span>
            <span className="text-sm font-semibold text-gray-700">IBPS Probationary Officer</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text-primary">{examDetails.name}</span>
            <br />
            <span className="text-gray-800">Complete Preparation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {examDetails.description}. Get comprehensive preparation with our expert-designed study materials, mock tests, and interview guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Mock Test
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 text-lg">
              Download Syllabus
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: examDetails.totalVacancies, label: "Total Vacancies", icon: "💼" },
              { number: examDetails.difficulty, label: "Difficulty Level", icon: "📊" },
              { number: "3 Stages", label: "Selection Process", icon: "📋" },
              { number: examDetails.salary, label: "Salary Range", icon: "💰" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200/50">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-lg font-bold gradient-text-primary mb-1">{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Quick <span className="gradient-text-primary">Access</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jump directly to what you need for your IBPS PO preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyMaterials.map((material, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${material.bgColor} rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-xl">{material.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {material.category}
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {material.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full px-4 py-2 bg-gradient-to-r ${material.color} text-white rounded-lg font-semibold shadow-medium hover:shadow-strong transition-all duration-200`}>
                    Access Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Structure Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              IBPS PO Selection Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The IBPS PO selection is conducted in 3 stages to assess candidates comprehensively
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Prelims */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Preliminary Exam</h3>
                  <p className="text-gray-600">Computer Based Test</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Duration</span>
                  <span className="text-green-600 font-semibold">60 minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Questions</span>
                  <span className="text-green-600 font-semibold">100</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marks</span>
                  <span className="text-green-600 font-semibold">100</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Negative Marking</span>
                  <span className="text-red-500 font-semibold">0.25 marks</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Subjects:</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">English Language</span>
                    <div className="text-xs text-gray-600">30 Questions, 20 minutes</div>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Quantitative Aptitude</span>
                    <div className="text-xs text-gray-600">35 Questions, 20 minutes</div>
                  </div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Reasoning Ability</span>
                    <div className="text-xs text-gray-600">35 Questions, 20 minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mains */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mains Exam</h3>
                  <p className="text-gray-600">Computer Based Test</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Duration</span>
                  <span className="text-blue-600 font-semibold">3.5 hours</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Questions</span>
                  <span className="text-blue-600 font-semibold">157</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marks</span>
                  <span className="text-blue-600 font-semibold">225</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Negative Marking</span>
                  <span className="text-red-500 font-semibold">0.25 marks</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Sections:</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Reasoning & Computer Aptitude</span>
                    <div className="text-xs text-gray-600">45 Questions, 60 marks</div>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Data Analysis & Interpretation</span>
                    <div className="text-xs text-gray-600">35 Questions, 60 marks</div>
                  </div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">General/Economy/Banking Awareness</span>
                    <div className="text-xs text-gray-600">40 Questions, 40 marks</div>
                  </div>
                  <div className="bg-orange-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">English Language</span>
                    <div className="text-xs text-gray-600">35 Questions, 40 marks</div>
                  </div>
                  <div className="bg-yellow-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Descriptive Test</span>
                    <div className="text-xs text-gray-600">Letter & Essay, 25 marks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Interview</h3>
                  <p className="text-gray-600">Personal Interview</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Duration</span>
                  <span className="text-purple-600 font-semibold">15-20 minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Type</span>
                  <span className="text-purple-600 font-semibold">Face-to-face</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marks</span>
                  <span className="text-purple-600 font-semibold">100</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Qualifying Marks</span>
                  <span className="text-green-500 font-semibold">40% (35% for SC/ST/OBC/PWD)</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Assessment Areas:</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">General Awareness</span>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Banking Knowledge</span>
                  </div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Communication Skills</span>
                  </div>
                  <div className="bg-orange-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Leadership Qualities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-yellow-800">
                <strong>Final Selection:</strong> Based on Mains (80%) + Interview (20%) scores
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Topics */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>📚</span>
              <span>Syllabus Breakdown</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Important <span className="gradient-text-primary">Topics</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Focus on these high-weightage topics to maximize your score
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {importantTopics.map((topic, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      {topic.subject}
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {topic.weightage}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        topic.difficulty === 'High' ? 'bg-red-100 text-red-700' :
                        topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {topic.topics.map((subtopic, subIndex) => (
                      <div key={subIndex} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-gray-600">{subtopic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Tips */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              <span>💡</span>
              <span>Expert Tips</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Preparation <span className="gradient-text-primary">Strategy</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these expert tips to crack IBPS PO with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto">
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Crack <span className="text-yellow-300">IBPS PO?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your preparation today with our comprehensive study materials and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              View All Mock Tests
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 