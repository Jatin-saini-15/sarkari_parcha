'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface DeleteResult {
  status: number;
  ok: boolean;
  data: {
    success?: boolean;
    message?: string;
    error?: string;
    details?: string;
  };
}

export default function TestDeletePage() {
  const searchParams = useSearchParams();
  const [testId, setTestId] = useState('');
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTestId(id);
    }
  }, [searchParams]);

  const handleDelete = async () => {
    if (!testId) {
      setError('Please enter a test ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/mock-tests/${testId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Delete API</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Mock Test ID:</label>
        <input
          type="text"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter test ID"
        />
      </div>
      
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Deleting...' : 'Delete Test'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Status: {result.status}</p>
            <p>Success: {result.ok ? 'Yes' : 'No'}</p>
            <pre className="mt-2 bg-gray-800 text-white p-2 rounded overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 