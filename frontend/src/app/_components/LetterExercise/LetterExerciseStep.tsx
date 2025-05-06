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
  const [exitingStepContent, setExitingStepContent] = useState<ReactNode | null>(null);

  const goToStep = (stepIndex: number) => {
    if (isAnimating) return;

    const newDirection = stepIndex > currentStep ? 'next' : 'prev';
    setDirection(newDirection);
    setExitingStepContent(steps[currentStep].component); // 현재 내용을 퇴장할 내용으로 설정
    setIsAnimating(true);
    setCurrentStep(stepIndex); // 다음 스텝으로 상태 변경

    // 애니메이션 지속 시간 후 상태 초기화
    setTimeout(() => {
      setIsAnimating(false);
      setDirection('');
      setExitingStepContent(null); // 퇴장한 내용 초기화
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

  const currentStepComponent = steps[currentStep]?.component || null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Exiting Step Component Container */}
      {isAnimating && exitingStepContent && (
        <div
          key={`exiting-${currentStep}-${direction}`}
          className={`absolute inset-0 h-full w-full 
            ${direction === 'next' ? 'animate-slideOutLeft' : ''}
            ${direction === 'prev' ? 'animate-slideOutRight' : ''}
          `}
        >
          {exitingStepContent}
        </div>
      )}

      {/* Current/Entering Step Component Container */}
      <div
        key={`current-${currentStep}`}
        className={`absolute inset-0 h-full w-full 
          ${isAnimating && direction === 'next' ? 'animate-slideInRight' : ''}
          ${isAnimating && direction === 'prev' ? 'animate-slideInLeft' : ''}
          ${
            !isAnimating ? 'opacity-100' : isAnimating ? 'opacity-100' : 'opacity-0'
          } // 애니메이션 중에도 보이도록, 끝나면 확실히 보이도록
        `}
      >
        {currentStepComponent}
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
        {/* 다음 버튼은 항상 보이도록 하고, 마지막 스텝에서는 다른 동작을 하거나 안 보이게 할 수 있습니다. 현재는 그대로 둡니다. */}
        {(currentStep < steps.length - 1 || steps.length === 0) && (
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
