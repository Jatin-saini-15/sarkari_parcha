'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PremiumConfig {
  id: number;
  subscriptionDurationDays: number;
  originalPrice: number;
  discountPercentage: number;
  couponCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PremiumConfigPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState<PremiumConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    subscriptionDurationDays: 90,
    originalPrice: 499,
    discountPercentage: 100,
    couponCode: 'FREE499',
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user has admin/owner role
    // @ts-expect-error - NextAuth session type
    const userRole = session.user?.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      router.push('/dashboard');
      return;
    }
    
    fetchConfig();
  }, [session, status, router]);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/premium-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setFormData({
          subscriptionDurationDays: data.config.subscriptionDurationDays,
          originalPrice: data.config.originalPrice,
          discountPercentage: data.config.discountPercentage,
          couponCode: data.config.couponCode,
          isActive: data.config.isActive
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/premium-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        alert('Configuration saved successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateFinalPrice = () => {
    return formData.originalPrice * (1 - formData.discountPercentage / 100);
  };

  const formatDuration = (days: number) => {
    if (days < 30) {
      return `${days} days`;
    } else if (days < 365) {
      const months = Math.round(days / 30);
      return `${months} month${months > 1 ? 's' : ''} (${days} days)`;
    } else {
      const years = Math.round(days / 365);
      return `${years} year${years > 1 ? 's' : ''} (${days} days)`;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading premium configuration...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Premium Configuration</h1>
              <p className="text-gray-600 mt-1">
                Manage premium subscription settings and pricing
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Configuration Overview */}
        {config && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatDuration(config.subscriptionDurationDays)}
                </div>
                <div className="text-sm text-gray-600">Subscription Duration</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{config.originalPrice * (1 - config.discountPercentage / 100)}
                </div>
                <div className="text-sm text-gray-600">Final Price</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {config.discountPercentage}%
                </div>
                <div className="text-sm text-gray-600">Discount</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600 mb-1">
                  {config.couponCode}
                </div>
                <div className="text-sm text-gray-600">Coupon Code</div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Configuration</h2>
          
          <div className="space-y-6">
            {/* Subscription Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Duration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={formData.subscriptionDurationDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      subscriptionDurationDays: parseInt(e.target.value) || 1
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Days (1-3650)</p>
                </div>
                <div className="md:col-span-2 flex items-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Duration:</strong> {formatDuration(formData.subscriptionDurationDays)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Configuration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      originalPrice: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({
                      ...formData,
                      discountPercentage: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Final Price:</strong> ₹{calculateFinalPrice().toFixed(2)}
                  {formData.discountPercentage === 100 && (
                    <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                      FREE
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={formData.couponCode}
                onChange={(e) => setFormData({
                  ...formData,
                  couponCode: e.target.value.toUpperCase()
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter coupon code"
              />
              <p className="text-xs text-gray-500 mt-1">
                Users will need to enter this code to get the discount
              </p>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({
                    ...formData,
                    isActive: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Configuration is active
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                When inactive, users won&apos;t be able to purchase premium subscriptions
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </div>

        {/* Impact Warning */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Configuration Impact</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Changes to this configuration will affect all new premium subscriptions. 
                Existing subscriptions will not be modified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 