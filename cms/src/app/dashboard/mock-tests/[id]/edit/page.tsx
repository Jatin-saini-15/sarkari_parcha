'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface MockTest {
  id: string
  title: string
  description?: string
  instructions?: string
  duration: number
  totalMarks: number
  negativeMarking?: number
  isActive: boolean
  isFree: boolean
  categoryId: string
  category?: {
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditMockTestPage() {
  const params = useParams()
  const router = useRouter()
  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      Promise.all([
        fetchMockTest(params.id as string),
        fetchCategories()
      ])
    }
  }, [params.id])

  const fetchMockTest = async (id: string) => {
    try {
      const response = await fetch(`/api/mock-tests/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch mock test')
      }
      const data = await response.json()
      setMockTest(data)
      return data
    } catch (error) {
      console.error('Error fetching mock test:', error)
      setError('Failed to load mock test details')
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        return data
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    setMockTest(prev => {
      if (!prev) return prev
      
      return {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : type === 'number' 
            ? parseFloat(value) 
            : value
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mockTest) return
    
    try {
      setSaving(true)
      setError('')
      
      const response = await fetch(`/api/mock-tests/${mockTest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...mockTest,
          slug: mockTest.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        })
      })
      
      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard/mock-tests/${mockTest.id}`)
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update mock test')
      }
    } catch (error) {
      console.error('Error updating mock test:', error)
      setError('Failed to update mock test. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !mockTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
        <p className="text-gray-600 mb-6">We could not load the mock test for editing.</p>
        <Link href="/dashboard/mock-tests" className="btn-primary px-6 py-3">
          Back to Mock Tests
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/mock-tests/${params.id}`} className="p-2 hover:bg-gray-100 rounded-md">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Mock Test</h2>
              <p className="text-gray-600">Update mock test details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {success ? (
          <div className="card text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Changes Saved!</h3>
            <p className="text-gray-600 mb-4">Your mock test has been updated successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={mockTest?.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter test name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={mockTest?.categoryId || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={mockTest?.duration || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={mockTest?.totalMarks || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Negative Marking
                  </label>
                  <input
                    type="number"
                    name="negativeMarking"
                    value={mockTest?.negativeMarking || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={mockTest?.isActive || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={mockTest?.isFree || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                      Free Access
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Instructions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Content</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={mockTest?.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter test description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={mockTest?.instructions || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={5}
                    placeholder="Enter test instructions for students"
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center p-4 text-red-700 border border-red-300 rounded-md bg-red-50">
                <XCircleIcon className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex justify-end gap-4">
              <Link 
                href={`/dashboard/mock-tests/${params.id}`}
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`btn-primary px-6 py-3 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
} 