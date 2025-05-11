'use client';

import Header from '@/app/_components/Header';
import { useStageIndicator } from '@/app/_store/stageIndicator';
import { useEffect } from 'react';
export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  const { setCurrentStage } = useStageIndicator();

  useEffect(() => {
    setCurrentStage(2);
  }, [setCurrentStage]);

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
