'use client';

import { useState, useEffect } from 'react';

interface AdminSettings {
  promotionalMessage: string;
  isPromotionActive: boolean;
}

export default function PromotionalBanner() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching promotional settings:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't show banner if settings not loaded, promotion not active, or user closed it
  if (!settings || !settings.isPromotionActive || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
              🎉 LIMITED OFFER
            </span>
            <p className="text-sm md:text-base font-medium text-center">
              {settings.promotionalMessage}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 