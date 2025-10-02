'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

interface Question {
  id: string
  questionNumber: number
  questionText: string
  questionImage?: string
  optionA: string
  optionAImage?: string
  optionB: string
  optionBImage?: string
  optionC: string
  optionCImage?: string
  optionD: string
  optionDImage?: string
  subject?: string
  difficulty?: string
  marks: number
}

interface MockTest {
  id: string
  title: string
  duration: number
  totalMarks: number
  isActive: boolean
  isFree: boolean
  category: { name: string }
  examName?: { name: string }
  questions: Question[]
}

interface QuestionResponse {
  questionId: string
  selectedOption: string | null
  timeTaken: number
  isMarkedForReview: boolean
}

export default function TestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const testId = params.testId as string

  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [timeLeft, setTimeLeft] = useState(0)

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  
  // Window switching detection
  const [windowSwitchCount, setWindowSwitchCount] = useState(0)
  const [showWindowWarning, setShowWindowWarning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-submit function
  const handleAutoSubmit = useCallback(async (reason = 'Time is up') => {
    if (isSubmitting || !attemptId) return
    setIsSubmitting(true)
    
    try {
      // Clear saved state
      localStorage.removeItem(`test_${testId}`)
      
      const response = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          action: 'submit',
          responses,
          isCompleted: true,
          isAutoSubmit: true,
          reason
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        router.push(`/test-results/${data.attemptId}`)
      } else {
        console.error('Error auto-submitting test:', data.error)
        // Don't show alert for auto-submit errors, just log them
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error auto-submitting test:', error)
      // Don't show alert for auto-submit errors, just log them
      setIsSubmitting(false)
    }
  }, [isSubmitting, attemptId, testId, responses, router])

  // Check existing attempt function
  const checkExistingAttempt = useCallback(async (mockTestId: string) => {
    try {
      const response = await fetch(`/api/test-attempt?mockTestId=${mockTestId}`)
      const data = await response.json()
      
      if (data.attempt && !data.attempt.isCompleted) {
        // Check if there's a saved state in localStorage
        const savedState = localStorage.getItem(`test_${testId}`)
        if (savedState) {
          // Will be handled by the restore state effect
          return
        }
        
        // Set attempt ID for potential resumption
        setAttemptId(data.attempt.id)
      }
    } catch (error) {
      console.error('Error checking existing attempt:', error)
    }
  }, [testId])

  // Fetch mock test function
  const fetchMockTest = useCallback(async () => {
    try {
      const response = await fetch(`/api/mock-test/${testId}`)
      const data = await response.json()
      
      if (response.ok) {
        setMockTest(data.mockTest)
        setTimeLeft(data.mockTest.duration * 60) // Convert minutes to seconds
        
        // Initialize responses array
        const initialResponses: QuestionResponse[] = data.mockTest.questions.map((q: Question) => ({
          questionId: q.id,
          selectedOption: null,
          timeTaken: 0,
          isMarkedForReview: false
        }))
        setResponses(initialResponses)
        
        // Check if user has already started this test
        checkExistingAttempt(data.mockTest.id)
      } else {
        alert('Test not found or not accessible')
        router.push('/mock-tests')
      }
    } catch (error) {
      console.error('Error fetching mock test:', error)
      alert('Error loading test')
      router.push('/mock-tests')
    } finally {
      setIsLoading(false)
    }
  }, [testId, router, checkExistingAttempt])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
    }
  }, [status, router])

  useEffect(() => {
    if (session && testId) {
      fetchMockTest()
    }
  }, [session, testId, fetchMockTest])

  // Timer effect
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isSubmitting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStarted, timeLeft, isSubmitting, handleAutoSubmit])

  // Window switching detection
  useEffect(() => {
    if (!isStarted) return

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting) {
        setWindowSwitchCount(prev => {
          const newCount = prev + 1
          if (newCount >= 3) {
            // Auto-submit on 3rd switch
            handleAutoSubmit('Window switching limit exceeded')
          } else {
            // Show warning
            setShowWindowWarning(true)
            setTimeout(() => setShowWindowWarning(false), 5000)
          }
          return newCount
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isStarted, isSubmitting, handleAutoSubmit])

  // Prevent tab closure during test
  useEffect(() => {
    if (!isStarted || isSubmitting) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'You have an ongoing test. Are you sure you want to leave? Your progress will be lost.'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isStarted, isSubmitting])

  // Save state to localStorage
  useEffect(() => {
    if (isStarted && attemptId) {
      const testState = {
        attemptId,
        responses,
        timeLeft,
        currentQuestion,
        windowSwitchCount,
        timestamp: Date.now()
      }
      localStorage.setItem(`test_${testId}`, JSON.stringify(testState))
    }
  }, [isStarted, attemptId, responses, timeLeft, currentQuestion, windowSwitchCount, testId])

  // Restore state from localStorage (only once when test loads)
  useEffect(() => {
    if (mockTest && !isStarted && !attemptId) {
      const savedState = localStorage.getItem(`test_${testId}`)
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          const timeDiff = Math.floor((Date.now() - state.timestamp) / 1000)
          const adjustedTimeLeft = Math.max(0, state.timeLeft - timeDiff)
          
          if (adjustedTimeLeft > 0) {
            setAttemptId(state.attemptId)
            setResponses(state.responses)
            setTimeLeft(adjustedTimeLeft)
            setCurrentQuestion(state.currentQuestion)
            setWindowSwitchCount(state.windowSwitchCount)
            setIsStarted(true)
          } else {
            // Time expired while away
            localStorage.removeItem(`test_${testId}`)
            handleAutoSubmit('Time expired')
          }
        } catch (error) {
          console.error('Error restoring test state:', error)
          localStorage.removeItem(`test_${testId}`)
        }
      }
    }
  }, [mockTest, testId, isStarted, attemptId, handleAutoSubmit])



  const handleStartTest = async () => {
    try {
      const response = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: mockTest!.id,
          action: 'start',
          responses: []
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        setAttemptId(data.attemptId)
        setIsStarted(true)
      } else {
        alert('Error starting test: ' + data.error)
      }
    } catch (error) {
      console.error('Error starting test:', error)
      alert('Error starting test')
    }
  }

  const handleAnswerSelect = (questionId: string, option: string) => {
    setResponses(prev => prev.map(r => 
      r.questionId === questionId 
        ? { ...r, selectedOption: option }
        : r
    ))
  }

  const handleMarkForReview = (questionId: string) => {
    setResponses(prev => prev.map(r => 
      r.questionId === questionId 
        ? { ...r, isMarkedForReview: !r.isMarkedForReview }
        : r
    ))
  }

  const handleSubmitTest = async (isAutoSubmit = false, reason = '') => {
    if (!attemptId || isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // Clear saved state
      localStorage.removeItem(`test_${testId}`)
      
      const response = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          action: 'submit',
          responses,
          isCompleted: true,
          isAutoSubmit,
          reason
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        router.push(`/test-results/${data.attemptId}`)
      } else {
        alert('Error submitting test: ' + data.error)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Error submitting test')
      setIsSubmitting(false)
    }
  }



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} : ${secs.toString().padStart(2, '0')}`
  }

  const getQuestionStatus = (questionId: string) => {
    const response = responses.find(r => r.questionId === questionId)
    if (response?.isMarkedForReview) return 'review'
    if (response?.selectedOption) return 'answered'
    return 'not-answered'
  }

  const getAnsweredCount = () => responses.filter(r => r.selectedOption && !r.isMarkedForReview).length
  const getNotAnsweredCount = () => responses.filter(r => !r.selectedOption && !r.isMarkedForReview).length
  const getMarkedForReviewCount = () => responses.filter(r => r.isMarkedForReview).length

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  if (!mockTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockTest.title}</h1>
            <p className="text-gray-600">{mockTest.category.name}</p>
            {mockTest.examName && <p className="text-gray-600">{mockTest.examName.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{mockTest.questions.length}</div>
              <div className="text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{mockTest.duration}</div>
              <div className="text-gray-600">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{mockTest.totalMarks}</div>
              <div className="text-gray-600">Total Marks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockTest.isFree ? 'Free' : 'Premium'}</div>
              <div className="text-gray-600">Type</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• This is a timed test. You have {mockTest.duration} minutes to complete.</li>
              <li>• Once started, the timer cannot be paused.</li>
              <li>• You can mark questions for review and come back to them.</li>
              <li>• Make sure you have a stable internet connection.</li>
              <li>• Do not refresh the page during the test.</li>
            </ul>
          </div>
          
          <button
            onClick={handleStartTest}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Test
          </button>
        </div>
      </div>
    )
  }

  const currentQ = mockTest.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📝</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ONLINE MOCK TEST</h1>
                  <p className="text-sm text-gray-600">Roll No: {session.user?.email?.split('@')[0]} [Candidate]</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                  Time Left: {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-gray-500">
                  {timeLeft < 900 ? 'Last 15 Minutes' : 'Keep Going!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Question Navigation */}
          <div className="col-span-3 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              {/* Subject Tabs */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                    PART-A
                  </button>
                  <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                    PART-B
                  </button>
                  <button className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                    PART-C
                  </button>
                  <button className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                    PART-D
                  </button>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-800">General English</div>
                    <div className="text-sm text-gray-600">Section A</div>
                  </div>
                </div>
              </div>

              {/* Question Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {mockTest.questions.map((q, index) => {
                    const status = getQuestionStatus(q.id)
                    const isActive = index === currentQuestion
                    
                    let bgColor = 'bg-gray-100 text-gray-700 border-gray-300'
                    if (status === 'answered') bgColor = 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500'
                    else if (status === 'review') bgColor = 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-500'
                    else if (status === 'not-answered') bgColor = 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300'
                    
                    if (isActive) bgColor += ' ring-2 ring-blue-500 ring-offset-2'
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-10 h-10 text-sm font-bold rounded-lg border-2 ${bgColor} hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Analysis */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="font-bold text-gray-800 mb-4 text-center">PART-A Analysis</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Answered</span>
                    </div>
                    <span className="text-green-600 font-bold text-lg">{getAnsweredCount()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Not Answered</span>
                    </div>
                    <span className="text-red-600 font-bold text-lg">{getNotAnsweredCount()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Marked for Review</span>
                    </div>
                    <span className="text-yellow-600 font-bold text-lg">{getMarkedForReviewCount()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Top Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">
                      Question : {currentQuestion + 1}
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-sm font-medium">
                        {currentQuestion + 1} of {mockTest.questions.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleMarkForReview(currentQ.id)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      🔖 Mark for Review
                    </button>
                    <button
                      onClick={() => setCurrentQuestion(Math.min(currentQuestion + 1, mockTest.questions.length - 1))}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      💾 Save & Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg mb-6">
                    <div className="text-red-700 text-sm">
                      📝 Please note that this is only a mock test designed for practice purposes. Some of the questions may be repeated or similar.
                    </div>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="text-xl font-medium text-gray-800 leading-relaxed mb-4">
                      {currentQ.questionText}
                    </div>
                    {currentQ.questionImage && (
                      <div className="mt-4">
                        <img 
                          src={currentQ.questionImage} 
                          alt="Question" 
                          className="max-w-full h-auto rounded-lg shadow-md border border-gray-200" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {[
                    { key: 'A', text: currentQ.optionA, image: currentQ.optionAImage },
                    { key: 'B', text: currentQ.optionB, image: currentQ.optionBImage },
                    { key: 'C', text: currentQ.optionC, image: currentQ.optionCImage },
                    { key: 'D', text: currentQ.optionD, image: currentQ.optionDImage }
                  ].map((option) => {
                    const isSelected = responses.find(r => r.questionId === currentQ.id)?.selectedOption === option.key.toLowerCase()
                    
                    return (
                      <label
                        key={option.key}
                        className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-md' 
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                              isSelected 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {option.key}
                            </div>
                            <div className="text-lg font-medium text-gray-800">
                              {option.text}
                            </div>
                          </div>
                          {option.image && (
                            <div className="mt-3">
                              <img 
                                src={option.image} 
                                alt={`Option ${option.key}`} 
                                className="max-w-xs h-auto rounded-lg shadow-sm border border-gray-200" 
                              />
                            </div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option.key.toLowerCase()}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(currentQ.id, option.key.toLowerCase())}
                          className="sr-only"
                        />
                      </label>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    ⬅️ Previous
                  </button>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🚀 Submit Test
                    </button>
                    
                    {currentQuestion < mockTest.questions.length - 1 && (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Next ➡️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Test?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit the test? You won&apos;t be able to change your answers after submission.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitTest(false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Window Switch Warning Modal */}
      {showWindowWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Window Switch Detected!</h3>
              <p className="text-gray-600 mb-4">
                Warning {windowSwitchCount}/2: Please stay focused on your exam. 
                {windowSwitchCount === 2 ? ' One more switch will auto-submit your test!' : ''}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Switching windows or tabs during the exam is not allowed. Please complete your test in this window.
                </p>
              </div>
              <button
                onClick={() => setShowWindowWarning(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
