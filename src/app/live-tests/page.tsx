'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  _count: {
    exams: number;
  };
}

// Popularity order for sorting
const popularityOrder = [
  'ssc', 'railways', 'banking', 'defence', 'teaching', 
  'upsc', 'state-psc', 'police', 'insurance', 'judiciary', 'entrance'
];

export default function LiveTestsPage() {
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/live-tests/categories');
      if (response.ok) {
        const data = await response.json();
        // Sort by popularity order
        const sortedCategories = data.categories.sort((a: ExamCategory, b: ExamCategory) => {
          const aIndex = popularityOrder.indexOf(a.slug);
          const bIndex = popularityOrder.indexOf(b.slug);
          
          // If both are in popularity order, sort by index
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one is in popularity order, prioritize it
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither is in popularity order, sort alphabetically
          return a.name.localeCompare(b.name);
        });
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching live test categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading exam categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Tests</h1>
              <p className="text-gray-600 mt-1">Join scheduled live tests and compete with thousands of students</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {categories.length} Exam Categories Available
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Exam Category</h2>
          <p className="text-gray-600 max-w-2xl">
            Choose from our comprehensive collection of government exam categories. Each category contains 
            scheduled live tests with real-time rankings and competitive environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/live-tests/${category.slug}`}
              className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-200/50 hover:border-orange-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category._count.exams} live tests available
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-200">
                {category.description || 'Live tests with real-time rankings for this category'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-600">Live test categories will appear here once they are added by administrators.</p>
          </div>
        )}
      </div>
    </div>
  );
} 