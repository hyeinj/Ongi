import React, { useState, ReactNode } from 'react';

type Step = {
  id: number;
  component: ReactNode;
};

interface LetterExerciseStepProps {
  steps: Step[];
}

export default function LetterExerciseStep({ steps }: LetterExerciseStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(''); // 'next' or 'prev'

  const goToStep = (stepIndex: number) => {
    if (isAnimating) return;

    const newDirection = stepIndex > currentStep ? 'next' : 'prev';
    setDirection(newDirection);
    setIsAnimating(true);

    // 실제 currentStep 변경은 애니메이션 시작 *후*에 일어나야
    // exit 애니메이션이 제대로 적용될 수 있음 (CSS transition group의 동작 방식과 유사)
    // 여기서는 CSS keyframes를 사용하므로, direction을 먼저 설정하고 currentStep을 바로 변경
    setCurrentStep(stepIndex);

    // 애니메이션 지속 시간 후 isAnimating을 false로 설정
    setTimeout(() => {
      setIsAnimating(false);
      setDirection(''); // 애니메이션 완료 후 direction 초기화
    }, 300); // 애니메이션 시간 (0.3초)
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-in-out h-full w-full 
          ${direction === 'next' && isAnimating ? 'animate-slideOutLeft' : ''}
          ${direction === 'prev' && isAnimating ? 'animate-slideOutRight' : ''}
        `}
      >
        {/* 이 부분은 이전 스텝의 컴포넌트를 렌더링하여 exit 애니메이션을 보여주기 위한 로직이 필요할 수 있습니다.
            간단한 구현을 위해 현재 스텝만 렌더링합니다.
            정교한 exit 애니메이션을 위해서는 이전 스텝의 상태를 잠시 유지하고 애니메이션 후 제거하는 방식이 필요합니다.
         */}
      </div>
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-in-out h-full w-full 
          ${direction === 'next' && isAnimating ? 'animate-slideInRight' : ''}
          ${direction === 'prev' && isAnimating ? 'animate-slideInLeft' : ''}
          ${
            !isAnimating && direction === '' ? 'opacity-100' : 'opacity-100'
          } // 초기 상태 및 애니메이션 후 상태
        `}
      >
        {steps[currentStep].component}
      </div>

      {/* Step indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-1 w-4 rounded-full ${index === currentStep ? 'bg-white' : 'bg-white/30'}`}
          ></div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-12 w-full flex justify-between px-5 z-10">
        {currentStep > 0 && (
          <button
            onClick={goToPrevStep}
            className="p-2 rounded-full bg-white/20"
            disabled={isAnimating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            onClick={goToNextStep}
            className="ml-auto p-2 rounded-full bg-white/20"
            disabled={isAnimating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
