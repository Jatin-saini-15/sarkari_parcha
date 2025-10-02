'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface MockTest {
  id: string
  title: string
  description?: string
  categoryId: string
  duration: number
  totalMarks: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category?: {
    name: string
  }
}

export default function MockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})

  const categories = ['all', 'SSC', 'Banking', 'Railways', 'UPSC', 'State PSC', 'Teaching', 'Defence', 'Police']

  useEffect(() => {
    fetchMockTests()
  }, [])

  const fetchMockTests = async () => {
    try {
      const response = await fetch('/api/mock-tests')
      if (response.ok) {
        const data = await response.json()
        setMockTests(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching mock tests:', error)
      setMockTests([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTests = Array.isArray(mockTests) 
    ? mockTests.filter(test => 
        selectedCategory === 'all' || 
        (test.category?.name === selectedCategory || test.categoryId === selectedCategory)
      )
    : []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = async (testId: string) => {
    if (isDeleting[testId]) return;
    
    if (confirm('Are you sure you want to delete this mock test? This action cannot be undone.')) {
      try {
        setIsDeleting(prev => ({ ...prev, [testId]: true }));
        console.log('Deleting mock test:', testId);
        
        const response = await fetch(`/api/mock-tests/${testId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        });
        
        console.log('Delete response status:', response.status);
        
        if (response.ok) {
          console.log('Mock test deleted successfully');
          // Remove the deleted test from the state
          setMockTests(prev => prev.filter(test => test.id !== testId));
        } else {
          console.error('Failed to delete mock test');
          alert('Failed to delete mock test. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting mock test:', error);
        alert('An error occurred while deleting the mock test.');
      } finally {
        setIsDeleting(prev => ({ ...prev, [testId]: false }));
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Same as dashboard */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Sarkari Parcha</h1>
              <p className="text-xs text-gray-500">CMS Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 pb-4">
          <div className="sidebar-nav">
            <Link href="/dashboard" className="sidebar-nav-item">
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/mock-tests" className="sidebar-nav-item active">
              <DocumentTextIcon className="w-5 h-5" />
              <span>Mock Tests</span>
            </Link>
            <Link href="/dashboard/questions" className="sidebar-nav-item">
              <AcademicCapIcon className="w-5 h-5" />
              <span>Questions</span>
            </Link>
            <Link href="/dashboard/users" className="sidebar-nav-item">
              <UserGroupIcon className="w-5 h-5" />
              <span>Users</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mock Tests</h2>
                <p className="text-gray-600">Manage your mock test collection</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/dashboard/mock-tests/upload" className="btn-primary px-4 py-2">
                  <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                  Upload Mock Test
                </Link>
                <Link href="/dashboard/mock-tests/new" className="btn-secondary px-4 py-2">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Mock Tests Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mock tests found</h3>
              <p className="text-gray-600 mb-4">Get started by uploading your first mock test</p>
              <Link href="/dashboard/mock-tests/upload" className="btn-primary px-6 py-3">
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Upload Mock Test
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div key={test.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.category?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{test.description || "No description"}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium">{test.duration} min</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Marks:</span>
                      <span className="ml-1 font-medium">{test.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-1 font-medium">{formatDate(test.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>
                      <span className="ml-1 font-medium">{formatDate(test.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Link 
                      href={`/dashboard/mock-tests/${test.id}`}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/mock-tests/${test.id}/edit`}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(test.id)}
                      disabled={isDeleting[test.id]}
                      className={`flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors ${
                        isDeleting[test.id] ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <TrashIcon className="w-4 h-4" />
                      {isDeleting[test.id] ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}