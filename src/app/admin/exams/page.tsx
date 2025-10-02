'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ExamTypeFilter from './components/ExamTypeFilter';
import AddPYQForm from './components/AddPYQForm';
import AddLiveTestForm from './components/AddLiveTestForm';
import AddMockTestForm from './components/AddMockTestForm';

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

interface ExamYear {
  id: string;
  year: number;
  categoryId: string;
  isActive: boolean;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    exams: number;
  };
}

interface TestSeries {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    exams: number;
  };
}

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
  yearId?: string;
  testSeriesId?: string;
  scheduledAt?: string;
  examEndTime?: string;
  examYear?: {
    year: number;
    category: {
      name: string;
      slug: string;
    };
  };
  testSeries?: {
    name: string;
    category: {
      name: string;
      slug: string;
    };
  };
  examName?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ExamName {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
}

interface BaseExamFormData {
  title: string;
  examUrl: string;
  examType: string;
  isFree: boolean;
  duration: number | null;
  totalMarks: number | null;
  categoryId: string;
}

interface PYQFormData extends BaseExamFormData {
  examNameId: string;
  year: number;
}

interface LiveTestFormData extends BaseExamFormData {
  scheduledAt: string;
  examEndTime: string;
}

interface MockTestFormData extends BaseExamFormData {
  testSeriesId?: string;
}

type ExamFormData = PYQFormData | LiveTestFormData | MockTestFormData;

// Popularity order for sorting categories
const popularityOrder = [
  'ssc', 'railways', 'banking', 'defence', 'teaching', 
  'upsc', 'state-psc', 'police', 'insurance', 'judiciary', 'entrance'
];

