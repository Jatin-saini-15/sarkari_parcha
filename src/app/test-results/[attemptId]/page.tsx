'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  questionNumber: number
  questionText: string
  questionImage?: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  explanation?: string
  marks: number
}

interface QuestionResponse {
  id: string
  selectedOption?: string
  isCorrect: boolean
  timeTaken?: number
  question: Question
}

interface TestAttempt {
  id: string
  attemptNumber: number
  startTime: string
  endTime: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  wrongAnswers: number
  skippedQuestions: number
  totalMarks: number
  percentage: number
  timeTaken: number
  mockTest: {
    id: string
    title: string
    duration: number
    totalMarks: number
    category: {
      name: string
      slug: string
    }
    examName: {
      name: string
      slug: string
    }
  }
  responses: QuestionResponse[]
}

interface LeaderboardEntry {
  rank: number
  userName: string
  totalMarks: number
  percentage: number
  timeTaken: number
  attemptNumber: number
}

export default function TestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params.attemptId as string
  
  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'analysis' | 'leaderboard'>('overview')
  const [showSolution, setShowSolution] = useState<string | null>(null)

  useEffect(() => {
    if (attemptId) {
      loadAttemptData()
      loadLeaderboard()
    }
  }, [attemptId])

  const loadAttemptData = async () => {
    try {
      const res = await fetch(`/api/test-attempt?attemptId=${attemptId}`)
      if (res.ok) {
        const data = await res.json()
        setAttempt(data.attempt)
      } else {
        console.error('Failed to load attempt data')
      }
    } catch (error) {
      console.error('Error loading attempt:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLeaderboard = async () => {
    try {
      const res = await fetch(`/api/test-leaderboard/${attemptId}`)
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  const handleReAttempt = async () => {
    if (!attempt) return
    
    try {
      const res = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: attempt.mockTest.id,
          action: 'start'
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        router.push(`/test/${attempt.mockTest.id}`)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to start re-attempt')
      }
    } catch (error) {
      console.error('Error starting re-attempt:', error)
      alert('Error starting re-attempt')
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getOptionClass = (response: QuestionResponse, option: string) => {
    const isSelected = response.selectedOption === option
    const isCorrect = response.question.correctOption === option
    
    if (isSelected && isCorrect) return 'bg-green-100 border-green-500 text-green-800'
    if (isSelected && !isCorrect) return 'bg-red-100 border-red-500 text-red-800'
    if (isCorrect) return 'bg-green-50 border-green-300 text-green-700'
    return 'bg-gray-50 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Results Not Found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{attempt.mockTest.title}</h1>
              <p className="text-gray-600">
                {attempt.mockTest.category.name} • {attempt.mockTest.examName.name} • Attempt #{attempt.attemptNumber}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReAttempt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Re-attempt Test
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                📊 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: '📊 Overview', icon: '📊' },
              { key: 'solutions', label: '💡 Solutions', icon: '💡' },
              { key: 'analysis', label: '📈 Analysis', icon: '📈' },
              { key: 'leaderboard', label: '🏆 Leaderboard', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(attempt.percentage)}`}>
                  {attempt.percentage.toFixed(1)}%
                </div>
                <p className="text-gray-600">Your Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {attempt.totalMarks} / {attempt.mockTest.totalMarks} marks
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{attempt.correctAnswers}</div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{attempt.wrongAnswers}</div>
                  <div className="text-sm text-red-700">Wrong</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{attempt.skippedQuestions}</div>
                  <div className="text-sm text-yellow-700">Skipped</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{attempt.timeTaken}</div>
                  <div className="text-sm text-blue-700">Minutes</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold">{attempt.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempted:</span>
                    <span className="font-semibold">{attempt.attemptedQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-semibold">
                      {attempt.attemptedQuestions > 0 
                        ? ((attempt.correctAnswers / attempt.attemptedQuestions) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time per Question:</span>
                    <span className="font-semibold">
                      {attempt.totalQuestions > 0 
                        ? (attempt.timeTaken / attempt.totalQuestions).toFixed(1)
                        : 0} min
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Time Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration:</span>
                    <span className="font-semibold">{attempt.mockTest.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-semibold">{attempt.timeTaken} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Saved:</span>
                    <span className="font-semibold text-green-600">
                      {attempt.mockTest.duration - attempt.timeTaken} min
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(attempt.timeTaken / attempt.mockTest.duration) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">💡 Detailed Solutions</h3>
              
              <div className="space-y-6">
                {attempt.responses.map((response, index) => (
                  <div key={response.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Question {response.question.questionNumber}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          response.isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : response.selectedOption 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {response.isCorrect ? '✓ Correct' : response.selectedOption ? '✗ Wrong' : '⊝ Skipped'}
                        </span>
                      </h4>
                      <span className="text-sm text-gray-500">{response.question.marks} marks</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-800">{response.question.questionText}</p>
                      {response.question.questionImage && (
                        <img 
                          src={response.question.questionImage} 
                          alt="Question" 
                          className="mt-2 max-w-md rounded-lg"
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <div
                          key={option}
                          className={`p-3 rounded-lg border-2 ${getOptionClass(response, option)}`}
                        >
                          <span className="font-medium">{option})</span> {
                            response.question[`option${option}` as keyof Question] as string
                          }
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          Correct Answer: {response.question.correctOption}
                        </span>
                        {response.selectedOption && (
                          <span className="text-sm text-gray-600">
                            Your Answer: {response.selectedOption}
                          </span>
                        )}
                      </div>
                      
                      {response.question.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-700">
                            <strong>Explanation:</strong> {response.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">📈 Detailed Analysis</h3>
              
              {/* Question-wise Analysis */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4">Question-wise Performance</h4>
                <div className="grid grid-cols-10 gap-2">
                  {attempt.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                        response.isCorrect
                          ? 'bg-green-500 text-white'
                          : response.selectedOption
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                      title={`Q${response.question.questionNumber}: ${
                        response.isCorrect ? 'Correct' : response.selectedOption ? 'Wrong' : 'Skipped'
                      }`}
                    >
                      {response.question.questionNumber}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Correct ({attempt.correctAnswers})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Wrong ({attempt.wrongAnswers})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Skipped ({attempt.skippedQuestions})</span>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">💪 Strengths</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {attempt.correctAnswers > attempt.wrongAnswers && (
                      <li>• Good accuracy rate</li>
                    )}
                    {attempt.timeTaken < attempt.mockTest.duration && (
                      <li>• Efficient time management</li>
                    )}
                    {attempt.percentage >= 60 && (
                      <li>• Above average performance</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-900 mb-2">⚠️ Areas to Improve</h5>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {attempt.skippedQuestions > 5 && (
                      <li>• Reduce skipped questions</li>
                    )}
                    {attempt.wrongAnswers > attempt.correctAnswers && (
                      <li>• Focus on accuracy</li>
                    )}
                    {attempt.percentage < 60 && (
                      <li>• Overall performance needs improvement</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">🎯 Recommendations</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Review incorrect answers</li>
                    <li>• Practice similar questions</li>
                    <li>• Focus on time management</li>
                    <li>• Take more mock tests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">🏆 Test Leaderboard</h3>
              
              {leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Percentage</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Attempt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr 
                          key={index}
                          className={`border-b border-gray-100 ${
                            entry.userName === 'You' ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {entry.rank <= 3 && (
                                <span className="mr-2">
                                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              )}
                              #{entry.rank}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{entry.userName}</td>
                          <td className="py-3 px-4">{entry.totalMarks}</td>
                          <td className="py-3 px-4">
                            <span className={getScoreColor(entry.percentage)}>
                              {entry.percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4">{entry.timeTaken} min</td>
                          <td className="py-3 px-4">#{entry.attemptNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
