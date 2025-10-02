'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  _count: {
    examYears: number;
  };
}

// Popularity order for sorting
const popularityOrder = [
  'ssc', 'railways', 'banking', 'defence', 'teaching', 
  'upsc', 'state-psc', 'police', 'insurance', 'judiciary', 'entrance'
];

export default function PYQPage() {
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pyq/categories');
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
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Previous Year Questions (PYQs)</h1>
              <p className="text-gray-600 mt-2">Practice with authentic previous year question papers from all major government exams</p>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {categories.length} Exam Categories Available
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Select Your Exam Category</h2>
          <p className="text-gray-600 max-w-3xl">
            Choose from our comprehensive collection of government exam categories. Each category contains 
            year-wise organized previous year question papers and practice tests.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/pyq/${category.slug}`}
                className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category._count.examYears} years available
                    </p>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    category.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-500">Exam categories will appear here once they are added by administrators.</p>
          </div>
        )}
      </div>
    </div>
  );
} 