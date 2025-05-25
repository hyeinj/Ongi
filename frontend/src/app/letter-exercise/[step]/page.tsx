'use client';

import React from 'react';
import IntroStep from '@/app/_components/letterExercise/IntroStep';
import WritingStep from '@/app/_components/letterExercise/WritingStep';
import FeedbackStep from '@/app/_components/letterExercise/FeedbackStep';
import { useParams } from 'next/navigation';
import { UIProvider } from '@/ui/contexts/UIContext';

// 스텝 컴포넌트들을 매핑합니다.
const stepComponents: {
  [key: string]: React.ComponentType;
} = {
  '1': IntroStep,
  '2': WritingStep,
  '3': FeedbackStep,
};

export default function LetterExercisePage() {
  const params = useParams<{ step: string }>();
  const StepComponent = stepComponents[params.step];

  if (!StepComponent) {
    return (
      <div className="text-white text-center py-10">
        잘못된 접근입니다. 유효한 스텝 번호를 확인해주세요.
      </div>
    );
  }

  return (
    <UIProvider>
      <div className="relative flex flex-col min-h-screen w-full">
        <StepComponent />
      </div>
    </UIProvider>
  );
}
