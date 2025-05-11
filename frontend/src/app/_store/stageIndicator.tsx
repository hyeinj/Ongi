'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  StageIndicatorState,
  defaultState,
  StageIndicatorProviderProps,
} from '@/entity/StageIndicator';

const StageIndicatorContext = createContext<StageIndicatorState>(defaultState);

export const useStageIndicator = () => useContext(StageIndicatorContext);

export const StageIndicatorProvider: React.FC<StageIndicatorProviderProps> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [totalStages, setTotalStages] = useState(3);

  return (
    <StageIndicatorContext.Provider
      value={{
        currentStage,
        totalStages,
        setCurrentStage: (stage: number) => setCurrentStage(stage),
        setTotalStages: (stages: number) => setTotalStages(stages),
      }}
    >
      {children}
    </StageIndicatorContext.Provider>
  );
};
