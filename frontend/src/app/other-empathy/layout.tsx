'use client';

import Header from '@/app/_components/Header';
import otherEmpathyBackground from '@/assets/images/other-empathy-bg.png';
import BackgroundImage from '../_components/ImageBackground';
import imgNightTree from '@/assets/images/img-night-tree-bg.png';
import Image from 'next/image';
export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundImage backgroundImage={otherEmpathyBackground}>
      <div className="flex flex-col h-full w-full">
        <Header stage={3} />
        {children}
      </div>
      <Image src={imgNightTree} alt="배경 이미지" className="absolute bottom-0 left-0 -z-10" />
    </BackgroundImage>
  );
}
