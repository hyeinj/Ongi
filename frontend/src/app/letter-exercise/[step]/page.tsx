'use client';

import React from 'react';
import IntroStep from '@/app/_components/LetterExercise/IntroStep';
import GuideStep from '@/app/_components/LetterExercise/GuideStep';
import LetterWritingStep from '@/app/_components/LetterExercise/LetterWritingStep';
import FeedbackStep from '@/app/_components/LetterExercise/FeedbackStep';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 스텝 컴포넌트들을 매핑합니다.
const stepComponents: { [key: string]: React.ComponentType } = {
  '1': IntroStep,
  '2': GuideStep,
  '3': LetterWritingStep,
  '4': FeedbackStep,
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
      {/* 스텝 인디케이터 */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {Object.keys(stepComponents).map((key, index) => (
          <Link href={`/letter-exercise/${index + 1}`} key={`indicator-${index + 1}`}>
            <div
              className={`h-1 w-6 rounded-full cursor-pointer ${
                index + 1 === currentStepNumber ? 'bg-white' : 'bg-white/30'
              } hover:bg-white/50 transition-colors`}
            ></div>
          </Link>
        ))}
      </div>

      {/* 현재 스텝 컴포넌트 렌더링 */}
      <div className="flex-grow flex items-center justify-center">
        <StepComponent />
      </div>

      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-12 w-full flex justify-between px-8 z-50">
        {prevStep ? (
          <Link href={prevStep} legacyBehavior>
            <a className="p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
          </Link>
        ) : (
          <div></div> // 이전 버튼이 없을 때 공간 차지
        )}

        {nextStep ? (
          <Link href={nextStep} legacyBehavior>
            <a className="p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
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

// 기본 스텝을 1로 리디렉션하기 위한 페이지 (옵션)
// 또는 letter-exercise/page.tsx 를 만들어서 거기로 보내도 됩니다.
// 만약 /letter-exercise 접속 시 첫 스텝으로 보내고 싶다면,
// frontend/src/app/letter-exercise/page.tsx 파일을 만들어 다음과 같이 작성할 수 있습니다:
//
// import { redirect } from 'next/navigation';
// export default function LetterExerciseRootPage() {
//   redirect('/letter-exercise/1');
// }
