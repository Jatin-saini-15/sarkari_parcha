'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';
import UpgradeModal from '../../../../components/UpgradeModal';
import PremiumPurchaseModal from '../../../../components/PremiumPurchaseModal';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';

interface Exam {
  id: string;
  title: string;
  slug: string;
  description?: string;
  examUrl: string;
  examType: string;
  isActive: boolean;
  isFree: boolean;
  duration?: number;
  totalMarks?: number;
  createdAt: string;
  examYear: {
    year: number;
    category: {
      name: string;
      slug: string;
      description?: string;
    };
  };
  examName?: {
    id: string;
    name: string;
    slug: string;
  };
}

type SortOption = 'alphabetical' | 'recent' | 'popular' | 'duration-asc' | 'duration-desc' | 'marks-asc' | 'marks-desc' | 'free-first';

export default function ExamYearPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const examNameSlug = params.examName as string;
  const year = params.year as string;
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; description?: string } | null>(null);
  const [examNameInfo, setExamNameInfo] = useState<{ name: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    if (categorySlug && examNameSlug && year) {
      fetchExams();
    }
  }, [categorySlug, examNameSlug, year]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [exams, sortBy, showFreeOnly, searchTerm]);

  const fetchExams = async () => {
    try {
      const response = await fetch(`/api/pyq/${categorySlug}/${examNameSlug}/${year}/exams`);
      if (response.ok) {
        const data = await response.json();
        setExams(data.exams);
        
        if (data.exams.length > 0) {
          setCategoryInfo({
            name: data.exams[0].examYear.category.name,
            description: data.exams[0].examYear.category.description
          });
          setExamNameInfo({
            name: data.exams[0].examName?.name || 'General'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...exams];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply free filter
    if (showFreeOnly) {
      filtered = filtered.filter(exam => exam.isFree);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          // For now, sort by free first then by recent (as a proxy for popularity)
          if (a.isFree !== b.isFree) return b.isFree ? 1 : -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'duration-asc':
          return (a.duration || 0) - (b.duration || 0);
        case 'duration-desc':
          return (b.duration || 0) - (a.duration || 0);
        case 'marks-asc':
          return (a.totalMarks || 0) - (b.totalMarks || 0);
        case 'marks-desc':
          return (b.totalMarks || 0) - (a.totalMarks || 0);
        case 'free-first':
          if (a.isFree !== b.isFree) return b.isFree ? 1 : -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredExams(filtered);
  };

  const handleExamAccess = (exam: Exam) => {
    handlePremiumAction(exam.isFree, () => {
      window.open(exam.examUrl, '_blank', 'noopener,noreferrer');
    });
  };

  const isExamPremium = (exam: Exam) => {
    return !exam.isFree;
  };

  const canUserAccessExam = (exam: Exam) => {
    return checkPremiumAccess(exam.isFree);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exams...</p>
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
                  {categoryInfo?.name || categorySlug}
                </Link>
                <span>/</span>
                <Link href={`/pyq/${categorySlug}/${examNameSlug}`} className="hover:text-blue-600 transition-colors">
                  {examNameInfo?.name}
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{year}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {examNameInfo?.name} - {categoryInfo?.name} {year}
              </h1>
              <p className="text-gray-600 mt-2">
                All {examNameInfo?.name} previous year question papers for {year}
              </p>
            </div>
            <Link
              href={`/pyq/${categorySlug}/${examNameSlug}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Years
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="alphabetical">Sort by Alphabetical A-Z</option>
                <option value="recent">Sort by Most Recent</option>
                <option value="popular">Sort by Most Popular</option>
                <option value="duration-asc">Sort by Duration (Low to High)</option>
                <option value="duration-desc">Sort by Duration (High to Low)</option>
                <option value="marks-asc">Sort by Marks (Low to High)</option>
                <option value="marks-desc">Sort by Marks (High to Low)</option>
                <option value="free-first">Sort by Free First</option>
              </select>
            </div>

            {/* Free Only Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Free Only</span>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredExams.length} of {exams.length} exams</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Free
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Premium
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredExams.length} of {exams.length} exams
          </p>
        </div>

        {/* Exams Grid */}
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const isPremiumExam = isExamPremium(exam);
              const canAccess = canUserAccessExam(exam);
              
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isPremiumExam ? (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            PREMIUM
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            FREE
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          exam.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exam.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {exam.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {exam.duration} mins
                        </span>
                      )}
                      {exam.totalMarks && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {exam.totalMarks} marks
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleExamAccess(exam)}
                    disabled={!exam.isActive}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      exam.isActive
                        ? canAccess
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {exam.isActive 
                      ? canAccess 
                        ? 'Start Exam' 
                        : 'Upgrade to Access'
                      : 'Inactive'
                    }
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Found</h3>
            <p className="text-gray-600">
              {searchTerm || showFreeOnly 
                ? 'Try adjusting your filters to see more results.' 
                : 'No exams are available for this category and year yet.'
              }
            </p>
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