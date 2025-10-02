'use client';

import { useSession } from 'next-auth/react';
import { usePremiumModal } from './PremiumModalContext';

interface StartFreeTrialButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function StartFreeTrialButton({ 
  className = "px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-lg", 
  children 
}: StartFreeTrialButtonProps) {
  const { data: session } = useSession();
  const { showModal } = usePremiumModal();

  // @ts-expect-error - NextAuth session type
  const isPremium = session?.user?.isPremium;

  const handleClick = () => {
    if (!session) {
      // Redirect to signup if not logged in
      window.location.href = "/auth/signup";
    } else if (isPremium) {
      // Redirect to dashboard if already premium
      window.location.href = "/dashboard";
    } else {
      // Show premium modal for non-premium users
      showModal();
    }
  };

  const getButtonText = () => {
    if (!session) return "Get Started";
    if (isPremium) return "Explore Now";
    return "Start Free Trial";
  };

  return (
    <button onClick={handleClick} className={className}>
      {children || getButtonText()}
    </button>
  );
} 