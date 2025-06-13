'use client';

import React from 'react';
import LetterStep from '@/app/_components/otherEmpathy/LetterStep';
import ReviewStep from '@/app/_components/otherEmpathy/ReviewStep';
import SumUpStep from '@/app/_components/otherEmpathy/SumUpStep';
import { useParams } from 'next/navigation';

// 스텝 컴포넌트들을 매핑합니다.
const stepComponents: {
  [key: string]: React.ComponentType;
} = {
  '1': LetterStep,
  '2': ReviewStep,
  '3': SumUpStep,

  // 필요에 따라 더 많은 스텝을 추가할 수 있습니다.
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
    <div className="flex flex-col w-full h-full">
      {/* 현재 스텝 컴포넌트 렌더링 */}
      <StepComponent />
    </div>
  );
}
