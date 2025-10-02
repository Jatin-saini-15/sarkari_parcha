'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function RRBALPPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examDetails = {
    name: "RRB ALP",
    fullName: "Assistant Loco Pilot",
    description: "Railway Recruitment Board exam for Assistant Loco Pilot and Technician posts in Indian Railways",
    posts: "Assistant Loco Pilot, Technician Grade I, Technician Grade II, Technician Grade III",
    eligibility: "10th + ITI/Diploma",
    ageLimit: "18-28 years",
    salary: "₹19,900 - ₹63,200",
    icon: "🚄",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    difficulty: "Medium-High",
    popularity: "Very High",
    totalVacancies: "Multiple Posts",
    examMode: "Computer Based Test (CBT)",
    duration: "60 minutes",
    negativeMarking: "1/3 marks per wrong answer"
  };

  const studyMaterials = [
    {
      category: "Mock Tests",
      icon: "📝",
      items: [
        "Full Length Mock Tests",
        "CBT 1 & CBT 2 Practice",
        "Subject-wise Tests",
        "Previous Year Papers",
        "Sectional Tests"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      category: "Technical Knowledge",
      icon: "⚙️",
      items: [
        "Mechanical Engineering",
        "Electrical Engineering",
        "Electronics & Instrumentation",
        "Automobile Engineering",
        "Railway Technical Knowledge"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      category: "General Studies",
      icon: "📚",
      items: [
        "General Awareness",
        "Current Affairs",
        "Railway General Knowledge",
        "Indian History & Geography",
        "Polity & Economics"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      category: "Aptitude & Reasoning",
      icon: "🧠",
      items: [
        "Quantitative Aptitude",
        "Logical Reasoning",
        "Verbal Ability",
        "Data Interpretation",
        "Mental Ability"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  const examPattern = [
    {
      stage: "CBT 1 (Screening)",
      subjects: [
        { name: "Mathematics", questions: 20, marks: 20 },
        { name: "Mental Ability & Reasoning", questions: 20, marks: 20 },
        { name: "General Science", questions: 20, marks: 20 },
        { name: "General Awareness & Current Affairs", questions: 15, marks: 15 }
      ],
      totalQuestions: 75,
      totalMarks: 75,
      duration: "60 minutes",
      negativeMarking: "1/3 mark"
    },
    {
      stage: "CBT 2 (Mains)",
      subjects: [
        { name: "Mathematics", questions: 15, marks: 15 },
        { name: "General Intelligence & Reasoning", questions: 10, marks: 10 },
        { name: "Basic Science & Engineering", questions: 15, marks: 15 },
        { name: "General Awareness", questions: 10, marks: 10 },
        { name: "Relevant Trade", questions: 25, marks: 50 }
      ],
      totalQuestions: 75,
      totalMarks: 100,
      duration: "90 minutes",
      negativeMarking: "1/3 mark"
    }
  ];

  const technicalTrades = [
    {
      trade: "Mechanical",
      subjects: ["Engineering Mechanics", "Strength of Materials", "Theory of Machines", "Thermodynamics", "Manufacturing Processes"],
      description: "Locomotive and rolling stock maintenance"
    },
    {
      trade: "Electrical",
      subjects: ["Basic Electrical", "DC Machines", "AC Machines", "Electrical Circuits", "Power Systems"],
      description: "Electrical systems and traction maintenance"
    },
    {
      trade: "Electronics",
      subjects: ["Basic Electronics", "Digital Electronics", "Communication Systems", "Microprocessors", "Control Systems"],
      description: "Electronic systems and signaling equipment"
    },
    {
      trade: "Automobile",
      subjects: ["IC Engines", "Automobile Systems", "Vehicle Maintenance", "Transmission Systems", "Fuel Systems"],
      description: "Railway vehicle maintenance and operations"
    }
  ];

  const selectionProcess = [
    {
      stage: "CBT 1",
      description: "Computer Based Test (Screening)",
      subjects: "Mathematics, Mental Ability & Reasoning, General Science, General Awareness",
      duration: "60 minutes",
      questions: "75 questions"
    },
    {
      stage: "CBT 2",
      description: "Computer Based Test (Mains)",
      subjects: "Mathematics, Reasoning, Basic Science & Engineering, General Awareness, Relevant Trade",
      duration: "90 minutes",
      questions: "75 questions"
    },
    {
      stage: "Computer Based Aptitude Test (CBAT)",
      description: "For ALP posts only",
      subjects: "Psycho Aptitude Test",
      duration: "71 minutes",
      questions: "As per requirement"
    },
    {
      stage: "Document Verification",
      description: "Verification of certificates and documents",
      subjects: "Educational & Technical Certificates",
      duration: "As required",
      questions: "N/A"
    },
    {
      stage: "Medical Examination",
      description: "Medical fitness test",
      subjects: "Medical Check-up including Vision Test",
      duration: "As required",
      questions: "N/A"
    }
  ];

  const preparationTips = [
    {
      icon: "🎯",
      title: "Focus on Technical Trade",
      description: "Technical trade carries maximum weightage. Master your specific trade subjects thoroughly"
    },
    {
      icon: "📊",
      title: "Practice CBAT",
      description: "For ALP posts, practice psycho-aptitude tests to improve reaction time and accuracy"
    },
    {
      icon: "📖",
      title: "Railway Knowledge",
      description: "Study railway-specific technical knowledge and current developments in Indian Railways"
    },
    {
      icon: "⏰",
      title: "Time Management",
      description: "Practice solving questions quickly as time is limited in both CBT 1 and CBT 2"
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
            <span className="text-blue-600 font-semibold">RRB ALP</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="text-2xl">{examDetails.icon}</span>
            <span className="text-sm font-semibold text-gray-700">Railway Recruitment Board Assistant Loco Pilot</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{examDetails.name}</span>
            <br />
            <span className="text-gray-800">Complete Preparation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {examDetails.description}. Prepare for technical posts across various railway departments with our comprehensive study materials and mock tests.
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
              { number: examDetails.totalVacancies, label: "Available Posts", icon: "💼" },
              { number: examDetails.difficulty, label: "Difficulty Level", icon: "📊" },
              { number: "2 CBTs + CBAT", label: "Exam Structure", icon: "📋" },
              { number: examDetails.salary, label: "Salary Range", icon: "💰" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200/50">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">{stat.number}</div>
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
              Quick <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Access</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jump directly to what you need for your RRB ALP preparation
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

      {/* Exam Pattern */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exam Pattern
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Detailed exam pattern for RRB ALP CBT 1 and CBT 2
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {examPattern.map((pattern, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{pattern.stage}</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  {pattern.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{subject.questions} Q</span>
                        <span>{subject.marks} M</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Questions:</span>
                    <span className="font-semibold text-blue-600">{pattern.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Marks:</span>
                    <span className="font-semibold text-blue-600">{pattern.totalMarks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">{pattern.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Negative Marking:</span>
                    <span className="font-semibold text-red-600">{pattern.negativeMarking}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Trades */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Trades
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Important technical subjects for different trades in RRB ALP exam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technicalTrades.map((trade, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{trade.trade}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{trade.description}</p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Key Subjects:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {trade.subjects.map((subject, subIndex) => (
                      <div key={subIndex} className="flex items-center gap-2 text-gray-700 bg-blue-50 rounded-lg p-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
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
              Complete overview of the RRB ALP selection process
            </p>
          </div>

          <div className="space-y-6">
            {selectionProcess.map((stage, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
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

      {/* Preparation Tips */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preparation Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expert tips and strategies to crack RRB ALP exam
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
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your RRB ALP Preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who cleared RRB ALP with our comprehensive preparation platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 