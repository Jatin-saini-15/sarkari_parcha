'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function SSCMTSPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examDetails = {
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
    totalVacancies: "9,000+",
    examMode: "Computer Based Test (CBT)",
    duration: "90 minutes",
    negativeMarking: "0.25 marks per wrong answer"
  };

  const studyMaterials = [
    {
      category: "Mock Tests",
      icon: "📝",
      items: [
        "Full Length Mock Tests",
        "Paper-wise Practice Tests",
        "Subject-wise Tests",
        "Previous Year Papers",
        "Speed Tests"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      category: "Study Material",
      icon: "📚",
      items: [
        "Complete Study Notes",
        "Basic Mathematics",
        "Simple English Grammar",
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
        "Last 10 Years Papers",
        "Paper-wise PYQs",
        "Detailed Solutions",
        "Trend Analysis",
        "Important Questions"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      category: "Basic Skills",
      icon: "🎯",
      items: [
        "Basic Mathematics",
        "Simple Reasoning",
        "General Knowledge",
        "Hindi/English Writing",
        "Practice Exercises"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  const importantTopics = [
    {
      subject: "Numerical Aptitude",
      topics: ["Number System", "Basic Arithmetic", "Percentage", "Ratio & Proportion", "Time & Work", "Simple Interest"],
      weightage: "25%",
      difficulty: "Easy"
    },
    {
      subject: "General Intelligence & Reasoning",
      topics: ["Analogies", "Classification", "Series", "Coding-Decoding", "Blood Relations", "Direction Sense"],
      weightage: "25%",
      difficulty: "Easy"
    },
    {
      subject: "English Language",
      topics: ["Basic Grammar", "Vocabulary", "Synonyms & Antonyms", "Sentence Formation", "Comprehension"],
      weightage: "25%",
      difficulty: "Easy"
    },
    {
      subject: "General Awareness",
      topics: ["History", "Geography", "Polity", "Economics", "Science", "Current Affairs"],
      weightage: "25%",
      difficulty: "Medium"
    }
  ];

  const preparationTips = [
    {
      icon: "📖",
      title: "Basic Concepts",
      description: "Focus on building strong fundamentals in basic mathematics and reasoning"
    },
    {
      icon: "📝",
      title: "Regular Practice",
      description: "Practice daily with simple questions to build confidence and speed"
    },
    {
      icon: "📰",
      title: "Current Affairs",
      description: "Stay updated with basic current affairs and general knowledge"
    },
    {
      icon: "✍️",
      title: "Writing Practice",
      description: "Practice essay and letter writing for the descriptive paper"
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
            <Link href="/exam-categories/ssc" className="hover:text-blue-600">SSC Exams</Link>
            <span>›</span>
            <span className="text-blue-600 font-semibold">SSC MTS</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-orange-200/50 mb-8">
            <span className="text-2xl">{examDetails.icon}</span>
            <span className="text-sm font-semibold text-gray-700">SSC Multi Tasking Staff</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text-primary">{examDetails.name}</span>
            <br />
            <span className="text-gray-800">Complete Preparation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {examDetails.description}. Get comprehensive preparation with our expert-designed study materials and practice tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Mock Test
            </button>
            <button className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 text-lg">
              Download Syllabus
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: examDetails.totalVacancies, label: "Total Vacancies", icon: "💼" },
              { number: examDetails.difficulty, label: "Difficulty Level", icon: "📊" },
              { number: "2 Papers", label: "Exam Structure", icon: "📋" },
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
              Jump directly to what you need for your SSC MTS preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyMaterials.map((material, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${material.bgColor} rounded-2xl p-6 border border-gray-200/50 hover:border-orange-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-xl">{material.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                    {material.category}
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {material.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
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
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SSC MTS Exam Structure
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The SSC MTS exam consists of a Computer Based Test with 2 mandatory sessions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Session 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Session 1</h3>
                  <p className="text-gray-600">Computer Based Test</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Duration</span>
                  <span className="text-orange-600 font-semibold">45 minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Questions</span>
                  <span className="text-orange-600 font-semibold">40</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marks</span>
                  <span className="text-orange-600 font-semibold">120</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Negative Marking</span>
                  <span className="text-green-500 font-semibold">No</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Subjects:</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Numerical & Mathematical Ability</span>
                    <div className="text-xs text-gray-600">20 Questions, 60 Marks</div>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">Reasoning Ability & Problem Solving</span>
                    <div className="text-xs text-gray-600">20 Questions, 60 Marks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-red-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Session 2</h3>
                  <p className="text-gray-600">Computer Based Test</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Duration</span>
                  <span className="text-red-600 font-semibold">45 minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Questions</span>
                  <span className="text-red-600 font-semibold">50</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marks</span>
                  <span className="text-red-600 font-semibold">150</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Negative Marking</span>
                  <span className="text-red-500 font-semibold">1 mark per wrong answer</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Subjects:</h4>
                <div className="space-y-2">
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">General Awareness</span>
                    <div className="text-xs text-gray-600">25 Questions, 75 Marks</div>
                  </div>
                  <div className="bg-orange-50 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">English Language & Comprehension</span>
                    <div className="text-xs text-gray-600">25 Questions, 75 Marks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Both sessions are mandatory. Failure to attempt any session will result in disqualification.
              </p>
            </div>
          </div>

          {/* Additional Information for Havaldar Posts */}
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-blue-900 mb-3">For Havaldar Posts Only</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Physical Efficiency Test (PET)</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>Male:</strong> 1600 meters in 15 minutes</li>
                    <li><strong>Female:</strong> 1 km in 20 minutes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Physical Standard Test (PST)</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>Male:</strong> Height 157.5 cm, Chest 81 cm</li>
                    <li><strong>Female:</strong> Height 152 cm, Weight 48 kg</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Topics */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
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
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-orange-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">
                      {topic.subject}
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {topic.weightage}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        topic.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
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
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>💡</span>
              <span>Expert Tips</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Preparation <span className="gradient-text-primary">Strategy</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these expert tips to crack SSC MTS with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-orange-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto">
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-orange-700 transition-colors duration-300">
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
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Crack <span className="text-yellow-300">SSC MTS?</span>
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Start your preparation today with our comprehensive study materials and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200 text-lg">
              View All Mock Tests
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 