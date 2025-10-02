'use client';

import { useState } from 'react';

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
}

interface LiveTestFormData {
  title: string;
  examUrl: string;
  examType: string;
  isFree: boolean;
  duration: number | null;
  totalMarks: number | null;
  categoryId: string;
  scheduledAt: string;
  examEndTime: string;
}

interface AddLiveTestFormProps {
  categories: ExamCategory[];
  onSubmit: (formData: LiveTestFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddLiveTestForm({ 
  categories, 
  onSubmit, 
  isSubmitting 
}: AddLiveTestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    examUrl: '',
    examType: 'live',
    isFree: true,
    durationHours: '',
    durationMinutes: '',
    totalMarks: '',
    categoryId: '',
    scheduledDate: '',
    scheduledTime: '',
    endDate: '',
    endTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fix duration calculation to handle cases where only hours or only minutes are selected
    const hours = formData.durationHours ? parseInt(formData.durationHours) : 0;
    const minutes = formData.durationMinutes ? parseInt(formData.durationMinutes) : 0;
    const duration = (hours > 0 || minutes > 0) ? (hours * 60 + minutes) : null;
    
    const scheduledAt = formData.scheduledDate && formData.scheduledTime ?
      `${formData.scheduledDate}T${formData.scheduledTime}` : '';
    
    const examEndTime = formData.endDate && formData.endTime ?
      `${formData.endDate}T${formData.endTime}` : '';
    
    await onSubmit({
      ...formData,
      duration,
      totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : null,
      scheduledAt,
      examEndTime
    });

    // Reset form
    setFormData({
      title: '',
      examUrl: '',
      examType: 'live',
      isFree: true,
      durationHours: '',
      durationMinutes: '',
      totalMarks: '',
      categoryId: '',
      scheduledDate: '',
      scheduledTime: '',
      endDate: '',
      endTime: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Add Live Test</h3>
        <p className="text-sm text-purple-700">Schedule live tests with specific timing and category selection.</p>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., SSC CGL Live Mock Test"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select Hours</option>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">0</option>
            {[15, 30, 45].map(minute => (
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
            min="1"
            required
            value={formData.totalMarks}
            onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test URL *
        </label>
        <input
          type="url"
          required
          value={formData.examUrl}
          onChange={(e) => setFormData({...formData, examUrl: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://example.com/live-test-link"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.scheduledDate}
            onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Start Time *
          </label>
          <input
            type="time"
            required
            value={formData.scheduledTime}
            onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam End Date *
          </label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min={formData.scheduledDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam End Time *
          </label>
          <input
            type="time"
            required
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">📋 Live Test Guidelines</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Students will be notified if they try to access the exam after the end time</li>
          <li>• Make sure the end time is after the start time</li>
          <li>• Consider buffer time for late submissions</li>
        </ul>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFree}
            onChange={(e) => setFormData({...formData, isFree: e.target.checked})}
            className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Free Test</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Live Test'}
        </button>
      </div>
    </form>
  );
} 