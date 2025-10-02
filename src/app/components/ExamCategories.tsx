'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { examData, examCategories, shortExamName } from "../constants";
import { Exam } from "../types";

export default function ExamCategories() {
  const [selectedCategory, setSelectedCategory] = useState(examCategories[0]);
  const [showAllExams, setShowAllExams] = useState(false);
  const categoryRowRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryRowRef.current) {
      const scrollAmount = 200;
      categoryRowRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const examsToShow = showAllExams ? examData[selectedCategory] : examData[selectedCategory]?.slice(0, 8) || [];
  const hasMoreExams = (examData[selectedCategory]?.length || 0) > 8;

  return (
    <section className="py-20 px-4 w-full bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            40+ Exams Covered
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Choose Your <span className="gradient-text-primary">Exam Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select from our comprehensive collection of government exam categories and start your preparation journey today.
          </p>
        </div>
        
        {/* Category Selection with Horizontal Scroll */}
        <div className="relative mb-12">
          <button
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border border-gray-200 shadow-medium rounded-full w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-strong transition-all duration-200"
            onClick={() => scrollCategories('left')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div
            ref={categoryRowRef}
            className="overflow-x-auto flex gap-3 px-8 scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {examCategories.map((cat, i) => (
              <button
                key={i}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap border-2 ${
                  selectedCategory === cat 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-medium transform scale-105" 
                    : "border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-soft"
                }`}
                onClick={() => { 
                  setSelectedCategory(cat); 
                  setShowAllExams(false); 
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border border-gray-200 shadow-medium rounded-full w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-strong transition-all duration-200"
            onClick={() => scrollCategories('right')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        {/* Selected Category Info */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedCategory}</h3>
              <p className="text-gray-600">
                {examData[selectedCategory]?.length || 0} exams available • Updated syllabus • Expert curated content
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Mock Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Study Material</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exam Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {examsToShow.map((exam: Exam, i: number) => (
            <Link 
              key={i} 
              href={exam.link} 
              className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center text-center hover:border-blue-300 transform hover:scale-105"
            >
              <div className="relative mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                  <Image 
                    src={exam.icon} 
                    alt={exam.name} 
                    width={32} 
                    height={32} 
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-2 h-2 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 text-sm transition-colors duration-200 leading-tight">
                {shortExamName(exam.name)}
              </h4>
              <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click to explore
              </p>
            </Link>
          ))}
        </div>
        
        {/* View More/Less Button */}
        {hasMoreExams && (
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
              onClick={() => setShowAllExams((v) => !v)}
            >
              {showAllExams ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  <span>View All {examData[selectedCategory]?.length || 0} Exams</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Popular Exams Quick Access */}
        <div className="mt-16 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 p-12 rounded-3xl border border-gray-200/50">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
                <span className="animate-pulse">🔥</span>
                <span>Trending Now</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text-primary">Most Popular</span>
                <span className="text-gray-800"> Exams</span>
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Quick access to the most sought-after government exams with highest success rates
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  name: "SSC CGL", 
                  category: "SSC Exams", 
                  gradient: "from-blue-500 to-blue-600",
                  bgGradient: "from-blue-50 to-blue-100",
                  icon: "🏛️",
                  applicants: "25L+",
                  description: "Combined Graduate Level",
                  link: "/exam-categories/ssc/cgl"
                },
                { 
                  name: "IBPS PO", 
                  category: "Banking", 
                  gradient: "from-green-500 to-green-600",
                  bgGradient: "from-green-50 to-green-100",
                  icon: "🏦",
                  applicants: "15L+",
                  description: "Probationary Officer",
                  link: "/exam-categories/banking"
                },
                { 
                  name: "RRB NTPC", 
                  category: "Railways (RRB)", 
                  gradient: "from-orange-500 to-orange-600",
                  bgGradient: "from-orange-50 to-orange-100",
                  icon: "🚂",
                  applicants: "1.2Cr+",
                  description: "Non-Technical Popular Categories",
                  link: "/exam-categories/railways/ntpc"
                },
                { 
                  name: "UPSC IAS", 
                  category: "UPSC", 
                  gradient: "from-purple-500 to-purple-600",
                  bgGradient: "from-purple-50 to-purple-100",
                  icon: "🇮🇳",
                  applicants: "10L+",
                  description: "Indian Administrative Service",
                  link: "/exam-categories/upsc"
                },
                { 
                  name: "SSC CHSL", 
                  category: "SSC Exams", 
                  gradient: "from-red-500 to-red-600",
                  bgGradient: "from-red-50 to-red-100",
                  icon: "📋",
                  applicants: "40L+",
                  description: "Combined Higher Secondary Level",
                  link: "/exam-categories/ssc/chsl"
                },
                { 
                  name: "SBI PO", 
                  category: "Banking", 
                  gradient: "from-indigo-500 to-indigo-600",
                  bgGradient: "from-indigo-50 to-indigo-100",
                  icon: "💼",
                  applicants: "20L+",
                  description: "Probationary Officer",
                  link: "/exam-categories/banking"
                },
              ].map((exam, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                >
                  <Link
                    href={exam.link}
                    className={`w-full p-6 bg-gradient-to-br ${exam.bgGradient} rounded-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-[1.02] hover:-translate-y-1 text-left relative overflow-hidden group block`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${exam.gradient} rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          <span className="text-xl group-hover:scale-110 transition-transform duration-300">{exam.icon}</span>
                        </div>
                        <div className="text-right transform group-hover:scale-105 transition-transform duration-300">
                          <div className="text-xs text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300">Applicants</div>
                          <div className={`text-sm font-bold bg-gradient-to-r ${exam.gradient} bg-clip-text text-transparent`}>
                            {exam.applicants}
                          </div>
                        </div>
                      </div>
                      
                      {/* Exam Name */}
                      <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mb-2 group-hover:translate-x-1 transform">
                        {exam.name}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mb-4 group-hover:translate-x-1 transform">
                        {exam.description}
                      </p>
                      
                      {/* Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/70 group-hover:bg-white/90 text-gray-700 border border-gray-200/50 group-hover:border-blue-200 transition-all duration-300 group-hover:scale-105">
                          {exam.category}
                        </span>
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-soft">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free Mock Tests Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Updated Syllabus</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  <span>Expert Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 