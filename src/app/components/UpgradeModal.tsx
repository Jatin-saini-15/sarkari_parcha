'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full relative"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Premium Icon */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Access Required</h2>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">
              This content is available exclusively for premium members. Upgrade now to unlock unlimited access to all tests, PYQs, and premium features.
            </p>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">What you&apos;ll get with Premium:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Unlimited access to 5000+ tests & PYQs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>All government exam categories</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Detailed performance analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>24/7 expert support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Ad-free experience</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                Upgrade to Premium
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure upgrade with instant activation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 