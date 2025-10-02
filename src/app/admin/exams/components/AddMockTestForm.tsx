'use client';

import { useState } from 'react';
import BulkUploadSection from './BulkUploadSection';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
}

interface MockTestFormData {
  title: string;
  examUrl: string;
  examType: string;
  isFree: boolean;
  duration: number | null;
  totalMarks: number | null;
  categoryId: string;
}

interface AddMockTestFormProps {
  categories: ExamCategory[];
  onSubmit: (formData: MockTestFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddMockTestForm({ 
  categories, 
  onSubmit, 
  isSubmitting
}: AddMockTestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    examUrl: '',
    examType: 'mock',
    isFree: true,
    durationHours: '1',
    durationMinutes: '0',
    totalMarks: '100',
    categoryId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.examUrl || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    // Fix duration calculation to handle cases where only hours or only minutes are selected
    const hours = formData.durationHours ? parseInt(formData.durationHours) : 0;
    const minutes = formData.durationMinutes ? parseInt(formData.durationMinutes) : 0;
    const duration = (hours > 0 || minutes > 0) ? (hours * 60 + minutes) : null;
    
    const submitData: MockTestFormData = {
      title: formData.title,
      examUrl: formData.examUrl,
      examType: 'mock',
      isFree: formData.isFree,
      duration,
      totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : null,
      categoryId: formData.categoryId
    };

    await onSubmit(submitData);

    // Reset form
    setFormData({
      title: '',
      examUrl: '',
      examType: 'mock',
      isFree: true,
      durationHours: '1',
      durationMinutes: '0',
      totalMarks: '100',
      categoryId: ''
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Add Mock Test</h3>
          <p className="text-sm text-blue-700">
            Create individual mock tests. To organize tests into series, use the 
            <a href="/admin/test-series" className="text-blue-600 hover:text-blue-800 font-semibold ml-1">Test Series Management</a> page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Name *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., SSC CGL Mock Test 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Category *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Hours) *
            </label>
            <select
              required
              value={formData.durationHours}
              onChange={(e) => setFormData({...formData, durationHours: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Minutes)
            </label>
            <select
              value={formData.durationMinutes}
              onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 4 }, (_, i) => i * 15).map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Marks *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.totalMarks}
              onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam URL *
          </label>
          <input
            type="url"
            required
            value={formData.examUrl}
            onChange={(e) => setFormData({...formData, examUrl: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/exam-link"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isFree}
              onChange={(e) => setFormData({...formData, isFree: e.target.checked})}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Free Access</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {isSubmitting ? 'Creating Mock Test...' : 'Create Mock Test'}
          </button>
        </div>
      </form>

      {/* Bulk Upload Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <BulkUploadSection type="mock-tests" />
      </div>
    </div>
  );
} 