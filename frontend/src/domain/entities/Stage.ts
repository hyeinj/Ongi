import React from 'react';

export interface StageIndicatorState {
  currentStage: number;
  totalStages: number;
  setCurrentStage: (stage: number) => void;
  setTotalStages: (stages: number) => void;
}

export const defaultState: StageIndicatorState = {
  currentStage: 1,
  totalStages: 3,
  setCurrentStage: () => {},
  setTotalStages: () => {},
};

export interface StageIndicatorProviderProps {
  children: React.ReactNode;
}
