'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Section {
  id: string;
  name: string;
  questions: number;
  marks: number;
}

export default function UploadMockTestPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [formData, setFormData] = useState({
    testName: '',
    category: 'SSC',
    description: '',
    duration: 60,
    totalMarks: 100,
    negativeMarking: 0.25,
    isActive: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sections, setSections] = useState<Section[]>([
    { id: '1', name: 'English Language', questions: 25, marks: 25 },
    { id: '2', name: 'Reasoning', questions: 25, marks: 25 },
    { id: '3', name: 'Quantitative Aptitude', questions: 25, marks: 25 },
    { id: '4', name: 'General Awareness', questions: 25, marks: 25 }
  ])
  const [useSections, setUseSections] = useState(true)

  const categories = ['SSC', 'Banking', 'Railways', 'UPSC', 'State PSC', 'Teaching', 'Defence', 'Police']

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
        setUploadError('')
      }
    },
    onDropRejected: () => {
      setUploadError('Please select a valid PDF, DOC, or DOCX file')
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSectionChange = (id: string, field: keyof Section, value: string | number) => {
    setSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    )
  }

  const addSection = () => {
    const newId = (sections.length + 1).toString()
    setSections([...sections, { id: newId, name: `Section ${newId}`, questions: 25, marks: 25 }])
  }

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id))
  }

  const getTotalQuestions = () => {
    return useSections 
      ? sections.reduce((sum, section) => sum + section.questions, 0)
      : formData.totalMarks
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('testName', formData.testName)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('duration', formData.duration.toString())
      uploadFormData.append('totalQuestions', getTotalQuestions().toString())
      uploadFormData.append('negativeMarking', formData.negativeMarking.toString())
      
      if (useSections) {
        uploadFormData.append('sections', JSON.stringify(sections))
      }

      const response = await fetch('/api/upload/mock-test', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        setUploadSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/mock-tests')
        }, 2000)
      } else {
        const error = await response.json()
        setUploadError(error.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Mock Test</h2>
              <p className="text-gray-600">Add a new mock test to your collection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {uploadSuccess ? (
          <div className="card text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Successful!</h3>
            <p className="text-gray-600 mb-4">Your mock test has been uploaded successfully.</p>
            <Link href="/dashboard/mock-tests" className="btn-primary px-6 py-3">
              View Mock Tests
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Upload File</h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="space-y-2">
                    <DocumentTextIcon className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                      }}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test Details */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Test Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    name="testName"
                    value={formData.testName}
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
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
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
                    value={formData.duration}
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
                    value={formData.totalMarks}
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
                    value={formData.negativeMarking}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter test description"
                  />
                </div>
              </div>
            </div>

            {/* Test Sections */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Test Sections</h3>
                <div className="flex items-center">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={useSections}
                      onChange={() => setUseSections(!useSections)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use sections</span>
                  </label>
                </div>
              </div>

              {useSections && (
                <div className="space-y-4">
                  {sections.map(section => (
                    <div key={section.id} className="flex flex-wrap items-end gap-4 p-4 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Name
                        </label>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => handleSectionChange(section.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Section name"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Questions
                        </label>
                        <input
                          type="number"
                          value={section.questions}
                          onChange={(e) => handleSectionChange(section.id, 'questions', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="1"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marks
                        </label>
                        <input
                          type="number"
                          value={section.marks}
                          onChange={(e) => handleSectionChange(section.id, 'marks', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="1"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={sections.length <= 1}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Section
                  </button>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      Total Questions: <span className="font-semibold">{getTotalQuestions()}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {uploadError && (
              <div className="flex items-center p-4 text-red-700 border border-red-300 rounded-md bg-red-50">
                <XCircleIcon className="w-5 h-5 mr-2" />
                {uploadError}
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`btn-primary px-6 py-3 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Upload Mock Test'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}