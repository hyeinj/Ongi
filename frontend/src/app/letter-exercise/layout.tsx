'use client';

import Header from '@/app/_components/Header';
import LetterExerciseBackground from '../_components/ImageBackground';
import backgroundImage from '@/assets/images/letterExerciseBackground.png';

export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  return (
    <LetterExerciseBackground backgroundImage={backgroundImage}>
      <Header />
      {children}
    </LetterExerciseBackground>
  );
}
