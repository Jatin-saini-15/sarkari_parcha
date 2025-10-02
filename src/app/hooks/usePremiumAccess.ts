'use client';

import { useState, useCallback } from 'react';
import { useUserPremium } from './useUserPremium';

export const usePremiumAccess = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { isPremium, isAdmin } = useUserPremium();

  const checkPremiumAccess = useCallback((isFree: boolean = false) => {
    // Admin can access everything
    if (isAdmin) return true;
    
    // Free content can be accessed by everyone
    if (isFree) return true;
    
    // Premium content requires premium membership
    return isPremium;
  }, [isAdmin, isPremium]);

  const handlePremiumAction = useCallback((isFree: boolean = false, action: () => void) => {
    if (checkPremiumAccess(isFree)) {
      action();
    } else {
      setShowUpgradeModal(true);
    }
  }, [checkPremiumAccess]);

  const openUpgradeModal = useCallback(() => {
    setShowUpgradeModal(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  const handleUpgradeToPremium = useCallback(() => {
    setShowUpgradeModal(false);
    setShowPremiumModal(true);
  }, []);

  const closePremiumModal = useCallback(() => {
    setShowPremiumModal(false);
  }, []);

  return {
    isPremium,
    isAdmin,
    checkPremiumAccess,
    handlePremiumAction,
    showUpgradeModal,
    showPremiumModal,
    openUpgradeModal,
    closeUpgradeModal,
    handleUpgradeToPremium,
    closePremiumModal
  };
}; 