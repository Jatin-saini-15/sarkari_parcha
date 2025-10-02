'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  questionImage?: string;
  optionA: string;
  optionAImage?: string;
  optionB: string;
  optionBImage?: string;
  optionC: string;
  optionCImage?: string;
  optionD: string;
  optionDImage?: string;
  correctOption: string;
  explanation?: string;
  subject?: string;
  difficulty?: string;
  marks: number;
}

interface QuestionResponse {
  id: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeTaken?: number;
  question: Question;
}

interface TestAttempt {
  id: string;
  startTime: string;
  endTime: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  isCompleted: boolean;
  mockTest: {
    id: string;
    title: string;
    slug: string;
    duration: number;
    totalMarks: number;
    negativeMarking?: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    examName?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  responses: QuestionResponse[];
}

export default function MockTestResultsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'solutions'>('overview');
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/auth/signin');
      return;
    }
    
    if (attemptId) {
      fetchResults();
    }
  }, [session, attemptId, router]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/test-attempt?attemptId=${attemptId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAttempt(data.attempt);
      } else {
        router.push('/mock-tests');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      router.push('/mock-tests');
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getSubjectAnalysis = () => {
    if (!attempt) return {};
    
    const analysis: { [key: string]: { total: number; correct: number; wrong: number; skipped: number } } = {};
    
    attempt.responses.forEach(response => {
      const subject = response.question.subject || 'General';
      if (!analysis[subject]) {
        analysis[subject] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      }
      
      analysis[subject].total++;
      if (response.selectedOption === null) {
        analysis[subject].skipped++;
      } else if (response.isCorrect) {
        analysis[subject].correct++;
      } else {
        analysis[subject].wrong++;
      }
    });
    
    return analysis;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
          <Link href="/mock-tests" className="text-blue-600 hover:text-blue-800">
            ← Back to Mock Tests
          </Link>
        </div>
      </div>
    );
  }

  const subjectAnalysis = getSubjectAnalysis();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
                <p className="text-gray-600 mt-1">{attempt.mockTest.title}</p>
                <p className="text-sm text-gray-500">
                  {attempt.mockTest.category.name} {attempt.mockTest.examName?.name}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getPerformanceColor(attempt.percentage)}`}>
                  {attempt.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {getPerformanceText(attempt.percentage)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'analysis', label: 'Analysis', icon: '📈' },
                { id: 'solutions', label: 'Solutions', icon: '💡' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Score</p>
                    <p className="text-2xl font-bold text-gray-900">{attempt.totalMarks}</p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Correct</p>
                    <p className="text-2xl font-bold text-green-600">{attempt.correctAnswers}</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wrong</p>
                    <p className="text-2xl font-bold text-red-600">{attempt.wrongAnswers}</p>
                  </div>
                  <div className="text-3xl">❌</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skipped</p>
                    <p className="text-2xl font-bold text-gray-600">{attempt.skippedQuestions}</p>
                  </div>
                  <div className="text-3xl">⏭️</div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{attempt.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempted:</span>
                    <span className="font-medium">{attempt.attemptedQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">
                      {attempt.attemptedQuestions > 0 
                        ? ((attempt.correctAnswers / attempt.attemptedQuestions) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-medium">{formatTime(attempt.timeTaken)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Allocated:</span>
                    <span className="font-medium">{formatTime(attempt.mockTest.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Time per Question:</span>
                    <span className="font-medium">
                      {attempt.attemptedQuestions > 0 
                        ? Math.round(attempt.timeTaken / attempt.attemptedQuestions * 60)
                        : 0}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Subject-wise Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Analysis</h3>
              <div className="space-y-4">
                {Object.entries(subjectAnalysis).map(([subject, stats]) => (
                  <div key={subject} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{subject}</h4>
                      <span className="text-sm text-gray-600">
                        {stats.correct}/{stats.total} correct
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Correct: {stats.correct}</span>
                      <span>Wrong: {stats.wrong}</span>
                      <span>Skipped: {stats.skipped}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question-wise Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question-wise Performance</h3>
              <div className="grid grid-cols-10 gap-2">
                {attempt.responses.map((response, index) => (
                  <div
                    key={response.id}
                    className={`w-10 h-10 rounded text-sm font-medium flex items-center justify-center cursor-pointer transition-colors ${
                      response.selectedOption === null
                        ? 'bg-gray-200 text-gray-800'
                        : response.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                    onClick={() => setSelectedQuestion(index)}
                    title={`Question ${index + 1}: ${
                      response.selectedOption === null
                        ? 'Skipped'
                        : response.isCorrect
                        ? 'Correct'
                        : 'Wrong'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Wrong</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Skipped</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            {attempt.responses.map((response, index) => (
              <div key={response.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {index + 1}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {response.question.subject && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {response.question.subject}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                        {response.question.marks} mark(s)
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    response.selectedOption === null
                      ? 'bg-gray-100 text-gray-800'
                      : response.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {response.selectedOption === null
                      ? 'Skipped'
                      : response.isCorrect
                      ? 'Correct'
                      : 'Wrong'}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 mb-2">{response.question.questionText}</p>
                  {response.question.questionImage && (
                    <img 
                      src={response.question.questionImage} 
                      alt="Question" 
                      className="max-w-md h-auto rounded border mb-2"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionKey = `option${option}` as keyof Question;
                    const optionImageKey = `option${option}Image` as keyof Question;
                    const optionText = response.question[optionKey] as string;
                    const optionImage = response.question[optionImageKey] as string;
                    const isCorrect = response.question.correctOption === option;
                    const isSelected = response.selectedOption === option;
                    
                    return (
                      <div
                        key={option}
                        className={`p-3 border rounded-lg ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="font-medium text-gray-700">{option})</span>
                          <div>
                            <span className="text-gray-800">{optionText}</span>
                            {optionImage && (
                              <img 
                                src={optionImage} 
                                alt={`Option ${option}`} 
                                className="mt-1 max-w-xs h-auto rounded border"
                              />
                            )}
                          </div>
                        </div>
                        {isCorrect && (
                          <div className="mt-1 text-green-600 text-sm font-medium">
                            ✓ Correct Answer
                          </div>
                        )}
                        {isSelected && !isCorrect && (
                          <div className="mt-1 text-red-600 text-sm font-medium">
                            ✗ Your Answer
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {response.question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                    <p className="text-blue-700 text-sm">{response.question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/mock-tests"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Mock Tests
          </Link>
          <Link
            href={`/mock-tests/${attempt.mockTest.category.slug}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            More Tests
          </Link>
        </div>
      </div>
    </div>
  );
}