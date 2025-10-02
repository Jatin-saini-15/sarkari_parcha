'use client';

import React, { createContext, useContext, useState } from 'react';
import PremiumPurchaseModal from './PremiumPurchaseModal';

interface PremiumModalContextType {
  showModal: () => void;
  hideModal: () => void;
  isOpen: boolean;
}

const PremiumModalContext = createContext<PremiumModalContextType | undefined>(undefined);

export const usePremiumModal = () => {
  const context = useContext(PremiumModalContext);
  if (!context) {
    throw new Error('usePremiumModal must be used within a PremiumModalProvider');
  }
  return context;
};

interface PremiumModalProviderProps {
  children: React.ReactNode;
}

export const PremiumModalProvider = ({ children }: PremiumModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(true);
  };
  
  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <PremiumModalContext.Provider value={{ showModal, hideModal, isOpen }}>
      {children}
      <PremiumPurchaseModal isOpen={isOpen} onClose={hideModal} />
    </PremiumModalContext.Provider>
  );
}; 