'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface MockTest {
  id: string
  title: string
  category: string
  questionsCount: number
  createdAt: string
  isActive: boolean
  isFree: boolean
  duration: number
  totalMarks: number
  folderId?: string
  folderName?: string
}

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

interface Folder {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  children: Folder[]
  mockTests: MockTest[]
  createdAt: string
}

export default function StudioDashboard() {
  const [tests, setTests] = useState<MockTest[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTest, setEditingTest] = useState<MockTest | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    duration: '',
    totalMarks: '',
    isFree: true,
    isActive: true,
    folderId: ''
  })
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingTest, setDeletingTest] = useState<MockTest | null>(null)
  
  // Question editing state
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [editingQuestions, setEditingQuestions] = useState<Question[]>([])
  const [currentTestForQuestions, setCurrentTestForQuestions] = useState<MockTest | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [testsRes, foldersRes] = await Promise.all([
        fetch('/api/admin/studio/tests'),
        fetch('/api/admin/studio/folders')
      ])
      
      if (testsRes.ok) {
        const testsData = await testsRes.json()
        setTests(testsData.tests || [])
      }
      
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json()
        setFolders(foldersData.folders || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      const res = await fetch('/api/admin/studio/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          parentId: currentFolder
        })
      })
      
      if (res.ok) {
        setNewFolderName('')
        setShowCreateFolder(false)
        loadData()
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleEditTest = (test: MockTest) => {
    setEditingTest(test)
    setEditForm({
      title: test.title,
      duration: test.duration.toString(),
      totalMarks: test.totalMarks.toString(),
      isFree: test.isFree,
      isActive: test.isActive,
      folderId: test.folderId || ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingTest) return
    
    try {
      const res = await fetch('/api/admin/studio/tests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: editingTest.id,
          title: editForm.title,
          duration: editForm.duration,
          totalMarks: editForm.totalMarks,
          isFree: editForm.isFree,
          isActive: editForm.isActive,
          folderId: editForm.folderId || null
        })
      })
      
      if (res.ok) {
        setShowEditModal(false)
        setEditingTest(null)
        loadData()
        alert('Test updated successfully!')
      } else {
        const data = await res.json()
        alert('Error updating test: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating test:', error)
      alert('Error updating test')
    }
  }

  const handleDeleteTest = (test: MockTest) => {
    setDeletingTest(test)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingTest) return
    
    try {
      const res = await fetch('/api/admin/studio/tests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: deletingTest.id
        })
      })
      
      if (res.ok) {
        setShowDeleteModal(false)
        setDeletingTest(null)
        loadData()
        alert('Test deleted successfully!')
      } else {
        const data = await res.json()
        alert('Error deleting test: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('Error deleting test')
    }
  }

  const moveTestToFolder = async (testId: string, folderId: string | null) => {
    try {
      const res = await fetch('/api/admin/studio/tests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          folderId
        })
      })
      
      if (res.ok) {
        loadData()
        alert('Test moved successfully!')
      } else {
        const data = await res.json()
        alert('Error moving test: ' + data.error)
      }
    } catch (error) {
      console.error('Error moving test:', error)
      alert('Error moving test')
    }
  }

  const handleEditQuestions = async (test: MockTest) => {
    setCurrentTestForQuestions(test)
    
    try {
      const res = await fetch(`/api/admin/studio/tests/${test.id}/questions`)
      if (res.ok) {
        const data = await res.json()
        setEditingQuestions(data.questions || [])
        setShowQuestionsModal(true)
      } else {
        alert('Error loading questions')
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      alert('Error loading questions')
    }
  }

  const updateQuestion = async (questionId: string, updates: Partial<Question>) => {
    if (!currentTestForQuestions) return
    
    try {
      const res = await fetch(`/api/admin/studio/tests/${currentTestForQuestions.id}/questions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          ...updates
        })
      })
      
      if (res.ok) {
        // Refresh questions
        handleEditQuestions(currentTestForQuestions)
      } else {
        const data = await res.json()
        alert('Error updating question: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating question:', error)
      alert('Error updating question')
    }
  }

  const addNewQuestion = async () => {
    if (!currentTestForQuestions) return
    
    try {
      const res = await fetch(`/api/admin/studio/tests/${currentTestForQuestions.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: 'New Question',
          optionA: 'Option A',
          optionB: 'Option B',
          optionC: 'Option C',
          optionD: 'Option D',
          correctOption: 'A',
          explanation: '',
          marks: 1
        })
      })
      
      if (res.ok) {
        // Refresh questions
        handleEditQuestions(currentTestForQuestions)
      } else {
        const data = await res.json()
        alert('Error adding question: ' + data.error)
      }
    } catch (error) {
      console.error('Error adding question:', error)
      alert('Error adding question')
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!currentTestForQuestions) return
    
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      const res = await fetch(`/api/admin/studio/tests/${currentTestForQuestions.id}/questions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })
      
      if (res.ok) {
        // Refresh questions
        handleEditQuestions(currentTestForQuestions)
      } else {
        const data = await res.json()
        alert('Error deleting question: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Error deleting question')
    }
  }

  const getCurrentFolderTests = () => {
    if (!currentFolder) {
      return tests.filter(test => !test.folderId)
    }
    return tests.filter(test => test.folderId === currentFolder)
  }

  const getCurrentSubfolders = () => {
    return folders.filter(folder => folder.parentId === currentFolder)
  }

  const getBreadcrumbs = () => {
    if (!currentFolder) return []
    
    const breadcrumbs = []
    let folder = folders.find(f => f.id === currentFolder)
    
    while (folder) {
      breadcrumbs.unshift(folder)
      const parentId = folder.parentId
      folder = parentId ? folders.find(f => f.id === parentId) : undefined
    }
    
    return breadcrumbs
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Test Dashboard</h1>
              <p className="text-gray-600">Manage your uploaded tests and folders</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                New Folder
              </button>
              <Link
                href="/admin/studio"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setCurrentFolder(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Home
            </button>
            {getBreadcrumbs().map((folder) => (
              <div key={folder.id} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => setCurrentFolder(folder.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Folders */}
        {getCurrentSubfolders().length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getCurrentSubfolders().map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-gray-900">{folder.name}</h3>
                      <p className="text-sm text-gray-500">{tests.filter(test => test.folderId === folder.id).length} tests</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tests</h2>
          {getCurrentFolderTests().length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No tests in this folder</p>
              <Link
                href="/admin/studio"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Your First Test
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentFolderTests().map((test) => (
                <div key={test.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{test.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{test.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium">{test.questionsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Marks:</span>
                      <span className="font-medium">{test.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{test.isFree ? 'Free' : 'Premium'}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Created: {new Date(test.createdAt).toLocaleDateString()}
                    {test.folderName && (
                      <div className="mt-1">
                        📁 Folder: <span className="font-medium">{test.folderName}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Folder Management */}
                  <div className="mb-3">
                    <select
                      value={test.folderId || ''}
                      onChange={(e) => moveTestToFolder(test.id, e.target.value || null)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      <option value="">📂 Move to folder...</option>
                      <option value="">🏠 Root (No folder)</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          📁 {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-1 mb-2">
                    <Link
                      href={`/admin/studio/tests/${test.id}`}
                      className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 text-center"
                    >
                      View
                    </Link>
                    <Link
                      href={`/test/${test.id}`}
                      className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 text-center"
                    >
                      Test
                    </Link>
                  </div>
                  
                  <div className="flex gap-1 mb-1">
                    <button
                      onClick={() => handleEditTest(test)}
                      className="flex-1 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleEditQuestions(test)}
                      className="flex-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      📝 Questions
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDeleteTest(test)}
                      className="w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false)
                    setNewFolderName('')
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {showEditModal && editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Test: {editingTest.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={editForm.totalMarks}
                      onChange={(e) => setEditForm({...editForm, totalMarks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                  <select
                    value={editForm.folderId}
                    onChange={(e) => setEditForm({...editForm, folderId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No folder (Root)</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.isFree}
                      onChange={(e) => setEditForm({...editForm, isFree: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Free Access</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingTest(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Delete Test</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete &ldquo;<strong>{deletingTest.title}</strong>&rdquo;?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All questions and test attempts will be permanently deleted.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingTest(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Editing Modal */}
      {showQuestionsModal && currentTestForQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Questions: {currentTestForQuestions.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={addNewQuestion}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ➕ Add Question
                  </button>
                  <button
                    onClick={() => {
                      setShowQuestionsModal(false)
                      setCurrentTestForQuestions(null)
                      setEditingQuestions([])
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {editingQuestions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Question {question.questionNumber}</h4>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) => {
                            const updated = [...editingQuestions]
                            updated[index].questionText = e.target.value
                            setEditingQuestions(updated)
                          }}
                          onBlur={() => updateQuestion(question.id, { questionText: question.questionText })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
                          <input
                            type="text"
                            value={question.optionA}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].optionA = e.target.value
                              setEditingQuestions(updated)
                            }}
                            onBlur={() => updateQuestion(question.id, { optionA: question.optionA })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
                          <input
                            type="text"
                            value={question.optionB}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].optionB = e.target.value
                              setEditingQuestions(updated)
                            }}
                            onBlur={() => updateQuestion(question.id, { optionB: question.optionB })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option C</label>
                          <input
                            type="text"
                            value={question.optionC}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].optionC = e.target.value
                              setEditingQuestions(updated)
                            }}
                            onBlur={() => updateQuestion(question.id, { optionC: question.optionC })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option D</label>
                          <input
                            type="text"
                            value={question.optionD}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].optionD = e.target.value
                              setEditingQuestions(updated)
                            }}
                            onBlur={() => updateQuestion(question.id, { optionD: question.optionD })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                          <select
                            value={question.correctOption}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].correctOption = e.target.value
                              setEditingQuestions(updated)
                              updateQuestion(question.id, { correctOption: e.target.value })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                          <input
                            type="number"
                            value={question.marks}
                            onChange={(e) => {
                              const updated = [...editingQuestions]
                              updated[index].marks = parseInt(e.target.value) || 1
                              setEditingQuestions(updated)
                            }}
                            onBlur={() => updateQuestion(question.id, { marks: question.marks })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                        <textarea
                          value={question.explanation || ''}
                          onChange={(e) => {
                            const updated = [...editingQuestions]
                            updated[index].explanation = e.target.value
                            setEditingQuestions(updated)
                          }}
                          onBlur={() => updateQuestion(question.id, { explanation: question.explanation })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Enter explanation for the correct answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {editingQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No questions found in this test.</p>
                    <button
                      onClick={addNewQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add First Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