export default function AdminExamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'exams' | 'categories' | 'add-pyq' | 'add-live' | 'add-mock'>('exams');
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [examNames, setExamNames] = useState<ExamName[]>([]);
  const [examYears, setExamYears] = useState<ExamYear[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('all');
  
  // Form states
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isEditingExam, setIsEditingExam] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user has admin/owner role
    // @ts-expect-error - NextAuth session type
    const userRole = session.user?.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      router.push('/dashboard');
      return;
    }
    
    fetchData();
  }, [session, status, router]);

  useEffect(() => {
    if (editingExam) {
      console.log('Edit modal opened for exam:', editingExam);
      const categoryId = getCurrentCategoryId(editingExam);
      console.log('Category ID found:', categoryId);
      if (categoryId) {
        console.log('Fetching exam names for category:', categoryId);
        fetchExamNames(categoryId);
      } else {
        console.log('No category ID found, clearing exam names');
        setExamNames([]);
      }
    }
  }, [editingExam]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, examsRes, testSeriesRes] = await Promise.all([
        fetch('/api/admin/exam-categories'),
        fetch('/api/admin/exams'),
        fetch('/api/admin/test-series')
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        // Sort categories by popularity order
        const sortedCategories = categoriesData.categories.sort((a: ExamCategory, b: ExamCategory) => {
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

      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(examsData.exams);
        setExamYears(examsData.examYears);
      }

      if (testSeriesRes.ok) {
        const testSeriesData = await testSeriesRes.json();
        setTestSeries(testSeriesData.testSeries);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExamNames = async (categoryId: string) => {
    if (!categoryId) {
      setExamNames([]);
      return;
    }
    
    console.log('Fetching exam names for categoryId:', categoryId);
    try {
      const response = await fetch(`/api/admin/exam-names/${categoryId}`);
      console.log('Exam names API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Exam names received:', data.examNames);
        setExamNames(data.examNames);
      } else {
        console.error('Failed to fetch exam names:', response.status);
      }
    } catch (error) {
      console.error('Error fetching exam names:', error);
    }
  };

  const handleAddExam = async (formData: ExamFormData) => {
    setIsAddingExam(true);

    try {
      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { exam } = await response.json();
        setExams([exam, ...exams]);
        setActiveTab('exams');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding exam:', error);
      alert('Failed to add exam');
    } finally {
      setIsAddingExam(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExams(exams.filter(e => e.id !== examId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam');
    }
  };

  const handleEditExam = async (examId: string, formData: Partial<ExamFormData>) => {
    setIsEditingExam(true);
    
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { exam } = await response.json();
        setExams(exams.map(e => e.id === examId ? exam : e));
        setEditingExam(null);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam');
    } finally {
      setIsEditingExam(false);
    }
  };

  const handleExamAccess = (exam: Exam) => {
    if (exam.examType === 'live') {
      const now = new Date();
      const examStart = exam.scheduledAt ? new Date(exam.scheduledAt) : null;
      const examEnd = exam.examEndTime ? new Date(exam.examEndTime) : null;

      if (examEnd && now > examEnd) {
        alert('⏰ This live test has ended. You can no longer access it.');
        return;
      }

      if (examStart && now < examStart) {
        alert(`⏰ This live test hasn't started yet. It will begin on ${examStart.toLocaleString()}`);
        return;
      }
    }

    // Open the exam URL
    window.open(exam.examUrl, '_blank');
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      (exam.examYear?.category.slug === selectedCategory) ||
      (exam.testSeries?.category.slug === selectedCategory);
    const matchesYear = !selectedYear || exam.examYear?.year.toString() === selectedYear;
    const matchesType = selectedExamType === 'all' || exam.examType === selectedExamType;
    return matchesSearch && matchesCategory && matchesYear && matchesType;
  });

  const availableYears = Array.from(new Set(examYears.map(ey => ey.year))).sort((a, b) => b - a);

  const getCurrentCategoryId = (exam: Exam) => {
    // First priority: examYear category (for PYQ and others)
    if (exam.examYear?.category) {
      const category = categories.find(cat => cat.slug === exam.examYear?.category.slug);
      return category?.id || '';
    }
    
    // Second priority: testSeries category (for mock tests)
    if (exam.testSeries?.category) {
      const category = categories.find(cat => cat.slug === exam.testSeries?.category.slug);
      return category?.id || '';
    }
    
    // Third priority: try to find category from yearId
    if (exam.yearId) {
      const examYear = examYears.find(ey => ey.id === exam.yearId);
      if (examYear?.category) {
        const category = categories.find(cat => cat.slug === examYear.category.slug);
        return category?.id || '';
      }
    }
    
    // Fourth priority: try to find category from testSeriesId
    if (exam.testSeriesId) {
      const series = testSeries.find(ts => ts.id === exam.testSeriesId);
      if (series?.category) {
        const category = categories.find(cat => cat.slug === series.category.slug);
        return category?.id || '';
      }
    }
    
    return '';
  };

  const getExamCategoryName = (exam: Exam) => {
    // First priority: examYear category (for PYQ and others)
    if (exam.examYear?.category) return exam.examYear.category.name;
    
    // Second priority: testSeries category (for mock tests)
    if (exam.testSeries?.category) return exam.testSeries.category.name;
    
    // Third priority: try to find category from yearId
    if (exam.yearId) {
      const examYear = examYears.find(ey => ey.id === exam.yearId);
      if (examYear?.category) return examYear.category.name;
    }
    
    // Fourth priority: try to find category from testSeriesId
    if (exam.testSeriesId) {
      const series = testSeries.find(ts => ts.id === exam.testSeriesId);
      if (series?.category) return series.category.name;
    }
    
    return 'Uncategorized';
  };

  const getExamNameDisplay = (exam: Exam) => {
    if (exam.examName) {
      return exam.examName.name;
    }
    // Fallback to exam type if no exam name is set
    if (exam.examType === 'pyq') {
      return 'PYQ';
    }
    if (exam.examType === 'mock') {
      return 'Mock Test';
    }
    if (exam.examType === 'live') {
      return 'Live Test';
    }
    return exam.examType.toUpperCase();
  };

  const getExamYearOrType = (exam: Exam) => {
    if (exam.examType === 'pyq' && exam.examYear) return exam.examYear.year.toString();
    if (exam.examType === 'live' && exam.scheduledAt) {
      const startDate = new Date(exam.scheduledAt);
      const endDate = exam.examEndTime ? new Date(exam.examEndTime) : null;
      const now = new Date();
      
      let status = '';
      if (endDate && now > endDate) {
        status = ' (Ended)';
      } else if (now < startDate) {
        status = ' (Upcoming)';
      } else {
        status = ' (Live)';
      }
      
      return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}${endDate ? ` - ${endDate.toLocaleTimeString()}` : ''}${status}`;
    }
    if (exam.examType === 'mock' && exam.testSeries) return `Series: ${exam.testSeries.name}`;
    return exam.examType.toUpperCase();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading exam management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
              <p className="text-gray-600 mt-1">Manage exam categories, years, and individual exams</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('exams')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'exams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Exams ({exams.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('add-pyq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-pyq'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add PYQ
              </button>
              <button
                onClick={() => setActiveTab('add-live')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-live'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add Live Test
              </button>
              <button
                onClick={() => setActiveTab('add-mock')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-mock'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add Mock Test
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'exams' && (
              <div>
                {/* Filters */}
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Search exams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Years</option>
                      {availableYears.map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('add-pyq')}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Add PYQ
                      </button>
                      <button
                        onClick={() => setActiveTab('add-live')}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Add Live
                      </button>
                      <button
                        onClick={() => setActiveTab('add-mock')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Add Mock
                      </button>
                    </div>
                  </div>
                  
                  {/* Exam Type Filter */}
                  <ExamTypeFilter 
                    selectedType={selectedExamType} 
                    onTypeChange={setSelectedExamType} 
                  />
                </div>

                {/* Exams List */}
                <div className="space-y-4">
                  {filteredExams.map(exam => (
                    <div key={exam.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              exam.examType === 'mock' ? 'bg-blue-100 text-blue-800' :
                              exam.examType === 'pyq' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {getExamNameDisplay(exam)}
                            </span>
                            {exam.isFree && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                FREE
                              </span>
                            )}
                            {!exam.isActive && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                INACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {getExamCategoryName(exam)} • {getExamYearOrType(exam)} • Exam: {getExamNameDisplay(exam)}
                          </p>
                          {exam.description && (
                            <p className="text-sm text-gray-700 mb-2">{exam.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {exam.duration && <span>Duration: {exam.duration} mins</span>}
                            {exam.totalMarks && <span>Marks: {exam.totalMarks}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setEditingExam(exam)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleExamAccess(exam)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            {exam.examType === 'live' ? 'Access Live Test' : 'View Exam'}
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredExams.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No exams found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(category => (
                    <div key={category.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description || 'No description available'}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{category._count.examYears} years</span>
                        <span className={`px-2 py-1 rounded-full ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'add-pyq' && (
              <AddPYQForm
                categories={categories}
                examNames={examNames}
                onSubmit={handleAddExam}
                onCategoryChange={fetchExamNames}
                isSubmitting={isAddingExam}
              />
            )}

            {activeTab === 'add-live' && (
              <AddLiveTestForm
                categories={categories}
                onSubmit={handleAddExam}
                isSubmitting={isAddingExam}
              />
            )}

            {activeTab === 'add-mock' && (
              <AddMockTestForm
                categories={categories}
                onSubmit={handleAddExam}
                isSubmitting={isAddingExam}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Exam Modal */}
      {editingExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Exam</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedData = {
                title: formData.get('title') as string,
                examUrl: formData.get('examUrl') as string,
                duration: parseInt(formData.get('duration') as string) || null,
                totalMarks: parseInt(formData.get('totalMarks') as string) || null,
                isFree: formData.get('isFree') === 'on',
                isActive: formData.get('isActive') === 'on',
                categoryId: formData.get('categoryId') as string,
                examNameId: formData.get('examNameId') as string || null,
                // Preserve exam type and yearId to prevent exams from disappearing
                examType: editingExam.examType,
                yearId: editingExam.yearId,
                // For live tests, include scheduling data
                ...(editingExam.examType === 'live' && {
                  scheduledAt: formData.get('scheduledDate') && formData.get('scheduledTime') 
                    ? `${formData.get('scheduledDate')}T${formData.get('scheduledTime')}` 
                    : editingExam.scheduledAt,
                  examEndTime: formData.get('endDate') && formData.get('endTime')
                    ? `${formData.get('endDate')}T${formData.get('endTime')}`
                    : editingExam.examEndTime
                })
              };
              handleEditExam(editingExam.id, updatedData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingExam.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                  <input
                    type="text"
                    value={editingExam.examType.toUpperCase()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Exam type cannot be changed after creation</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="categoryId"
                    defaultValue={getCurrentCategoryId(editingExam)}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      if (categoryId) {
                        fetchExamNames(categoryId);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {(editingExam.examType === 'pyq' || editingExam.examType === 'live' || editingExam.examType === 'mock') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Name {editingExam.examType === 'pyq' ? '(Optional)' : ''}
                    </label>
                    <select
                      name="examNameId"
                      defaultValue={editingExam.examName?.id || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Exam Name</option>
                      {examNames.map(name => (
                        <option key={name.id} value={name.id}>
                          {name.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam URL</label>
                  <input
                    type="url"
                    name="examUrl"
                    defaultValue={editingExam.examUrl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Live Test Scheduling Fields */}
                {editingExam.examType === 'live' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="scheduledDate"
                          defaultValue={editingExam.scheduledAt ? new Date(editingExam.scheduledAt).toISOString().split('T')[0] : ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          name="scheduledTime"
                          defaultValue={editingExam.scheduledAt ? new Date(editingExam.scheduledAt).toTimeString().slice(0, 5) : ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          defaultValue={editingExam.examEndTime ? new Date(editingExam.examEndTime).toISOString().split('T')[0] : ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          defaultValue={editingExam.examEndTime ? new Date(editingExam.examEndTime).toTimeString().slice(0, 5) : ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      name="duration"
                      defaultValue={editingExam.duration || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      name="totalMarks"
                      defaultValue={editingExam.totalMarks || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFree"
                      defaultChecked={editingExam.isFree}
                      className="mr-2"
                    />
                    Free Access
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={editingExam.isActive}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditingExam}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isEditingExam ? 'Updating...' : 'Update Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 