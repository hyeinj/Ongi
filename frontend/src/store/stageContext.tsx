'use client';

import React, { createContext, useContext, useState } from 'react';
import { StageIndicatorState, defaultState, StageIndicatorProviderProps } from '@/entity/Stage';

const StageContext = createContext<StageIndicatorState>(defaultState);

export const useStageIndicator = () => useContext(StageContext);

// TODO: stageIndicator -> stageContext로 변경 마저 해야함.
export const StageProvider: React.FC<StageIndicatorProviderProps> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [totalStages, setTotalStages] = useState(3);

  return (
    <StageContext.Provider
      value={{
        currentStage,
        totalStages,
        setCurrentStage: (stage: number) => setCurrentStage(stage),
        setTotalStages: (stages: number) => setTotalStages(stages),
      }}
    >
      {children}
    </StageContext.Provider>
  );
};
