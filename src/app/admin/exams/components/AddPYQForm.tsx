'use client';

import { useState } from 'react';
import BulkUploadSection from './BulkUploadSection';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
}

interface ExamName {
  id: string;
  name: string;
  slug: string;
}

interface PYQFormData {
  title: string;
  examUrl: string;
  examType: string;
  isFree: boolean;
  duration: number | null;
  totalMarks: number | null;
  categoryId: string;
  examNameId: string;
  year: number;
}

interface AddPYQFormProps {
  categories: ExamCategory[];
  examNames: ExamName[];
  onSubmit: (formData: PYQFormData) => Promise<void>;
  onCategoryChange: (categoryId: string) => void;
  isSubmitting: boolean;
}

export default function AddPYQForm({ 
  categories, 
  examNames, 
  onSubmit, 
  onCategoryChange, 
  isSubmitting 
}: AddPYQFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    examUrl: '',
    examType: 'pyq',
    isFree: true,
    durationHours: '',
    durationMinutes: '',
    totalMarks: '',
    categoryId: '',
    examNameId: '',
    year: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fix duration calculation to handle cases where only hours or only minutes are selected
    const hours = formData.durationHours ? parseInt(formData.durationHours) : 0;
    const minutes = formData.durationMinutes ? parseInt(formData.durationMinutes) : 0;
    const duration = (hours > 0 || minutes > 0) ? (hours * 60 + minutes) : null;
    
    await onSubmit({
      ...formData,
      duration,
      totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : null,
      year: parseInt(formData.year)
    });

    // Reset form
    setFormData({
      title: '',
      examUrl: '',
      examType: 'pyq',
      isFree: true,
      durationHours: '',
      durationMinutes: '',
      totalMarks: '',
      categoryId: '',
      examNameId: '',
      year: ''
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId, examNameId: '' });
    onCategoryChange(categoryId);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Add Previous Year Question Paper</h3>
        <p className="text-sm text-green-700">Add exam papers from previous years with specific category and year selection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., SSC CGL 2023 Question Paper"
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://example.com/exam-link"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Name (Optional)
          </label>
          <select
            value={formData.examNameId}
            onChange={(e) => setFormData({...formData, examNameId: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={!formData.categoryId}
          >
            <option value="">Select Exam Name</option>
            {examNames.map(name => (
              <option key={name.id} value={name.id}>
                {name.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <select
            required
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Year</option>
            {Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Hours)
          </label>
          <select
            value={formData.durationHours}
            onChange={(e) => setFormData({...formData, durationHours: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">0</option>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">0</option>
            {[15, 30, 45].map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
            {Array.from({ length: 60 }, (_, i) => i).map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalMarks}
            onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="100"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFree}
            onChange={(e) => setFormData({...formData, isFree: e.target.checked})}
            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Free Exam</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {isSubmitting ? 'Adding...' : 'Add PYQ Exam'}
        </button>
      </div>

      {/* Bulk Upload Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <BulkUploadSection type="pyq" />
      </div>
    </form>
  );
} 