'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

interface ExamName {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    examYears: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const [examNames, setExamNames] = useState<ExamName[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (categorySlug) {
      fetchExamNames();
    }
  }, [categorySlug]);

  const fetchExamNames = async () => {
    try {
      const response = await fetch(`/api/pyq/${categorySlug}/exam-names`);
      if (response.ok) {
        const data = await response.json();
        setExamNames(data.examNames);
        
        if (data.examNames.length > 0) {
          setCategoryInfo({
            id: data.examNames[0].category?.id || '',
            name: data.examNames[0].category?.name || categorySlug.toUpperCase(),
            slug: categorySlug,
            description: data.examNames[0].category?.description
          });
        }
      }
    } catch (error) {
      console.error('Error fetching exam names:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam types...</p>
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
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Link href="/pyq" className="hover:text-blue-600 transition-colors">PYQ</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{categoryInfo?.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryInfo?.name} Exams - Previous Year Questions
              </h1>
              <p className="text-gray-600 mt-2">
                {categoryInfo?.description || `Staff Selection Commission exams including CGL, CHSL, MTS, CPO, JE`}
              </p>
            </div>
            <Link
              href="/pyq"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Categories
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
            {examNames.length} Exam Types Available
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Select Exam Type</h2>
          <p className="text-gray-600 max-w-3xl">
            Choose the exam type for which you want to practice previous year questions. Each exam 
            type contains multiple years and practice tests.
          </p>
        </div>

        {examNames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examNames.map((examName) => (
              <Link
                key={examName.id}
                href={`/pyq/${categorySlug}/${examName.slug}`}
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
                      {examName.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {examName._count.examYears} years available
                    </p>
                  </div>
                </div>
                
                {examName.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {examName.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Active
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exam Types Available</h3>
            <p className="text-gray-500">Exam types for this category will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
} 