'use client';

import { useState } from 'react';

interface BulkUploadSectionProps {
  type: 'pyq' | 'mock-tests';
}

export default function BulkUploadSection({ type }: BulkUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`/api/admin/bulk-upload/${type}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setUploadResult(result);

      if (response.ok) {
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById(`bulk-upload-${type}`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        error: 'Upload failed. Please try again.',
        results: { success: 0, failed: 0, errors: [] }
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    let templateData, filename;
    
    if (type === 'pyq') {
      templateData = [
        {
          title: 'SSC CGL 2023 Question Paper',
          examUrl: 'https://example.com/exam-link',
          category: 'SSC',
          examName: 'CGL',
          year: 2023,
          durationHours: 2,
          durationMinutes: 30,
          totalMarks: 200,
          isFree: true
        }
      ];
      filename = 'pyq_bulk_upload_template.csv';
    } else {
      templateData = [
        {
          title: 'SSC CGL Mock Test 1',
          examUrl: 'https://example.com/exam-link',
          category: 'SSC',
          durationHours: 2,
          durationMinutes: 0,
          totalMarks: 200,
          isFree: true
        }
      ];
      filename = 'mock_tests_bulk_upload_template.csv';
    }

    // Convert to CSV
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Bulk Upload {type === 'pyq' ? 'PYQ Papers' : 'Mock Tests'}
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Upload multiple {type === 'pyq' ? 'PYQ papers' : 'mock tests'} at once using Excel (.xlsx) or CSV (.csv) files.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Download */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Step 1: Download Template</h4>
            <p className="text-sm text-gray-600 mb-3">
              Download the template file to see the required format and columns.
            </p>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Step 2: Upload Your File</h4>
            <p className="text-sm text-gray-600 mb-3">
              Select your Excel or CSV file with the {type === 'pyq' ? 'PYQ papers' : 'mock tests'} data.
            </p>
            <div className="space-y-3">
              <input
                id={`bulk-upload-${type}`}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Protection Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-red-800 mb-2">⚠️ Revenue Protection</h4>
        <div className="text-sm text-red-700 space-y-1">
          <p><strong>CRITICAL:</strong> Verify your isFree column values to prevent revenue loss!</p>
          <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
            <div>
              <strong>For PREMIUM (Paid) Exams:</strong>
              <div className="font-mono bg-red-100 p-1 rounded">false, FALSE, 0, no</div>
            </div>
            <div>
              <strong>For FREE Exams:</strong>
              <div className="font-mono bg-green-100 p-1 rounded">true, TRUE, 1, yes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Required Columns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {type === 'pyq' ? (
            <>
              <div>
                <strong>Required:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>title - Exam title</li>
                  <li>examUrl - Exam link</li>
                  <li>category - Category name (SSC, Banking, etc.)</li>
                  <li>year - Exam year (2020-{new Date().getFullYear()})</li>
                </ul>
              </div>
              <div>
                <strong>Optional:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>examName - Specific exam (CGL, CHSL, etc.)</li>
                  <li>durationHours - Duration in hours</li>
                  <li>durationMinutes - Duration in minutes</li>
                  <li>totalMarks - Total marks</li>
                  <li>isFree - true/false (default: true)</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Required:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>title - Test name</li>
                  <li>examUrl - Test link</li>
                  <li>category - Category name (SSC, Banking, etc.)</li>
                  <li>totalMarks - Total marks</li>
                </ul>
              </div>
              <div>
                <strong>Optional:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>durationHours - Duration in hours (default: 1)</li>
                  <li>durationMinutes - Duration in minutes (default: 0)</li>
                  <li>isFree - true/false (default: true)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className={`border rounded-lg p-4 ${uploadResult.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <h4 className={`font-medium mb-2 ${uploadResult.error ? 'text-red-800' : 'text-green-800'}`}>
            Upload Results
          </h4>
          
          {uploadResult.error ? (
            <p className="text-red-700">{uploadResult.error}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-green-700">{uploadResult.message}</p>
              {uploadResult.results && (
                <div className="text-sm text-green-600">
                  <p>✅ Successful: {uploadResult.results.success}</p>
                  <p>❌ Failed: {uploadResult.results.failed}</p>
                </div>
              )}
            </div>
          )}

          {uploadResult.results?.errors && uploadResult.results.errors.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-red-800 mb-2">Errors:</p>
              <div className="max-h-32 overflow-y-auto">
                {uploadResult.results.errors.map((error: string, index: number) => (
                  <p key={index} className="text-sm text-red-700">• {error}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 