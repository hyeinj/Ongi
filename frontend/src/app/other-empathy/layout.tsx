'use client';

import Header from '@/app/_components/Header';
import { useStageIndicator } from '@/store/stageContext';
import { useEffect } from 'react';
import otherEmpathyBackground from '@/assets/images/other-empathy-bg.png';
import BackgroundImage from '../_components/ImageBackground';
import imgNightTree from '@/assets/images/img-night-tree-bg.png';
import Image from 'next/image';
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
      <Image src={imgNightTree} alt="배경 이미지" className="absolute bottom-0 left-0 -z-10" />
    </BackgroundImage>
  );
}
