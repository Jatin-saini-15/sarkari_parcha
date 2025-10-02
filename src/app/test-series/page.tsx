'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface TestSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isFree: boolean;
  isActive: boolean;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    exams: number;
  };
}

export default function TestSeriesPage() {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTestSeries();
  }, []);

  const fetchTestSeries = async () => {
    try {
      const response = await fetch('/api/test-series/categories');
      if (response.ok) {
        const data = await response.json();
        setTestSeries(data.testSeries);
      }
    } catch (error) {
      console.error('Error fetching test series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSeriesClick = (series: TestSeries) => {
    // Allow all users to browse test series - premium check will happen when attempting tests
    window.location.href = `/test-series/${series.category.slug}/${series.slug}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test series...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Test Series</h1>
              <p className="text-gray-600 mt-2">Comprehensive test series for systematic preparation</p>
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
            {testSeries.length} Test Series Available
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Available Test Series</h2>
          <p className="text-gray-600 max-w-3xl">
            Choose from our comprehensive collection of test series. Each series contains 
            multiple tests for systematic preparation across different exam categories.
          </p>
        </div>

        {testSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSeries.map(series => (
              <div
                key={series.id}
                className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 cursor-pointer"
                onClick={() => handleTestSeriesClick(series)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {series.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {series.category.name} • {series._count.exams} tests
                    </p>
                  </div>
                </div>
                
                {series.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {series.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {series.isFree ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        PREMIUM
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      series.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {series.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Series Available</h3>
            <p className="text-gray-500">Test series will appear here once they are added by administrators.</p>
          </div>
        )}
      </div>
    </div>
  );
} 