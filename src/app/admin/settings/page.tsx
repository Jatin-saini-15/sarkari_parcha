'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdminSettings {
  id: string;
  defaultFreeDuration: number;
  defaultPremiumDuration: number;
  promotionalMessage: string;
  isPromotionActive: boolean;
  maxFreeTrials: number;
  referralBonus: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    defaultFreeDuration: 90,
    defaultPremiumDuration: 365,
    promotionalMessage: 'Limited Time Offer: All Exams Test Series for 1 Year @ ₹0',
    isPromotionActive: true,
    maxFreeTrials: 1,
    referralBonus: 30,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // @ts-expect-error - NextAuth session type
    const userRole = session.user?.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      router.push('/');
      return;
    }

    fetchSettings();
  }, [session, status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setFormData({
          defaultFreeDuration: data.settings.defaultFreeDuration,
          defaultPremiumDuration: data.settings.defaultPremiumDuration,
          promotionalMessage: data.settings.promotionalMessage,
          isPromotionActive: data.settings.isPromotionActive,
          maxFreeTrials: data.settings.maxFreeTrials,
          referralBonus: data.settings.referralBonus,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure subscription durations, promotional messages, and other platform settings.
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 border border-green-200 text-green-700'
              : 'bg-red-100 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Subscription Duration Settings */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">New User Subscription Duration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="defaultFreeDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Grant Duration (days)
                  </label>
                  <input
                    type="number"
                    id="defaultFreeDuration"
                    name="defaultFreeDuration"
                    min="1"
                    max="365"
                    value={formData.defaultFreeDuration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Duration given when admin manually grants premium access to users
                  </p>
                </div>

                <div>
                  <label htmlFor="defaultPremiumDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    New User Premium Duration (days)
                  </label>
                  <input
                    type="number"
                    id="defaultPremiumDuration"
                    name="defaultPremiumDuration"
                    min="1"
                    max="1095"
                    value={formData.defaultPremiumDuration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Duration for new users who subscribe (affects future signups, not existing users)
                  </p>
                </div>
              </div>
            </div>

            {/* Promotional Settings */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Promotional Settings</h2>
              
              <div className="mb-4">
                <label htmlFor="promotionalMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Promotional Message
                </label>
                <textarea
                  id="promotionalMessage"
                  name="promotionalMessage"
                  rows={3}
                  value={formData.promotionalMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promotional message..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  This message will be displayed on the homepage banner
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPromotionActive"
                  name="isPromotionActive"
                  checked={formData.isPromotionActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPromotionActive" className="ml-2 block text-sm text-gray-700">
                  Enable promotional banner
                </label>
              </div>
            </div>

            {/* User Limits & Bonuses */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Limits & Bonuses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxFreeTrials" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Premium Subscriptions per User
                  </label>
                  <input
                    type="number"
                    id="maxFreeTrials"
                    name="maxFreeTrials"
                    min="1"
                    value={formData.maxFreeTrials}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of premium subscriptions a user can purchase/claim
                  </p>
                </div>

                <div>
                  <label htmlFor="referralBonus" className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Bonus (days)
                  </label>
                  <input
                    type="number"
                    id="referralBonus"
                    name="referralBonus"
                    min="0"
                    max="365"
                    value={formData.referralBonus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Bonus days given for successful referrals
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Current Settings Info */}
        {settings && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Current Settings Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Admin Grant Duration:</span>
                <span className="ml-2 text-blue-700">{settings.defaultFreeDuration} days</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">New User Premium Duration:</span>
                <span className="ml-2 text-blue-700">{settings.defaultPremiumDuration} days</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Max Subscriptions per User:</span>
                <span className="ml-2 text-blue-700">{settings.maxFreeTrials}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Referral Bonus:</span>
                <span className="ml-2 text-blue-700">{settings.referralBonus} days</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Promotion:</span>
                <span className={`ml-2 ${settings.isPromotionActive ? 'text-green-700' : 'text-red-700'}`}>
                  {settings.isPromotionActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Last Updated:</span>
                <span className="ml-2 text-blue-700">
                  {new Date(settings.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 