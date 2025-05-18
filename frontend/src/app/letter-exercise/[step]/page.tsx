'use client';

import React from 'react';
import ReadingStep from '@/app/_components/letterExercise/IntroStep';
import WritingStep from '@/app/_components/letterExercise/GuideStep';
import FeedbackStep from '@/app/_components/letterExercise/FeedbackStep';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 스텝 컴포넌트들을 매핑합니다.
const stepComponents: { [key: string]: React.ComponentType } = {
  '1': ReadingStep,
  '2': WritingStep,
  '3': FeedbackStep,
  // 필요에 따라 더 많은 스텝을 추가할 수 있습니다.
};

// 총 스텝의 수 (네비게이션을 위해)
const TOTAL_STEPS = Object.keys(stepComponents).length;

export default function LetterExercisePage() {
  const params = useParams<{ step: string }>();
  const currentStepNumber = parseInt(params.step, 10);
  const StepComponent = stepComponents[params.step];

  if (!StepComponent) {
    return (
      <div className="text-white text-center py-10">
        잘못된 접근입니다. 유효한 스텝 번호를 확인해주세요.
      </div>
    );
  }

  const prevStep = currentStepNumber > 1 ? `/letter-exercise/${currentStepNumber - 1}` : null;
  const nextStep =
    currentStepNumber < TOTAL_STEPS ? `/letter-exercise/${currentStepNumber + 1}` : null;

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      {/* 현재 스텝 컴포넌트 렌더링 */}
      <StepComponent />

      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-12 w-full flex justify-between px-8 z-50">
        {prevStep ? (
          <Link href={prevStep}>
            <div className="p-4.5 rounded-full bg-[#EEEEEE] active:bg-[#DEDEDE] shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </Link>
        ) : (
          <div></div> // 이전 버튼이 없을 때 공간 차지
        )}

        {nextStep ? (
          <Link href={nextStep}>
            <div className="p-4.5 rounded-full bg-[#EEEEEE] active:bg-[#DEDEDE] shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ) : (
          // 마지막 스텝에서는 다른 버튼 (예: 완료)을 표시하거나 아무것도 표시하지 않을 수 있습니다.
          // 여기서는 일단 빈 div로 둡니다.
          <div></div>
        )}
      </div>
    </div>
  );
}
