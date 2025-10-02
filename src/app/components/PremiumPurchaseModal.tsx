'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PremiumConfig {
  subscriptionDurationDays: number;
  originalPrice: number;
  discountPercentage: number;
  couponCode: string;
  isActive: boolean;
}

export default function PremiumPurchaseModal({ isOpen, onClose }: PremiumPurchaseModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [config, setConfig] = useState<PremiumConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchPremiumConfig();
    }
  }, [isOpen]);

  const fetchPremiumConfig = async () => {
    try {
      const response = await fetch('/api/admin/premium-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setCouponCode(''); // Reset coupon code when config loads
        setCouponApplied(false);
      } else {
        console.error('Failed to fetch premium config, using fallback');
        // Fallback to default config
        setConfig({
          subscriptionDurationDays: 90,
          originalPrice: 499,
          discountPercentage: 100,
          couponCode: 'FREE499',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error fetching premium config:', error);
      // Fallback to default config
      setConfig({
        subscriptionDurationDays: 90,
        originalPrice: 499,
        discountPercentage: 100,
        couponCode: 'FREE499',
        isActive: true
      });
    }
  };

  const applyCoupon = () => {
    if (!config) return;
    
    if (couponCode.toUpperCase() === config.couponCode.toUpperCase()) {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Please check and try again.');
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
  };

  const getFinalPrice = () => {
    if (!config) return 0;
    if (couponApplied) {
      return config.originalPrice * (1 - config.discountPercentage / 100);
    }
    return config.originalPrice;
  };

  const formatDuration = (days: number) => {
    if (days < 30) {
      return `${days} days`;
    } else if (days < 365) {
      const months = Math.round(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.round(days / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const handlePayment = async () => {
    if (!config) return;
    
    // Only allow payment if coupon is applied and results in significant discount
    if (!couponApplied || getFinalPrice() > 50) {
      alert('Please apply a valid coupon to activate premium membership!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create subscription record using new API
      const response = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'FREE_COUPON',
          duration: config.subscriptionDurationDays,
          couponCode: couponApplied ? couponCode : null,
          paymentDetails: {
            amount: getFinalPrice(),
            currency: 'INR'
          }
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setShowConfetti(true);
        
        // Start countdown after a brief pause to let user read the message
        setTimeout(() => {
          setCountdown(5);
          
          // Start the countdown timer
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                // Log out when countdown reaches 0
                signOut({ 
                  callbackUrl: '/auth/signin?message=Premium activated! Please log in again to access your premium features.' 
                });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 2000); // Wait 2 seconds before starting countdown
      } else {
        throw new Error('Subscription creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setCouponCode('');
    setCouponApplied(false);
    setIsProcessing(false);
    setIsSuccess(false);
    setShowConfetti(false);
    setCountdown(0);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  if (!config) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading premium options...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-60">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isSuccess ? (
            // Success Animation
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                🎉 Premium Activated!
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-600 mb-6"
              >
                Your {formatDuration(config.subscriptionDurationDays)} premium membership is now active! You&apos;ll be logged out to refresh your account. Please log back in to access your premium features.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4"
              >
                <h3 className="font-semibold text-gray-800 mb-2">What you now have access to:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 5000+ Mock Tests & PYQs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> All Government Exam Categories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Detailed Analysis & Reports
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 24/7 Expert Support
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="text-sm text-gray-500"
              >
                {countdown > 0 ? (
                  <>Logging out in {countdown} seconds to refresh your account...</>
                ) : (
                  'Logging you out to refresh your account...'
                )}
              </motion.div>
            </motion.div>
          ) : (
            // Main Modal Content
            <div className="p-6">
              {/* Header with better icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Upgrade to Premium</h2>
                <p className="text-gray-600">Unlock unlimited access to all features</p>
              </div>

              {/* Available Coupons Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">🎁</span> Available Offers
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{config.couponCode}</div>
                        <div className="text-sm text-gray-600">
                          {config.discountPercentage}% OFF • {formatDuration(config.subscriptionDurationDays)} Access
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCouponCode(config.couponCode);
                          setCouponApplied(true);
                        }}
                        disabled={couponApplied && couponCode === config.couponCode}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          couponApplied && couponCode === config.couponCode
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {couponApplied && couponCode === config.couponCode ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Premium Membership</h3>
                  <span className="text-sm text-green-600 font-medium">{formatDuration(config.subscriptionDurationDays)}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Price:</span>
                    <span className={`${couponApplied ? 'line-through text-gray-400' : 'font-bold text-lg'}`}>
                      ₹{config.originalPrice}
                    </span>
                  </div>
                  
                  {couponApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center"
                    >
                      <span className="text-green-600">Discount Applied:</span>
                      <span className="font-bold text-lg text-green-600">-₹{config.originalPrice * (config.discountPercentage / 100)}</span>
                    </motion.div>
                  )}
                  
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total Amount:</span>
                    <span className="font-bold text-2xl text-blue-600">₹{getFinalPrice()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>5000+ Tests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>All Categories</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎫</span> Apply Coupon Code
                </h3>
                
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-green-700 font-medium">Coupon &ldquo;{couponCode}&rdquo; applied!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Payment Button - Only enabled with coupon */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !couponApplied || !config.isActive}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${
                  couponApplied && config.isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Activating Premium...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">
                      {!config.isActive 
                        ? 'Premium Subscriptions Temporarily Disabled'
                        : couponApplied 
                          ? `Activate Premium for ₹${getFinalPrice()}! 🎉` 
                          : 'Apply Coupon to Continue'
                      }
                    </span>
                    {couponApplied && config.isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure activation powered by industry standards</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 