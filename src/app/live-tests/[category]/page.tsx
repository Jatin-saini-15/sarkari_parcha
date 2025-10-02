'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import UpgradeModal from '../../components/UpgradeModal';
import PremiumPurchaseModal from '../../components/PremiumPurchaseModal';
import { usePremiumAccess } from '../../hooks/usePremiumAccess';

interface LiveTest {
  id: string;
  title: string;
  slug: string;
  description?: string;
  examUrl: string;
  isFree: boolean;
  duration?: number;
  totalMarks?: number;
  scheduledAt?: string;
  examEndTime?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryLiveTestsPage() {
  const params = useParams();
  const category = params.category as string;
  
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [liveTests, setLiveTests] = useState<LiveTest[]>([]);
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
        fetch(`/api/live-tests/${category}/tests`)
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData.category);
      }

      if (testsResponse.ok) {
        const testsData = await testsResponse.json();
        setLiveTests(testsData.tests);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTestStatus = (test: LiveTest) => {
    if (!test.scheduledAt) return { status: 'available', label: 'Available', color: 'green' };
    
    const now = new Date();
    const startTime = new Date(test.scheduledAt);
    const endTime = test.examEndTime ? new Date(test.examEndTime) : null;

    if (endTime && now > endTime) {
      return { status: 'ended', label: 'Ended', color: 'red' };
    } else if (now < startTime) {
      return { status: 'upcoming', label: 'Upcoming', color: 'yellow' };
    } else {
      return { status: 'live', label: 'Live Now', color: 'green' };
    }
  };

  const handleTestAccess = (test: LiveTest) => {
    const { status } = getTestStatus(test);
    
    if (status === 'ended') {
      alert('⏰ This live test has ended. You can no longer access it.');
      return;
    }
    
    if (status === 'upcoming') {
      const startTime = new Date(test.scheduledAt!);
      alert(`⏰ This live test hasn't started yet. It will begin on ${startTime.toLocaleString()}`);
      return;
    }
    
    handlePremiumAction(test.isFree, () => {
      window.open(test.examUrl, '_blank');
    });
  };

  const canUserAccessTest = (test: LiveTest) => {
    return checkPremiumAccess(test.isFree);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live tests...</p>
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
          <Link href="/live-tests" className="text-blue-600 hover:text-blue-700">
            ← Back to Live Tests
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
              <h1 className="text-3xl font-bold text-gray-900">{categoryData.name} Live Tests</h1>
              <p className="text-gray-600 mt-2">Join scheduled live tests and compete with thousands of students</p>
            </div>
            <Link
              href="/live-tests"
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
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {liveTests.length} Live Tests Available
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Available Live Tests</h2>
          <p className="text-gray-600 max-w-3xl">
            Join our scheduled live tests for {categoryData.name} exams. Compete with thousands of students 
            in real-time and get instant rankings and performance analysis.
          </p>
        </div>

        {liveTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveTests.map(test => {
              const { status, label, color } = getTestStatus(test);
              const canAccess = canUserAccessTest(test);
              
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          color === 'green' ? 'bg-green-100 text-green-700' :
                          color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {label}
                        </span>
                        {test.isFree ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            FREE
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {test.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {test.description}
                    </p>
                  )}
                  
                  {/* Schedule Information */}
                  {test.scheduledAt && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Start Time:</span>
                        </div>
                        <p className="ml-6">{new Date(test.scheduledAt).toLocaleString()}</p>
                        
                        {test.examEndTime && (
                          <>
                            <div className="flex items-center gap-2 mb-1 mt-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">End Time:</span>
                            </div>
                            <p className="ml-6">{new Date(test.examEndTime).toLocaleString()}</p>
                          </>
                        )}
                      </div>
                    </div>
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
                    disabled={status === 'ended'}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === 'ended'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : status === 'upcoming'
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : canAccess
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {status === 'ended' 
                      ? 'Test Ended'
                      : status === 'upcoming'
                      ? 'View Schedule'
                      : canAccess
                      ? 'Join Live Test'
                      : 'Upgrade to Access'
                    }
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Live Tests Available</h3>
            <p className="text-gray-500">Live tests for this category will be scheduled soon.</p>
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