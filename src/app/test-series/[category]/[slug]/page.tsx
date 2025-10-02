'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import UpgradeModal from '../../../components/UpgradeModal';
import PremiumPurchaseModal from '../../../components/PremiumPurchaseModal';
import { usePremiumAccess } from '../../../hooks/usePremiumAccess';

interface Test {
  id: string;
  title: string;
  slug: string;
  description?: string;
  examUrl: string;
  isFree: boolean;
  duration?: number;
  totalMarks?: number;
  isActive: boolean;
}

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
  tests: Test[];
}

export default function TestSeriesDetailPage() {
  const params = useParams();
  const [testSeries, setTestSeries] = useState<TestSeries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const {
    checkPremiumAccess,
    handlePremiumAction,
    showUpgradeModal,
    showPremiumModal,
    closeUpgradeModal,
    handleUpgradeToPremium,
    closePremiumModal
  } = usePremiumAccess();

  useEffect(() => {
    if (params.category && params.slug) {
      fetchTestSeries();
    }
  }, [params.category, params.slug]);

  const fetchTestSeries = async () => {
    try {
      const response = await fetch(`/api/test-series/${params.category}/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setTestSeries(data.testSeries);
      } else {
        console.error('Test series not found');
      }
    } catch (error) {
      console.error('Error fetching test series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccess = (test: Test) => {
    const isFree = test.isFree || testSeries?.isFree || false;
    
    handlePremiumAction(isFree, () => {
      window.open(test.examUrl, '_blank');
    });
  };

  const isTestPremium = (test: Test) => {
    return !test.isFree && !testSeries?.isFree;
  };

  const canUserAccessTest = (test: Test) => {
    const isFree = test.isFree || testSeries?.isFree || false;
    return checkPremiumAccess(isFree);
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

  if (!testSeries) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Series Not Found</h1>
          <p className="text-gray-600 mb-6">The test series you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/test-series"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Test Series
          </Link>
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
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Link href="/test-series" className="hover:text-blue-600">Test Series</Link>
                <span>›</span>
                <Link href={`/test-series`} className="hover:text-blue-600">{testSeries.category.name}</Link>
                <span>›</span>
                <span className="text-gray-900">{testSeries.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{testSeries.name}</h1>
              <p className="text-gray-600 mt-2">{testSeries.description || 'Comprehensive test series for exam preparation'}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  testSeries.isFree 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {testSeries.isFree ? 'FREE' : 'PREMIUM'}
                </span>
                <span className="text-sm text-gray-500">{testSeries.tests.length} tests available</span>
              </div>
            </div>
            <Link
              href="/test-series"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Test Series
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testSeries.tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSeries.tests.map((test, index) => {
              const isPremiumTest = isTestPremium(test);
              const canAccess = canUserAccessTest(test);
              
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {test.duration && <span>{test.duration} mins</span>}
                        {test.totalMarks && <span>• {test.totalMarks} marks</span>}
                      </div>
                    </div>
                  </div>
                  
                  {test.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {test.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isPremiumTest ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                          PREMIUM
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          FREE
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        test.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTestAccess(test)}
                      disabled={!test.isActive}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        test.isActive
                          ? canAccess
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {test.isActive 
                        ? canAccess 
                          ? 'Start Test' 
                          : 'Upgrade to Access'
                        : 'Inactive'
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Available</h3>
            <p className="text-gray-500">Tests for this series will be available soon.</p>
          </div>
        )}
      </div>

      {/* Premium Access Modals */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        onUpgrade={handleUpgradeToPremium}
      />
      
      <PremiumPurchaseModal 
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
      />
    </div>
  );
} 