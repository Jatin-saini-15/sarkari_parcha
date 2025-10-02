'use client';

interface ExamTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function ExamTypeFilter({ selectedType, onTypeChange }: ExamTypeFilterProps) {
  const examTypes = [
    { value: 'all', label: 'All Exams', color: 'bg-gray-100 text-gray-800' },
    { value: 'pyq', label: 'Previous Year Questions', color: 'bg-green-100 text-green-800' },
    { value: 'live', label: 'Live Tests', color: 'bg-purple-100 text-purple-800' },
    { value: 'mock', label: 'Mock Tests', color: 'bg-blue-100 text-blue-800' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {examTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeChange(type.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === type.value
              ? 'bg-blue-600 text-white'
              : `${type.color} hover:bg-opacity-80`
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
} 