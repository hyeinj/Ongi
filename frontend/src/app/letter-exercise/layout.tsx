'use client';

import Header from '@/app/_components/Header';
import { useStageIndicator } from '@/app/_store/stageIndicator';
import { useEffect } from 'react';
import LetterExerciseBackground from '../_components/LetterExerciseBackground';
import { LetterProvider } from '../_store/LetterContext';

export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  const { setCurrentStage } = useStageIndicator();

  useEffect(() => {
    setCurrentStage(2);
  }, [setCurrentStage]);

  return (
    <LetterProvider>
      <LetterExerciseBackground>
        <Header />
        {children}
      </LetterExerciseBackground>
    </LetterProvider>
  );
}
