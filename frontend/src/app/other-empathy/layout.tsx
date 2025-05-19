'use client';

import Header from '@/app/_components/Header';
import { useStageIndicator } from '@/store/stageContext';
import { useEffect } from 'react';
import otherEmpathyBackground from '@/assets/images/other-empathy-bg.png';
import BackgroundImage from '../_components/ImageBackground';
export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  const { setCurrentStage } = useStageIndicator();

  useEffect(() => {
    setCurrentStage(3);
  }, [setCurrentStage]);

  return (
    <BackgroundImage backgroundImage={otherEmpathyBackground}>
      <div className="flex flex-col h-full w-full">
        <Header />
        {children}
      </div>
    </BackgroundImage>
  );
}
