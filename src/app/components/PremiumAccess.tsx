'use client';

import { useState } from 'react';
import { useUserPremium } from '../hooks/useUserPremium';

interface PremiumAccessProps {
  children: React.ReactNode;
  isPremiumContent: boolean;
  fallback?: React.ReactNode;
  onPremiumRequired?: () => void;
}

export default function PremiumAccess({ 
  children, 
  isPremiumContent, 
  fallback,
  onPremiumRequired 
}: PremiumAccessProps) {
  const { isPremium, isAdmin, isAuthenticated } = useUserPremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Admin users can access everything
  if (isAdmin) {
    return <>{children}</>;
  }

  // If content is free, show it
  if (!isPremiumContent) {
    return <>{children}</>;
  }

  // If user is premium, show content
  if (isPremium) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default behavior: show premium lock
  const handlePremiumClick = () => {
    if (onPremiumRequired) {
      onPremiumRequired();
    } else {
      setShowPremiumModal(true);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
          <button
            onClick={handlePremiumClick}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {isAuthenticated ? 'Upgrade to Premium' : 'Login for Premium'}
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Content</h3>
              <p className="text-gray-600 mb-6">
                This content is available for premium users only. Upgrade to access all premium features and unlimited content.
              </p>
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors">
                      Upgrade to Premium
                    </button>
                    <button 
                      onClick={() => setShowPremiumModal(false)}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => window.location.href = '/auth/signin'}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      Sign In / Sign Up
                    </button>
                    <button 
                      onClick={() => setShowPremiumModal(false)}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Browse Free Content
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 