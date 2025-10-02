'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function RRBNTPCPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examDetails = {
    name: "RRB NTPC",
    fullName: "Non-Technical Popular Categories",
    description: "Railway Recruitment Board exam for graduate and undergraduate level posts in Indian Railways",
    posts: "Station Master, Goods Train Manager, Commercial cum Ticket Supervisor, Junior Account Assistant",
    eligibility: "12th Pass to Graduate",
    ageLimit: "18-36 years (Graduate), 18-33 years (Undergraduate)",
    salary: "₹29,200 - ₹35,400 (Graduate), ₹19,900 - ₹21,700 (Undergraduate)",
    icon: "🚂",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
    difficulty: "Medium",
    popularity: "Very High",
    totalVacancies: "Multiple Posts",
    examMode: "Computer Based Test (CBT)",
    duration: "90 minutes",
    negativeMarking: "1/3 marks per wrong answer"
  };

  const studyMaterials = [
    {
      category: "Mock Tests",
      icon: "📝",
      items: [
        "Full Length Mock Tests",
        "CBT 1 & CBT 2 Practice Tests",
        "Subject-wise Tests",
        "Previous Year Papers",
        "Speed Tests"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      category: "Study Material",
      icon: "📚",
      items: [
        "Complete Study Notes",
        "Railway GK & Current Affairs",
        "Shortcut Techniques",
        "Video Lectures",
        "E-books"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      category: "Previous Year Papers",
      icon: "📄",
      items: [
        "Last 5 Years Papers",
        "CBT-wise PYQs",
        "Detailed Solutions",
        "Trend Analysis",
        "Important Questions"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      category: "Railway Specific",
      icon: "🚆",
      items: [
        "Railway General Knowledge",
        "Indian Railway History",
        "Railway Zones & Divisions",
        "Railway Terminology",
        "Current Railway Projects"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  const importantTopics = [
    {
      subject: "Mathematics",
      topics: ["Number System", "Simplification", "Percentage", "Ratio & Proportion", "Time & Work", "Data Interpretation"],
      weightage: "30%",
      difficulty: "Medium"
    },
    {
      subject: "General Intelligence & Reasoning",
      topics: ["Analogies", "Classification", "Series", "Coding-Decoding", "Blood Relations", "Puzzles"],
      weightage: "30%",
      difficulty: "Medium"
    },
    {
      subject: "General Awareness",
      topics: ["Current Affairs", "Indian History", "Geography", "Polity", "Economics", "Railway GK"],
      weightage: "40%",
      difficulty: "High"
    }
  ];

  const selectionProcess = [
    {
      stage: "CBT 1",
      description: "Computer Based Test (Screening)",
      subjects: "Mathematics, General Intelligence & Reasoning, General Awareness",
      duration: "90 minutes",
      questions: "100 questions"
    },
    {
      stage: "CBT 2", 
      description: "Computer Based Test (Mains)",
      subjects: "Mathematics, General Intelligence & Reasoning, General Awareness",
      duration: "90 minutes",
      questions: "120 questions"
    },
    {
      stage: "Typing Skill Test/CBAT",
      description: "For specific posts only",
      subjects: "Typing Test or Computer Based Aptitude Test",
      duration: "15 minutes",
      questions: "As per requirement"
    },
    {
      stage: "Document Verification",
      description: "Verification of certificates and documents",
      subjects: "Document Check",
      duration: "As required",
      questions: "N/A"
    },
    {
      stage: "Medical Examination",
      description: "Medical fitness test",
      subjects: "Medical Check-up",
      duration: "As required", 
      questions: "N/A"
    }
  ];

  const preparationTips = [
    {
      icon: "🎯",
      title: "Focus on Railway GK",
      description: "Railway-specific general knowledge carries significant weightage in the exam"
    },
    {
      icon: "📊",
      title: "Regular Mock Tests",
      description: "Take CBT 1 and CBT 2 specific mock tests to understand the exam pattern"
    },
    {
      icon: "📖",
      title: "Current Affairs",
      description: "Stay updated with latest current affairs, especially railway-related news"
    },
    {
      icon: "⏰",
      title: "Time Management",
      description: "Practice solving 100 questions in 90 minutes with accuracy"
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
            <Link href="/exam-categories/railways" className="hover:text-blue-600">Railway Exams</Link>
            <span>›</span>
            <span className="text-green-600 font-semibold">RRB NTPC</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-green-200/50 mb-8">
            <span className="text-2xl">{examDetails.icon}</span>
            <span className="text-sm font-semibold text-gray-700">Railway Recruitment Board NTPC</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{examDetails.name}</span>
            <br />
            <span className="text-gray-800">Complete Preparation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {examDetails.description}. Prepare for multiple graduate and undergraduate level posts with our comprehensive study materials and mock tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Mock Test
            </button>
            <button className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 text-lg">
              Download Syllabus
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: examDetails.totalVacancies, label: "Available Posts", icon: "💼" },
              { number: examDetails.difficulty, label: "Difficulty Level", icon: "📊" },
              { number: "2 CBTs", label: "Exam Structure", icon: "📋" },
              { number: "₹19,900 - ₹35,400", label: "Salary Range", icon: "💰" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200/50">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">{stat.number}</div>
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
              Quick <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Access</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jump directly to what you need for your RRB NTPC preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyMaterials.map((material, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${material.bgColor} rounded-2xl p-6 border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-xl">{material.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                    {material.category}
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {material.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
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

      {/* Selection Process */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Selection Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete overview of the RRB NTPC selection process and exam pattern
            </p>
          </div>

          <div className="space-y-6">
            {selectionProcess.map((stage, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border-l-4 border-green-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.stage}</h3>
                    <p className="text-gray-600 mb-3">{stage.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Subjects: </span>
                        <span className="text-gray-600">{stage.subjects}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Duration: </span>
                        <span className="text-gray-600">{stage.duration}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Questions: </span>
                        <span className="text-gray-600">{stage.questions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Topics */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Important Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Subject-wise breakdown of important topics with weightage and difficulty level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {importantTopics.map((subject, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{subject.subject}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {subject.weightage}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Difficulty: </span>
                  <span className={`font-semibold ${subject.difficulty === 'High' ? 'text-red-600' : subject.difficulty === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {subject.difficulty}
                  </span>
                </div>
                <div className="space-y-2">
                  {subject.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Tips */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preparation Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expert tips and strategies to crack RRB NTPC exam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 text-center">
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your RRB NTPC Preparation?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who cleared RRB NTPC with our comprehensive preparation platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200 text-lg">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 