'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';

interface ExamYear {
  id: string;
  year: number;
  isActive: boolean;
  _count: {
    exams: number;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface ExamNameInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function ExamNamePage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const examNameSlug = params.examName as string;
  
  const [examYears, setExamYears] = useState<ExamYear[]>([]);
  const [examNameInfo, setExamNameInfo] = useState<ExamNameInfo | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (categorySlug && examNameSlug) {
      fetchExamYears();
    }
  }, [categorySlug, examNameSlug]);

  const fetchExamYears = async () => {
    try {
      const response = await fetch(`/api/pyq/${categorySlug}/${examNameSlug}/years`);
      if (response.ok) {
        const data = await response.json();
        setExamYears(data.examYears);
        
        if (data.examYears.length > 0) {
          setCategoryInfo({
            name: data.examYears[0].category.name
          });
          setExamNameInfo({
            id: data.examYears[0].examName?.id || '',
            name: data.examYears[0].examName?.name || examNameSlug.toUpperCase(),
            slug: examNameSlug,
            description: data.examYears[0].examName?.description
          });
        }
      }
    } catch (error) {
      console.error('Error fetching exam years:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam years...</p>
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
                <Link href={`/pyq/${categorySlug}`} className="hover:text-blue-600 transition-colors">
                  {categoryInfo?.name}
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{examNameInfo?.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {examNameInfo?.name} - {categoryInfo?.name} Exams
              </h1>
              <p className="text-gray-600 mt-2">
                Select a year to access previous year question papers for {examNameInfo?.name}
              </p>
            </div>
            <Link
              href={`/pyq/${categorySlug}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to {categoryInfo?.name} Exams
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
            {examYears.length} Years Available
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Select Exam Year</h2>
          <p className="text-gray-600 max-w-3xl">
            Choose the year for which you want to practice {examNameInfo?.name} questions. 
            Each year contains multiple exam papers and practice tests.
          </p>
        </div>

        {examYears.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examYears.map((examYear) => (
              <Link
                key={examYear.id}
                href={`/pyq/${categorySlug}/${examNameSlug}/${examYear.year}`}
                className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    Year {examYear.year}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {examYear._count.exams} {examYear._count.exams === 1 ? 'exam' : 'exams'} available
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      examYear.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {examYear.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Years Available</h3>
            <p className="text-gray-500">Exam years for this category will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
} 