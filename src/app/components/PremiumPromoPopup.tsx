'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { usePremiumModal } from './PremiumModalContext';

// Feature flag - set this to control popup visibility
const SHOW_PREMIUM_PROMO = true;

interface PremiumPromoPopupProps {
  onClose?: () => void;
}

export default function PremiumPromoPopup({ onClose }: PremiumPromoPopupProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { showModal } = usePremiumModal();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if feature flag is disabled
    if (!SHOW_PREMIUM_PROMO) return;

    // Check if user has dismissed the popup before
    const hasUserDismissed = localStorage.getItem('premiumPopupDismissed') === 'true';
    if (hasUserDismissed) return;

    // Don't show on auth pages
    if (pathname?.includes('/auth/') || pathname?.includes('/signin') || pathname?.includes('/signup')) {
      return;
    }

    // Check user status
    if (status === 'authenticated' && session?.user) {
      // @ts-expect-error - NextAuth session type
      const userRole = session.user.role;
      if (userRole === 'admin' || userRole === 'owner') {
        setIsAdmin(true);
        return; // Don't show to admins
      }
      
      checkPremiumStatus();
    } else if (status === 'unauthenticated') {
      // Show to non-logged in users after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Auto-dismiss after 5 seconds if user does nothing
        const autoDismissTimer = setTimeout(() => {
          handleClose();
        }, 5000);
        
        return () => clearTimeout(autoDismissTimer);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [session, status, pathname]);

  const checkPremiumStatus = async () => {
    try {
      const response = await fetch('/api/user/premium-status');
      if (response.ok) {
        const data = await response.json();
        setIsPremium(data.isPremium);
        
        // Show popup only if user is not premium
        if (!data.isPremium) {
          const timer = setTimeout(() => {
            setIsVisible(true);
            
            // Auto-dismiss after 5 seconds if user does nothing
            const autoDismissTimer = setTimeout(() => {
              handleClose();
            }, 5000);
            
            return () => clearTimeout(autoDismissTimer);
          }, 4000); // Show after 4 seconds for logged in users
          
          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handleClose = () => {
    // Remember that user dismissed the popup
    localStorage.setItem('premiumPopupDismissed', 'true');
    setIsVisible(false);
    onClose?.();
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClaimFree = () => {
    // Hide this popup immediately and remember dismissal
    localStorage.setItem('premiumPopupDismissed', 'true');
    setIsVisible(false);
    
    if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      router.push('/auth/signin?message=Login to claim your free premium access');
    } else if (status === 'authenticated') {
      // Open premium purchase modal if authenticated
      showModal();
    }
  };

  // Don't show if feature flag is disabled, user is premium, admin, or popup is not visible
  if (!SHOW_PREMIUM_PROMO || isPremium || isAdmin || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isVisible && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Popup */}
      <div className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-96 max-w-[calc(100vw-2rem)]'
      }`}>
        <div className={`bg-white rounded-xl shadow-xl border border-gray-200 ${
          isMinimized ? 'p-2' : 'p-5'
        }`}>
          {isMinimized ? (
            // Minimized state - just an icon
            <button
              onClick={handleMinimize}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          ) : (
            // Expanded state
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">🎉 Limited Time!</h3>
                    <p className="text-sm text-gray-600">Free Premium Access</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  🚀 <strong>Launch Special:</strong> Get premium access completely FREE! 
                  Access thousands of mock tests, PYQs, and live tests for all government exams.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-blue-800 font-semibold mb-2">What you&apos;ll get:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600">✓</span>
                      <span>5000+ Mock Tests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600">✓</span>
                      <span>All PYQ Papers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600">✓</span>
                      <span>Live Test Series</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600">✓</span>
                      <span>Detailed Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleClaimFree}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold text-sm text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Claim Free Premium
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Later
                </button>
              </div>

              {/* Fine print */}
              <p className="text-gray-500 text-xs mt-3 text-center">
                ⏰ Limited time offer • No credit card required
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Export the feature flag for external control
export { SHOW_PREMIUM_PROMO }; 