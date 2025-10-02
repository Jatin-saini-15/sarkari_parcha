'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

const examCategories = [
  {
    title: 'SSC Exams',
    description: 'Staff Selection Commission exams including CGL, CHSL, MTS, JE, CPO, GD',
    href: '/exam-categories/ssc',
    icon: '🏛️',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    exams: ['CGL', 'CHSL', 'MTS', 'JE', 'CPO', 'GD'],
    posts: '50,000+ Posts',
    difficulty: 'Medium to Hard'
  },
  {
    title: 'Railways (RRB)',
    description: 'Railway Recruitment Board exams including NTPC, Group D, JE, ALP',
    href: '/exam-categories/railways',
    icon: '🚂',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    exams: ['NTPC', 'Group D', 'JE', 'ALP'],
    posts: '1,00,000+ Posts',
    difficulty: 'Easy to Medium'
  },
  {
    title: 'Banking',
    description: 'Banking sector exams including IBPS, SBI, RBI, NABARD',
    href: '/exam-categories/banking',
    icon: '🏦',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    exams: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'NABARD'],
    posts: '25,000+ Posts',
    difficulty: 'Medium to Hard'
  },
  {
    title: 'Defence',
    description: 'Defence services exams including NDA, CDS, AFCAT, Indian Army',
    href: '/exam-categories/defence',
    icon: '🛡️',
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100',
    borderColor: 'border-red-200',
    exams: ['NDA', 'CDS', 'AFCAT', 'Indian Army'],
    posts: '15,000+ Posts',
    difficulty: 'Hard'
  },
  {
    title: 'Teaching',
    description: 'Teaching exams including CTET, TET, KVS, NVS, DSSSB',
    href: '/exam-categories/teaching',
    icon: '📚',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-200',
    exams: ['CTET', 'TET', 'KVS', 'NVS'],
    posts: '30,000+ Posts',
    difficulty: 'Easy to Medium'
  },
  {
    title: 'UPSC',
    description: 'Union Public Service Commission exams including Civil Services, Engineering Services',
    href: '/exam-categories/upsc',
    icon: '🏛️',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    exams: ['Civil Services', 'Engineering Services', 'Forest Service'],
    posts: '1,000+ Posts',
    difficulty: 'Very Hard'
  },
  {
    title: 'State PSC',
    description: 'State Public Service Commission exams for various states',
    href: '/exam-categories/state-psc',
    icon: '🏢',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'from-teal-50 to-teal-100',
    borderColor: 'border-teal-200',
    exams: ['UPPSC', 'BPSC', 'MPPSC', 'RPSC'],
    posts: '20,000+ Posts',
    difficulty: 'Medium to Hard'
  },
  {
    title: 'Police Recruitment',
    description: 'Police and law enforcement exams for various states and central forces',
    href: '/exam-categories/police',
    icon: '👮',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    exams: ['SI', 'Constable', 'ASI', 'Head Constable'],
    posts: '40,000+ Posts',
    difficulty: 'Easy to Medium'
  }
];

export default function ExamCategoriesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Exam Category
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Start your government job preparation journey with our comprehensive study materials and mock tests
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">2,50,000+</span> Job Vacancies
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">50,000+</span> Students Enrolled
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">95%</span> Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Exam Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of government exam preparation materials
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examCategories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group block transform hover:scale-105 transition-all duration-300"
            >
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${category.borderColor} group-hover:border-opacity-50`}>
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500">{category.posts}</p>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {category.description}
                </p>
                
                {/* Difficulty Badge */}
                <div className="mb-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.bgColor} text-gray-700`}>
                    Difficulty: {category.difficulty}
                  </span>
                </div>

                {/* Exam Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {category.exams.map((exam, examIndex) => (
                    <span
                      key={examIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
                
                {/* CTA Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                    Start Preparation
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400">
                    Click to explore →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Sarkari Parcha?</h2>
            <p className="text-lg text-gray-600">Everything you need for government exam success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mock Tests</h3>
              <p className="text-gray-600">Practice with real exam pattern mock tests</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Material</h3>
              <p className="text-gray-600">Comprehensive notes and study guides</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track your progress and improve weak areas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 