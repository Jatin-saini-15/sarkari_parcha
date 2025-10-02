'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import UpgradeModal from '../../components/UpgradeModal';
import PremiumPurchaseModal from '../../components/PremiumPurchaseModal';
import { usePremiumAccess } from '../../hooks/usePremiumAccess';

interface MockTest {
  id: string;
  title: string;
  slug: string;
  description?: string;
  examUrl: string;
  isFree: boolean;
  duration?: number;
  totalMarks?: number;
}



interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryMockTestsPage() {
  const params = useParams();
  const category = params.category as string;
  
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
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
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const [categoryResponse, testsResponse] = await Promise.all([
        fetch(`/api/categories/${category}`),
        fetch(`/api/mock-tests/${category}/tests`)
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData.category);
      }

      if (testsResponse.ok) {
        const testsData = await testsResponse.json();
        setMockTests(testsData.tests);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccess = (test: MockTest) => {
    handlePremiumAction(test.isFree, () => {
      window.open(test.examUrl, '_blank');
    });
  };



  const canUserAccessTest = (isFree: boolean) => {
    return checkPremiumAccess(isFree);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mock tests...</p>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-4">The requested category does not exist.</p>
          <Link href="/mock-tests" className="text-blue-600 hover:text-blue-700">
            ← Back to Mock Tests
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
              <h1 className="text-3xl font-bold text-gray-900">{categoryData?.name} Mock Tests</h1>
              <p className="text-gray-600 mt-2">Practice with comprehensive mock tests for {categoryData?.name}</p>
            </div>
            <Link
              href="/mock-tests"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Categories
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* External Mock Tests Section */}
        {mockTests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">External Mock Tests</h2>
                <p className="text-gray-600">Professional test series from partner platforms</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {mockTests.length} tests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTests.map(test => {
                const canAccess = canUserAccessTest(test.isFree);
                
                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {test.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {test.isFree ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              FREE
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                              PREMIUM
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            External
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {test.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {test.duration && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {test.duration} mins
                          </span>
                        )}
                        {test.totalMarks && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {test.totalMarks} marks
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleTestAccess(test)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canAccess
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {canAccess ? 'Start Mock Test' : 'Upgrade to Access'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No tests available */}
        {mockTests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Mock Tests Available</h3>
            <p className="text-gray-500">Mock tests for this category will be available soon.</p>
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