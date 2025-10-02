'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Question {
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
}

interface DebugResult {
  filename: string;
  fileSize: number;
  savedPath: string;
  parsedQuestions: Question[];
  parsedQuestionsCount: number;
  sectionedQuestionsCount: number | string;
  success: boolean;
  error?: string;
}

export default function DebugPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<DebugResult | null>(null)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
        setError('')
      }
    },
    onDropRejected: () => {
      setError('Please select a valid DOCX file')
    }
  })

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/debug', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error(err)
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">DOCX Parser Debug</h1>
        
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload DOCX File</h2>
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
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a DOCX file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">Only DOCX files are supported</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`btn-primary px-6 py-3 w-full ${
                !selectedFile || uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Processing...' : 'Parse DOCX File'}
            </button>
          </div>
        </div>

        {result && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium">File</p>
                <p className="text-sm">{result.filename}</p>
                <p className="text-xs text-gray-500">{formatFileSize(result.fileSize)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Questions Extracted</p>
                <p className="text-2xl font-bold">{result.parsedQuestionsCount}</p>
                <p className="text-xs text-gray-500">
                  {result.success ? 'Success' : 'Failed to extract questions'}
                </p>
              </div>
            </div>
            
            {result.parsedQuestionsCount > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Sample Questions</h3>
                  <div className="space-y-4">
                    {result.parsedQuestions.map((question, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-medium mb-2">
                          Q{question.questionNumber}. {question.questionText}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div className={question.correctOption === 'A' ? 'text-green-700 font-medium' : ''}>
                            A. {question.optionA}
                          </div>
                          <div className={question.correctOption === 'B' ? 'text-green-700 font-medium' : ''}>
                            B. {question.optionB}
                          </div>
                          <div className={question.correctOption === 'C' ? 'text-green-700 font-medium' : ''}>
                            C. {question.optionC}
                          </div>
                          <div className={question.correctOption === 'D' ? 'text-green-700 font-medium' : ''}>
                            D. {question.optionD}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Correct Answer: {question.correctOption}
                        </p>
                        {question.explanation && (
                          <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Raw Data</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto text-xs">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 