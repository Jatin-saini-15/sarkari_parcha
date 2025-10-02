'use client'

import { useEffect, useState } from 'react'

export default function AdminStudioPage() {
  const [recent, setRecent] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const appendLog = (line: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} — ${line}`])

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch('/api/admin/word-upload'),
          fetch('/api/admin/exam-categories')
        ])
        if (r1.ok) setRecent((await r1.json()).data || [])
        if (r2.ok) setCategories((await r2.json()).categories || [])
      } catch (e: any) {
        console.error(e)
      }
    }
    load()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const fd = new FormData(form)
    const file = fd.get('file') as File
    const categoryId = fd.get('categoryId') as string
    const testType = fd.get('testType') as string
    const examName = fd.get('examName') as string
    const year = fd.get('year') as string
    const isFree = fd.get('isFree') as string

    // Validation for PYQ
    if (testType === 'pyq' && !year) {
      setError('Year is required for Previous Year Questions (PYQ)')
      return
    }

    try {
      appendLog(`Submitting upload: ${file?.name} (${file?.size} bytes)`)
      appendLog(`Type: ${testType}, Category: ${categoryId}, Exam: ${examName}, Year: ${year || 'N/A'}, Free: ${isFree}`)
      setIsUploading(true)
      const res = await fetch('/api/admin/word-upload', { method: 'POST', body: fd })
      const data = await res.json()
      appendLog(`Response status=${res.status} body=${JSON.stringify(data)}`)
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      alert(`Successfully processed ${data.questionsProcessed} questions for ${testType.toUpperCase()}`)
      // refresh recent
      const r = await fetch('/api/admin/word-upload')
      if (r.ok) setRecent((await r.json()).data || [])
      form.reset()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Unexpected error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Studio</h1>
              <p className="text-gray-600">Upload Word files and auto-create tests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Upload DOCX</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Test Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="testType" 
                    value="mock" 
                    defaultChecked 
                    className="mr-2"
                  />
                  <span>Mock Test</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="testType" 
                    value="pyq" 
                    className="mr-2"
                  />
                  <span>Previous Year Questions (PYQ)</span>
                </label>
              </div>
            </div>

            {/* Test Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
              <input 
                name="testName" 
                required 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., SSC CGL Tier 1 English"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="categoryId" required className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Exam Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
              <input 
                name="examName" 
                required 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., CGL, CHSL, MTS, IBPS PO, etc."
              />
            </div>

            {/* Year (conditional for PYQ) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-xs text-gray-500">(Required for PYQ, Optional for Mock)</span>
              </label>
              <input 
                name="year" 
                type="number" 
                min="2000" 
                max="2030" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 2024"
              />
            </div>

            {/* Subject/Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject/Section <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input 
                name="subject" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., English, Quantitative Aptitude, General Awareness"
              />
            </div>

            {/* Free/Premium Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="isFree" 
                    value="true" 
                    defaultChecked
                    className="mr-2"
                  />
                  <span>Free - Accessible to all users</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="isFree" 
                    value="false" 
                    className="mr-2"
                  />
                  <span>Premium - Requires premium subscription</span>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload DOCX File</label>
              <input 
                type="file" 
                name="file" 
                accept=".docx" 
                required 
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button 
              disabled={isUploading} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Processing…' : 'Upload & Create Test'}
            </button>
          </form>
          {logs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Console</h3>
              <div className="text-xs bg-gray-50 border rounded p-3 max-h-48 overflow-auto space-y-1">
                {logs.map((l, i) => <div key={i} className="font-mono text-gray-700">{l}</div>)}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {recent.length === 0 && (
              <div className="text-sm text-gray-500">No recent items</div>
            )}
            {recent.map((t) => (
              <div key={t.id} className="p-3 border rounded-lg">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{t.category} • {t.questionsCount} Qs</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 