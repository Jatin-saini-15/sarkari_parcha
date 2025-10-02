'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  questionNumber: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  explanation?: string
  marks: number
}

interface MockTest {
  id: string
  title: string
  slug: string
  duration: number
  totalMarks: number
  isActive: boolean
  isFree: boolean
  category: { name: string }
  examName?: { name: string }
  questions: Question[]
  createdAt: string
}

export default function TestDetailPage() {
  const params = useParams()
  const testId = params.id as string
  const [test, setTest] = useState<MockTest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (testId) {
      loadTest()
    }
  }, [testId])

  const loadTest = async () => {
    try {
      const response = await fetch(`/api/mock-test/${testId}`)
      const data = await response.json()
      
      if (response.ok) {
        setTest(data.mockTest)
      } else {
        console.error('Error loading test:', data.error)
      }
    } catch (error) {
      console.error('Error loading test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test details...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
          <Link href="/admin/studio/dashboard" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">{test.category.name}</p>
              {test.examName && <p className="text-gray-600">{test.examName.name}</p>}
            </div>
            <div className="flex gap-3">
              <Link
                href={`/test/${test.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Take Test
              </Link>
              <Link
                href="/admin/studio/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-blue-600">{test.questions.length}</div>
              <div className="text-gray-600">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{test.duration}</div>
              <div className="text-gray-600">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{test.totalMarks}</div>
              <div className="text-gray-600">Total Marks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{test.isFree ? 'Free' : 'Premium'}</div>
              <div className="text-gray-600">Type</div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {test.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-sm text-gray-500">
              Created: {new Date(test.createdAt).toLocaleDateString()}
            </span>
            <span className="text-sm text-gray-500">
              Slug: {test.slug}
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Questions ({test.questions.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {test.questions.map((question, index) => (
              <div key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Question {question.questionNumber}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Marks: {question.marks}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {question.correctOption}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-800">{question.questionText}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg border ${question.correctOption === 'A' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-medium">A) </span>{question.optionA}
                  </div>
                  <div className={`p-3 rounded-lg border ${question.correctOption === 'B' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-medium">B) </span>{question.optionB}
                  </div>
                  <div className={`p-3 rounded-lg border ${question.correctOption === 'C' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-medium">C) </span>{question.optionC}
                  </div>
                  <div className={`p-3 rounded-lg border ${question.correctOption === 'D' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-medium">D) </span>{question.optionD}
                  </div>
                </div>
                
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

