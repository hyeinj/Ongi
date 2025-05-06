'use client';

import { useState, useEffect } from 'react';
import LetterExerciseBackground from '../_components/LetterExerciseBackground';
import { LetterProvider } from '../_components/LetterExercise/LetterContext';
import IntroStep from '../_components/LetterExercise/IntroStep';
import GuideStep from '../_components/LetterExercise/GuideStep';
import LetterWritingStep from '../_components/LetterExercise/LetterWritingStep';
import FeedbackStep from '../_components/LetterExercise/FeedbackStep';
import LetterExerciseStep from '../_components/LetterExercise/LetterExerciseStep';

export default function LetterExercise() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <LetterExerciseBackground>
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-white">Loading...</p>
        </div>
      </LetterExerciseBackground>
    );
  }

  const steps = [
    { id: 1, component: <IntroStep /> },
    { id: 2, component: <GuideStep /> },
    { id: 3, component: <LetterWritingStep /> },
    { id: 4, component: <FeedbackStep /> },
  ];

  return (
    <LetterProvider>
      <LetterExerciseBackground>
        <LetterExerciseStep steps={steps} />
      </LetterExerciseBackground>
    </LetterProvider>
  );
}
