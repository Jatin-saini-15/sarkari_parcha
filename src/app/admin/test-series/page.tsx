'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface TestSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isFree: boolean;
  isActive: boolean;
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    exams: number;
  };
}

interface TestSeriesFormData {
  name: string;
  description: string;
  categoryId: string;
  isFree: boolean;
}

interface Exam {
  id: string;
  title: string;
  examType: string;
  testSeriesId?: string;
  examYear?: {
    category: {
      slug: string;
    };
  };
}

export default function AdminTestSeriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSeries, setEditingSeries] = useState<TestSeries | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTestsModal, setShowAddTestsModal] = useState(false);
  const [selectedSeriesForTests, setSelectedSeriesForTests] = useState<TestSeries | null>(null);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [isAddingTests, setIsAddingTests] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, testSeriesRes] = await Promise.all([
        fetch('/api/admin/exam-categories'),
        fetch('/api/admin/test-series')
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories);
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

  const handleCreateTestSeries = async (formData: TestSeriesFormData) => {
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/admin/test-series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { testSeries: newTestSeries } = await response.json();
        setTestSeries([newTestSeries, ...testSeries]);
        setShowCreateModal(false);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating test series:', error);
      alert('Failed to create test series');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTestSeries = async (seriesId: string, formData: Partial<TestSeriesFormData>) => {
    setIsEditing(true);
    
    try {
      const response = await fetch(`/api/admin/test-series/${seriesId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { testSeries: updatedSeries } = await response.json();
        setTestSeries(testSeries.map(ts => ts.id === seriesId ? updatedSeries : ts));
        setEditingSeries(null);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating test series:', error);
      alert('Failed to update test series');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteTestSeries = async (seriesId: string) => {
    if (!confirm('Are you sure you want to delete this test series? This will also remove all associated exams.')) return;

    try {
      const response = await fetch(`/api/admin/test-series/${seriesId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestSeries(testSeries.filter(ts => ts.id !== seriesId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting test series:', error);
      alert('Failed to delete test series');
    }
  };

  const handleAddTestsToSeries = async (series: TestSeries) => {
    setSelectedSeriesForTests(series);
    setShowAddTestsModal(true);
    
    // Fetch all mock exams for this category
    try {
      const response = await fetch('/api/admin/exams');
      if (response.ok) {
        const data = await response.json();
        const categoryExams = data.exams.filter((exam: Exam) => 
          exam.examType === 'mock' && 
          (exam.examYear?.category?.slug === series.category.slug)
        );
        setAvailableExams(categoryExams);
        
        // Pre-select exams that are already in this test series
        const alreadySelected = categoryExams
          .filter((exam: Exam) => exam.testSeriesId === series.id)
          .map((exam: Exam) => exam.id);
        setSelectedExams(alreadySelected);
      }
    } catch (error) {
      console.error('Error fetching available exams:', error);
    }
  };

  const handleAddSelectedTests = async () => {
    if (!selectedSeriesForTests || selectedExams.length === 0) return;

    setIsAddingTests(true);
    try {
      const response = await fetch('/api/admin/test-series/add-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testSeriesId: selectedSeriesForTests.id,
          examIds: selectedExams,
        }),
      });

      if (response.ok) {
        setShowAddTestsModal(false);
        setSelectedExams([]);
        setSelectedSeriesForTests(null);
        fetchData(); // Refresh data
        alert('Tests added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding tests to series:', error);
      alert('Failed to add tests to series');
    } finally {
      setIsAddingTests(false);
    }
  };

  const filteredTestSeries = testSeries.filter(series => {
    const matchesSearch = series.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || series.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading test series management...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Test Series Management</h1>
              <p className="text-gray-600 mt-1">Create and manage test series with multiple mock tests</p>
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
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Search test series..."
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
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              + Create Test Series
            </button>
          </div>
        </div>

        {/* Test Series List */}
        <div className="space-y-4">
          {filteredTestSeries.map(series => (
            <div key={series.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{series.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      series.isFree ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {series.isFree ? 'FREE' : 'PREMIUM'}
                    </span>
                    {!series.isActive && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {series.category.name} • {series._count.exams} tests
                  </p>
                  {series.description && (
                    <p className="text-sm text-gray-700 mb-2">{series.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setEditingSeries(series)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAddTestsToSeries(series)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Add Tests
                  </button>
                  <Link
                    href={`/test-series/${series.category.slug}/${series.slug}`}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    View Tests
                  </Link>
                  <button
                    onClick={() => handleDeleteTestSeries(series.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredTestSeries.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No test series found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Test Series Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Test Series</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                categoryId: formData.get('categoryId') as string,
                isFree: formData.get('isFree') === 'on',
              };
              handleCreateTestSeries(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="categoryId"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFree"
                      className="mr-2"
                    />
                    Free Access
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Test Series Modal */}
      {editingSeries && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Test Series</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                categoryId: formData.get('categoryId') as string,
                isFree: formData.get('isFree') === 'on',
              };
              handleEditTestSeries(editingSeries.id, data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingSeries.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="categoryId"
                    defaultValue={editingSeries.categoryId}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingSeries.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFree"
                      defaultChecked={editingSeries.isFree}
                      className="mr-2"
                    />
                    Free Access
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isEditing ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tests Modal */}
      {showAddTestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              Add Tests to &quot;{selectedSeriesForTests?.name}&quot;
            </h3>
            {availableExams.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select mock tests to add to this test series. Tests already in this series are pre-selected.
                </p>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {availableExams.map(exam => {
                    const isInCurrentSeries = exam.testSeriesId === selectedSeriesForTests?.id;
                    const isInOtherSeries = exam.testSeriesId && exam.testSeriesId !== selectedSeriesForTests?.id;
                    
                    return (
                      <label key={exam.id} className={`flex items-center space-x-3 p-2 hover:bg-gray-50 rounded ${isInOtherSeries ? 'opacity-60' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedExams.includes(exam.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExams([...selectedExams, exam.id]);
                            } else {
                              setSelectedExams(selectedExams.filter(id => id !== exam.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-900">{exam.title}</span>
                          {isInCurrentSeries && (
                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              In this series
                            </span>
                          )}
                          {isInOtherSeries && (
                            <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              In other series
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedExams.length} test(s) selected
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No available mock tests found for this category.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Create mock tests in the Exam Management section first.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddTestsModal(false);
                  setSelectedExams([]);
                  setSelectedSeriesForTests(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSelectedTests}
                disabled={isAddingTests || selectedExams.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingTests ? 'Updating...' : `Update Series (${selectedExams.length} test(s))`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 