'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

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
  subject?: string
  marks: number
  sectionId?: string
  debug?: string // Debug information from the parser
}

interface Section {
  id: string
  name: string
  order: number
  duration?: number
  totalMarks?: number
}

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
  createdAt: string
  updatedAt: string
  category?: {
    name: string
  }
  sections: Section[]
  questions: Question[]
}

interface DebugInfo {
  mockTest: {
    id: string;
    title: string;
    questionsCount: number;
    sectionsCount: number;
  };
  parsedQuestions: Question[];
  parsedQuestionsCount: number;
  success: boolean;
  error?: string;
}

export default function MockTestViewPage() {
  const params = useParams()
  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchMockTest(params.id as string)
    }
  }, [params.id])

  const fetchMockTest = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/mock-tests/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch mock test')
      }
      const data = await response.json()
      setMockTest(data)
    } catch (error) {
      console.error('Error fetching mock test:', error)
      setError('Failed to load mock test details')
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = async () => {
    if (!mockTest || isDeleting) return
    
    if (confirm('Are you sure you want to delete this mock test? This action cannot be undone.')) {
      try {
        setIsDeleting(true)
        console.log('Deleting mock test:', mockTest.id)
        
        // Direct fetch with no-cache to ensure fresh request
        const response = await fetch(`/api/mock-tests/${mockTest.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        })
        
        console.log('Delete response status:', response.status)
        
        // Try to parse the response as JSON
        let data
        try {
          data = await response.json()
          console.log('Delete response data:', data)
        } catch (parseError) {
          console.error('Error parsing response:', parseError)
        }
        
        if (response.ok) {
          console.log('Mock test deleted successfully')
          // Force a hard navigation to the mock tests list
          window.location.href = '/dashboard/mock-tests'
        } else {
          console.error('Failed to delete mock test:', data?.error || response.statusText)
          setError(data?.error || 'Failed to delete mock test')
          setIsDeleting(false)
        }
      } catch (error) {
        console.error('Error deleting mock test:', error)
        setError('Failed to delete mock test')
        setIsDeleting(false)
      }
    }
  }

  const handleDebug = async () => {
    if (!mockTest) return
    
    try {
      setIsDebugging(true)
      const response = await fetch(`/api/debug?mockTestId=${mockTest.id}`)
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error debugging mock test:', error)
    } finally {
      setIsDebugging(false)
    }
  }

  // Group questions by section
  const getQuestionsBySection = () => {
    if (!mockTest) return {};
    
    const questionsBySection: Record<string, Question[]> = {};
    
    // First, organize questions by section
    if (mockTest.sections && mockTest.sections.length > 0) {
      // Initialize sections
      mockTest.sections.forEach(section => {
        questionsBySection[section.id] = [];
      });
      
      // Add questions to their sections
      mockTest.questions.forEach(question => {
        if (question.sectionId) {
          if (!questionsBySection[question.sectionId]) {
            questionsBySection[question.sectionId] = [];
          }
          questionsBySection[question.sectionId].push(question);
        }
      });
      
      // Check for questions without sections
      const unsectionedQuestions = mockTest.questions.filter(q => !q.sectionId);
      if (unsectionedQuestions.length > 0) {
        questionsBySection['unsectioned'] = unsectionedQuestions;
      }
    } else {
      // If no sections, group by subject if available
      const subjects = new Set<string>();
      mockTest.questions.forEach(q => {
        if (q.subject) subjects.add(q.subject);
      });
      
      if (subjects.size > 1) {
        // Group by subject
        subjects.forEach(subject => {
          questionsBySection[subject] = mockTest.questions.filter(q => q.subject === subject);
        });
        
        // Add questions without subject
        const noSubjectQuestions = mockTest.questions.filter(q => !q.subject);
        if (noSubjectQuestions.length > 0) {
          questionsBySection['General'] = noSubjectQuestions;
        }
      } else {
        // No meaningful grouping, put all in one section
        questionsBySection['all'] = mockTest.questions;
      }
    }
    
    return questionsBySection;
  };
  
  const getSectionName = (sectionId: string) => {
    if (sectionId === 'unsectioned') return 'Unsectioned Questions';
    if (sectionId === 'all') return 'All Questions';
    if (mockTest && mockTest.sections) {
      const section = mockTest.sections.find(s => s.id === sectionId);
      return section ? section.name : sectionId;
    }
    return sectionId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !mockTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Mock test not found'}</h2>
        <p className="text-gray-600 mb-6">We could not find the mock test you&apos;re looking for.</p>
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
            <Link href="/dashboard/mock-tests" className="p-2 hover:bg-gray-100 rounded-md">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{mockTest?.title}</h2>
              <p className="text-gray-600">
                {mockTest?.category?.name || 'Uncategorized'} • {mockTest?.questions?.length || 0} questions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDebug}
                disabled={isDebugging}
                className="btn-secondary px-4 py-2"
              >
                {isDebugging ? 'Debugging...' : 'Debug Questions'}
              </button>
              <Link 
                href={`/dashboard/mock-tests/${mockTest?.id}/edit`}
                className="btn-secondary px-4 py-2"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button 
                onClick={() => {
                  // Test the API directly
                  console.log('Testing API endpoint');
                  fetch(`/api/mock-tests/${mockTest?.id}`, { method: 'GET' })
                    .then(res => res.json())
                    .then(data => console.log('API test result:', data))
                    .catch(err => console.error('API test error:', err));
                }}
                className="btn-secondary px-4 py-2"
              >
                Test API
              </button>
              <Link 
                href={`/dashboard/mock-tests/test-delete?id=${mockTest?.id}`}
                className="btn-secondary px-4 py-2"
              >
                Test Delete
              </Link>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className={`btn-danger px-4 py-2 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Debug Info */}
        {debugInfo && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p>Parsed Questions: {debugInfo.parsedQuestionsCount}</p>
              <p>Database Questions: {debugInfo.mockTest.questionsCount}</p>
              <p>Status: {debugInfo.success ? 'Success' : 'Failed'}</p>
              {debugInfo.error && (
                <p className="text-red-500">Error: {debugInfo.error}</p>
              )}
              {debugInfo.parsedQuestionsCount > 0 && (
                <div className="mt-4">
                  <p className="font-medium">First Question:</p>
                  <pre className="bg-gray-800 text-white p-3 rounded-md mt-2 overflow-auto text-xs">
                    {JSON.stringify(debugInfo.parsedQuestions[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mock Test Details */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Test Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium">{mockTest?.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Marks</p>
              <p className="font-medium">{mockTest?.totalMarks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Negative Marking</p>
              <p className="font-medium">{mockTest?.negativeMarking || 'None'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                mockTest?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {mockTest?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Access</p>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                mockTest?.isFree ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {mockTest?.isFree ? 'Free' : 'Premium'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-medium">{mockTest?.createdAt ? formatDate(mockTest.createdAt) : ''}</p>
            </div>
          </div>

          {mockTest?.description && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{mockTest.description}</p>
            </div>
          )}

          {mockTest?.instructions && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Instructions</p>
              <p className="text-gray-700">{mockTest.instructions}</p>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Questions ({mockTest?.questions?.length || 0})</h3>

          {mockTest && mockTest.questions && mockTest.questions.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(getQuestionsBySection()).map(([sectionId, questions]) => (
                <div key={sectionId} className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3 pb-2 border-b">
                    {getSectionName(sectionId)} ({questions.length} questions)
                  </h4>
                  <div className="space-y-4">
                    {questions.map(question => (
                      <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                          onClick={() => toggleQuestion(question.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                              {question.questionNumber}
                            </span>
                            <div className="font-medium text-gray-900">{question.questionText}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{question.marks} marks</span>
                            {expandedQuestions[question.id] ? (
                              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedQuestions[question.id] && (
                          <div className="p-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className={`p-3 rounded-md ${question.correctOption === 'A' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                <span className="font-medium mr-2">A.</span> {question.optionA}
                                {question.correctOption === 'A' && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 inline ml-2" />
                                )}
                              </div>
                              <div className={`p-3 rounded-md ${question.correctOption === 'B' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                <span className="font-medium mr-2">B.</span> {question.optionB}
                                {question.correctOption === 'B' && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 inline ml-2" />
                                )}
                              </div>
                              <div className={`p-3 rounded-md ${question.correctOption === 'C' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                <span className="font-medium mr-2">C.</span> {question.optionC}
                                {question.correctOption === 'C' && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 inline ml-2" />
                                )}
                              </div>
                              <div className={`p-3 rounded-md ${question.correctOption === 'D' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                <span className="font-medium mr-2">D.</span> {question.optionD}
                                {question.correctOption === 'D' && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 inline ml-2" />
                                )}
                              </div>
                            </div>
                            
                            {question.explanation && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                                <p className="text-sm font-medium text-blue-700 mb-1">Explanation:</p>
                                <p className="text-sm text-blue-800">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions found for this test.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 