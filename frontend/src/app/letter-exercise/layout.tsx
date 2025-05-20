'use client';

import Header from '@/app/_components/Header';
import { useStageIndicator } from '@/store/stageContext';
import { useEffect } from 'react';
import LetterExerciseBackground from '../_components/ImageBackground';
import { LetterProvider } from '../../store/LetterContext';
import backgroundImage from '@/assets/images/letterExerciseBackground.png';

export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  const { setCurrentStage } = useStageIndicator();

  useEffect(() => {
    setCurrentStage(2);
  }, [setCurrentStage]);

  return (
    <LetterProvider>
      <LetterExerciseBackground backgroundImage={backgroundImage}>
        <Header />
        {children}
      </LetterExerciseBackground>
    </LetterProvider>
  );
}
