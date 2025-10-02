'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { usePremiumModal } from '../components/PremiumModalContext';

interface Subscription {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount?: number;
  currency?: string;
  couponCode?: string;
  couponType?: string;
  createdAt: string;
}

interface SubscriptionData {
  user: {
    isPremium: boolean;
    premiumUntil: string | null;
  };
  currentSubscription: Subscription | null;
  remainingDays: number;
  subscriptionHistory: Subscription[];
  totalSubscriptions: number;
}

export default function SubscriptionPage() {
  const { status } = useSession();
  const router = useRouter();
  const { showModal } = usePremiumModal();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchSubscriptionData();
      
      // Set up interval to refresh data every 30 seconds for live updates
      const interval = setInterval(fetchSubscriptionData, 30000);
      return () => clearInterval(interval);
    }
  }, [status, router]);

  // Also refresh when component becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && status === 'authenticated') {
        fetchSubscriptionData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [status]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/user/subscription', {
        cache: 'no-cache', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    showModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    // Handle timestamp-based admin types
    if (type.startsWith('ADMIN_GRANTED_')) return 'Admin Granted';
    if (type.startsWith('ADMIN_REMOVED_')) return 'Admin Removed';
    if (type.startsWith('ADMIN_ADD_')) return 'Admin Added Days';
    if (type.startsWith('ADMIN_REMOVE_')) return 'Admin Removed Days';
    
    // Handle timestamp-based coupon types
    if (type.startsWith('COUPON_FREE499_')) return 'Premium Subscription (FREE499)';
    if (type.startsWith('COUPON_')) {
      const couponMatch = type.match(/^COUPON_([^_]+)_/);
      return couponMatch ? `Premium Subscription (${couponMatch[1]})` : 'Premium Subscription';
    }
    if (type.startsWith('PREMIUM_')) return 'Premium Subscription';
    
    switch (type) {
      case 'FREE_COUPON': return 'Premium Subscription (Coupon)';
      case 'PAID_MONTHLY': return 'Monthly Premium';
      case 'PAID_YEARLY': return 'Yearly Premium';
      case 'ADMIN_MODIFIED': return 'Admin Modified';
      case 'ADMIN_GRANTED': return 'Admin Granted';
      case 'COUPON_APPLIED': return 'Premium Subscription (Coupon)';
      default: return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getActionDescription = (subscription: Subscription) => {
    // Handle timestamp-based admin types
    if (subscription.type.startsWith('ADMIN_ADD_') && subscription.couponCode) {
      const days = subscription.couponCode.match(/(\d+)DAYS/)?.[1];
      return `Admin added ${days} days`;
    }
    if (subscription.type.startsWith('ADMIN_REMOVE_') && subscription.couponCode) {
      const days = subscription.couponCode.match(/(\d+)DAYS/)?.[1];
      return `Admin removed ${days} days`;
    }
    if (subscription.type.startsWith('ADMIN_GRANTED_')) {
      return 'Admin granted premium access';
    }
    if (subscription.type.startsWith('ADMIN_REMOVED_')) {
      return 'Admin removed premium access';
    }
    
    // Handle legacy types
    if (subscription.type === 'ADMIN_MODIFIED' && subscription.couponCode) {
      if (subscription.couponCode.includes('ADMIN_ADD')) {
        const days = subscription.couponCode.match(/(\d+)DAYS/)?.[1];
        return `Admin added ${days} days`;
      } else if (subscription.couponCode.includes('ADMIN_REMOVE')) {
        const days = subscription.couponCode.match(/(\d+)DAYS/)?.[1];
        return `Admin removed ${days} days`;
      }
    }
    return null;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your premium subscription and view your usage history</p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscriptionData?.user.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {subscriptionData?.user.isPremium ? 'Premium Active' : 'Free Plan'}
            </span>
          </div>

          {subscriptionData?.currentSubscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {subscriptionData.remainingDays}
                </div>
                <div className="text-sm text-gray-600">Days Remaining</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600 mb-1">
                  {getTypeLabel(subscriptionData.currentSubscription.type)}
                </div>
                <div className="text-sm text-gray-600">Plan Type</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600 mb-1">
                  {formatDate(subscriptionData.currentSubscription.endDate)}
                </div>
                <div className="text-sm text-gray-600">Expires On</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-4">Upgrade to premium to access all features</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleUpgradeClick}>
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Subscription History</h2>
            <span className="text-sm text-gray-500">
              {subscriptionData?.totalSubscriptions || 0} total subscriptions
            </span>
          </div>

          {subscriptionData?.subscriptionHistory && subscriptionData.subscriptionHistory.length > 0 ? (
            <div className="space-y-4">
              {subscriptionData.subscriptionHistory.map((subscription) => (
                <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {getTypeLabel(subscription.type)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                      {getActionDescription(subscription) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getActionDescription(subscription)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(subscription.createdAt)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <div className="font-medium">{formatDate(subscription.startDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <div className="font-medium">{formatDate(subscription.endDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <div className="font-medium">
                        {subscription.amount 
                          ? `₹${subscription.amount}` 
                          : subscription.couponCode 
                            ? `Free (${subscription.couponCode})` 
                            : 'Free'
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-medium">
                        {Math.ceil((new Date(subscription.endDate).getTime() - new Date(subscription.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscription History</h3>
              <p className="text-gray-500">Your subscription history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 