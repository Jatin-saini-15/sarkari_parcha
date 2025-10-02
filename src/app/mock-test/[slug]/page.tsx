'use client';

import { useState, useEffect, useCallback } from 'react';
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
  subject?: string;
  difficulty?: string;
  marks: number;
  debug?: string; // Debug information from the parser
}

interface MockTest {
  id: string;
  title: string;
  slug: string;
  description?: string;
  instructions?: string;
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
  questions: Question[];
}

interface QuestionResponse {
  questionId: string;
  selectedOption: string | null;
  timeTaken?: number;
}

export default function MockTestPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Check authentication
  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/auth/signin');
      return;
    }
  }, [session, router]);

  // Fetch mock test data
  useEffect(() => {
    if (slug) {
      fetchMockTest();
    }
  }, [slug]);

  // Timer effect
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, timeLeft]);

  // Prevent page refresh/close during exam
  useEffect(() => {
    if (isStarted) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
        return e.returnValue;
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isStarted]);

  const fetchMockTest = async () => {
    try {
      const response = await fetch(`/api/mock-test/${slug}`);
      const data = await response.json();
      
      if (response.ok) {
        setMockTest(data.mockTest);
        setTimeLeft(data.mockTest.duration * 60); // Convert minutes to seconds
        
        // Initialize responses array
        const initialResponses: QuestionResponse[] = data.mockTest.questions.map((q: Question) => ({
          questionId: q.id,
          selectedOption: null,
          timeTaken: 0
        }));
        setResponses(initialResponses);
        
        // Check if user has already started this test
        checkExistingAttempt(data.mockTest.id);
      } else {
        router.push('/mock-tests');
      }
    } catch (error) {
      console.error('Error fetching mock test:', error);
      router.push('/mock-tests');
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingAttempt = async (mockTestId: string) => {
    try {
      const response = await fetch(`/api/test-attempt?mockTestId=${mockTestId}`);
      const data = await response.json();
      
      if (data.attempt) {
        if (data.attempt.isCompleted) {
          // User has already completed this test
          router.push(`/mock-test-results/${data.attempt.id}`);
        } else {
          // User has an active attempt - this shouldn't happen normally
          // but we'll handle it gracefully
          alert('You have an incomplete attempt. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Error checking existing attempt:', error);
    }
  };

  const handleStartTest = async () => {
    if (!mockTest) return;
    
    try {
      const response = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: mockTest.id,
          action: 'start'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAttemptId(data.attemptId);
        setIsStarted(true);
        setShowInstructions(false);
        setQuestionStartTime(Date.now());
      } else {
        alert(data.error || 'Failed to start test');
      }
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    
    setResponses(prev => 
      prev.map(response => 
        response.questionId === questionId 
          ? { ...response, selectedOption: option, timeTaken }
          : response
      )
    );
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < (mockTest?.questions.length || 0)) {
      setCurrentQuestion(questionIndex);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitTest = async () => {
    if (!attemptId || !mockTest) return;
    
    if (!confirm('Are you sure you want to submit the test? You cannot change your answers after submission.')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: mockTest.id,
          action: 'submit',
          attemptId,
          responses
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to results page
        router.push(`/mock-test-results/${attemptId}`);
      } else {
        alert(data.error || 'Failed to submit test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = useCallback(() => {
    if (attemptId && mockTest) {
      handleSubmitTest();
    }
  }, [attemptId, mockTest]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionIndex: number) => {
    const response = responses[questionIndex];
    if (!response) return 'not-visited';
    if (response.selectedOption) return 'answered';
    return 'not-answered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'not-answered': return 'bg-red-500 text-white';
      case 'not-visited': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mock test...</p>
        </div>
      </div>
    );
  }

  if (!mockTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mock Test Not Found</h1>
          <Link href="/mock-tests" className="text-blue-600 hover:text-blue-800">
            ← Back to Mock Tests
          </Link>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (showInstructions && !isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">{mockTest.title}</h1>
              <p className="text-gray-600 mt-1">{mockTest.category.name} {mockTest.examName?.name}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockTest.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockTest.duration}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{mockTest.totalMarks}</div>
                  <div className="text-sm text-gray-600">Total Marks</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• This is a timed test. You have {mockTest.duration} minutes to complete all questions.</li>
                  <li>• Each question carries {mockTest.questions[0]?.marks || 1} mark(s).</li>
                  {mockTest.negativeMarking && (
                    <li>• Negative marking: {mockTest.negativeMarking} mark(s) will be deducted for each wrong answer.</li>
                  )}
                  <li>• You can navigate between questions using the question palette.</li>
                  <li>• Green indicates answered questions, Red indicates visited but not answered.</li>
                  <li>• The test will auto-submit when time expires.</li>
                  <li>• Do not refresh the page or close the browser during the test.</li>
                </ul>
              </div>

              {mockTest.instructions && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Additional Instructions:</h3>
                  <p className="text-sm text-gray-700">{mockTest.instructions}</p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Link
                  href="/mock-tests"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleStartTest}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exam Interface
  const currentQuestionData = mockTest.questions[currentQuestion];
  const currentResponse = responses[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{mockTest.title}</h1>
              <p className="text-sm text-gray-600">{mockTest.category.name} {mockTest.examName?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{formatTime(timeLeft)}</div>
                <div className="text-xs text-gray-500">Time Left</div>
              </div>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Panel */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestion + 1} of {mockTest.questions.length}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {currentQuestionData.subject && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {currentQuestionData.subject}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                    {currentQuestionData.marks} mark(s)
                  </span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-800 mb-4">{currentQuestionData.questionText}</p>
                {currentQuestionData.questionImage && (
                  <img 
                    src={currentQuestionData.questionImage} 
                    alt="Question" 
                    className="max-w-full h-auto mb-4 rounded border"
                  />
                )}
                
                {/* Debug Panel - Only visible during development */}
                {process.env.NODE_ENV === 'development' && currentQuestionData.debug && (
                  <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
                    <details>
                      <summary className="font-medium text-gray-700 cursor-pointer">Debug Info</summary>
                      <pre className="mt-2 text-xs whitespace-pre-wrap text-gray-600 overflow-auto max-h-40">
                        {currentQuestionData.debug}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option${option}` as keyof Question;
                  const optionImageKey = `option${option}Image` as keyof Question;
                  const optionText = currentQuestionData[optionKey] as string;
                  const optionImage = currentQuestionData[optionImageKey] as string;
                  
                  return (
                    <label
                      key={option}
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        currentResponse?.selectedOption === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={currentResponse?.selectedOption === option}
                          onChange={() => handleOptionSelect(currentQuestionData.id, option)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">{option})</span>
                            <span className="text-gray-800">{optionText}</span>
                          </div>
                          {optionImage && (
                            <img 
                              src={optionImage} 
                              alt={`Option ${option}`} 
                              className="mt-2 max-w-xs h-auto rounded border"
                            />
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => handleQuestionNavigation(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOptionSelect(currentQuestionData.id, '')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Clear Response
                  </button>
                  <button
                    onClick={() => handleQuestionNavigation(currentQuestion + 1)}
                    disabled={currentQuestion === mockTest.questions.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save & Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette */}
        <div className="w-80 p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Question Palette</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {mockTest.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : getStatusColor(getQuestionStatus(index))
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Answered ({responses.filter(r => r.selectedOption).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Not Answered ({responses.filter(r => !r.selectedOption).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Current Question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}