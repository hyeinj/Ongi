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

  // Check if steps is empty or undefined
  if (!steps || steps.length === 0) {
    return <div className="text-white text-center">스텝이 정의되지 않았습니다.</div>;
  }

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
          ${!isAnimating ? 'opacity-100' : isAnimating ? 'opacity-100' : 'opacity-0'} 
        `}
      >
        {currentStepComponent}
      </div>

      {/* Step indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-1 w-6 rounded-full ${index === currentStep ? 'bg-white' : 'bg-white/30'}`}
          ></div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-12 w-full flex justify-between px-8 z-50">
        {currentStep > 0 ? (
          <button
            onClick={goToPrevStep}
            className="p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors"
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
        ) : (
          <div></div>
        )}

        {currentStep < steps.length - 1 && (
          <button
            onClick={goToNextStep}
            className="p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors"
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
