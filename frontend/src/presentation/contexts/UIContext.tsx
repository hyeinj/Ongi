'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIState {
  introStepShown: boolean;
  setIntroStepShown: (shown: boolean) => void;
}

const UIContext = createContext<UIState | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [introStepShown, setIntroStepShown] = useState(false);

  const value: UIState = {
    introStepShown,
    setIntroStepShown,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
