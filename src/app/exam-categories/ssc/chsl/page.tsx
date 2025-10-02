'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function SSCCHSLPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examDetails = {
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
    totalVacancies: "4,500+",
    examMode: "Computer Based Test (CBT)",
    duration: "60 minutes",
    negativeMarking: "0.50 marks per wrong answer"
  };

  const examStructure = [
    {
      tier: "Tier 1",
      type: "Computer Based Test",
      duration: "60 minutes",
      questions: "100 questions",
      subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Language"],
      marks: "200 marks",
      qualifying: "Qualifying"
    },
    {
      tier: "Tier 2",
      type: "Descriptive Paper",
      duration: "60 minutes",
      questions: "Descriptive",
      subjects: ["Essay Writing", "Letter/Application Writing"],
      marks: "100 marks",
      qualifying: "Qualifying"
    },
    {
      tier: "Tier 3",
      type: "Skill Test/Typing Test",
      duration: "Variable",
      questions: "Practical",
      subjects: ["Data Entry Speed Test", "Typing Test"],
      marks: "Qualifying",
      qualifying: "Final Selection"
    }
  ];

  const studyMaterials = [
    {
      category: "Mock Tests",
      icon: "📝",
      items: [
        "Full Length Mock Tests",
        "Tier-wise Practice Tests",
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
        "Formula Sheets",
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
        "Last 10 Years Papers",
        "Tier-wise PYQs",
        "Detailed Solutions",
        "Trend Analysis",
        "Important Questions"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      category: "Typing Practice",
      icon: "⌨️",
      items: [
        "Hindi Typing Tests",
        "English Typing Tests",
        "Speed Building",
        "Accuracy Tests",
        "Practice Software"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  const importantTopics = [
    {
      subject: "Quantitative Aptitude",
      topics: ["Number System", "Percentage", "Ratio & Proportion", "Time & Work", "Simple & Compound Interest", "Profit & Loss"],
      weightage: "25%",
      difficulty: "Medium"
    },
    {
      subject: "General Intelligence",
      topics: ["Analogies", "Classification", "Series", "Coding-Decoding", "Blood Relations", "Direction Sense"],
      weightage: "25%",
      difficulty: "Medium"
    },
    {
      subject: "English Language",
      topics: ["Reading Comprehension", "Grammar", "Vocabulary", "Synonyms & Antonyms", "Idioms & Phrases", "Sentence Improvement"],
      weightage: "25%",
      difficulty: "Medium"
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
      icon: "📅",
      title: "Time Table",
      description: "Create a balanced study schedule covering all subjects with equal emphasis"
    },
    {
      icon: "⌨️",
      title: "Typing Practice",
      description: "Practice typing daily to achieve required speed and accuracy for Tier 3"
    },
    {
      icon: "📝",
      title: "Descriptive Writing",
      description: "Practice essay and letter writing for Tier 2 descriptive paper"
    },
    {
      icon: "🎯",
      title: "Accuracy Focus",
      description: "Focus on accuracy over speed to avoid negative marking in Tier 1"
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
            <span className="text-blue-600 font-semibold">SSC CHSL</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-green-200/50 mb-8">
            <span className="text-2xl">{examDetails.icon}</span>
            <span className="text-sm font-semibold text-gray-700">SSC Combined Higher Secondary Level</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text-primary">{examDetails.name}</span>
            <br />
            <span className="text-gray-800">Complete Preparation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {examDetails.description}. Get comprehensive preparation with our expert-designed study materials, mock tests, and typing practice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Mock Test
            </button>
            <button className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 text-lg">
              Practice Typing Test
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: examDetails.totalVacancies, label: "Total Vacancies", icon: "💼" },
              { number: examDetails.difficulty, label: "Difficulty Level", icon: "📊" },
              { number: "3 Tiers", label: "Exam Structure", icon: "📋" },
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
              Jump directly to what you need for your SSC CHSL preparation
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

      {/* Exam Structure */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span>📋</span>
              <span>Exam Pattern</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              SSC CHSL <span className="gradient-text-primary">Exam Structure</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understand the complete exam pattern and prepare strategically for each tier
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {examStructure.map((tier, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                        {tier.tier}
                      </h3>
                      <p className="text-sm text-gray-600">{tier.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Duration:</span>
                      <span className="text-gray-600 ml-1">{tier.duration}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Questions:</span>
                      <span className="text-gray-600 ml-1">{tier.questions}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Marks:</span>
                      <span className="text-green-600 ml-1 font-semibold">{tier.marks}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Nature:</span>
                      <span className="text-blue-600 ml-1 font-semibold">{tier.qualifying}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Subjects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tier.subjects.map((subject, subIndex) => (
                        <span key={subIndex} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      {topic.subject}
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
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
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
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
              Follow these expert tips to crack SSC CHSL with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto">
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
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
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Crack <span className="text-yellow-300">SSC CHSL?</span>
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Start your preparation today with our comprehensive study materials and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200 text-lg">
              View All Mock Tests
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 