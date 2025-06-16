'use client';

import React, { useState } from 'react';
import '@/styles/IslandTutorialOverlay.css';

interface IslandTutorialOverlayProps {
  onFinish: () => void;
  type: string; // 'self', 'growth', 'routine', 'relate'
}

interface Spotlight {
  x: string;
  y: string;
  r: number;
}

interface TutorialStep {
  message: string;
  spotlights: Spotlight[];
  tooltip: { left: string; top: string };
}

// 섬별 튜토리얼 스텝 정의
const islandTutorialSteps: Record<string, TutorialStep[]> = {
  self: [
    {
      message: '자아섬에서는 나를 마주한 진심들이 기록되어 있어요',
      spotlights: [
        { x: '50%', y: '75%', r: 100 }
      ],
      tooltip: { left: '50%', top: '43%' },
    },
    {
      message: '나의 감정이 색으로 표현되어 \n날짜에 맞게 저장되어 있어요',
      spotlights: [
        { x: '14%', y: '34%', r: 50 },
        { x: '50%', y: '37%', r: 50 }
      ],
      tooltip: { left: '42%', top: '45%' },
    },
    {
        message: '편지들 중 가장 많은 감정색으로 \n섬이 밝혀져요',
        spotlights: [
          { x: '50%', y: '70%', r: 150 },
          { x: '34%', y: '40%', r: 100 },
        ],
        tooltip: { left: '60%', top: '8%' },
      },
      {
        message: '오늘의 마음도 잘 기록되었어요. \n그 여정을 다시 살펴보러 가볼까요?',
        spotlights: [
          { x: '80%', y: '53%', r: 50 }
        ],
        tooltip: { left: '60%', top: '62%' },
      },
  ],
  growth: [
    {
        message: '성장섬에는 더 나아지고 싶었던 \n 다짐과 용기의 흔적들이 담겨 있어요.',
        spotlights: [
          { x: '50%', y: '75%', r: 100 }
        ],
        tooltip: { left: '50%', top: '43%' },
      },
      {
        message: '나의 감정이 색으로 표현되어 \n날짜에 맞게 저장되어 있어요',
        spotlights: [
          { x: '30%', y: '29%', r: 50 },
          { x: '66%', y: '38%', r: 50 }
        ],
        tooltip: { left: '42%', top: '47%' },
      },
      {
          message: '편지들 중 가장 많은 감정색으로 \n섬이 밝혀져요',
          spotlights: [
            { x: '50%', y: '70%', r: 150 },
            { x: '50%', y: '34%', r: 100 },
          ],
          tooltip: { left: '60%', top: '4%' },
        },
        {
          message: '오늘의 마음도 잘 기록되었어요. \n그 여정을 다시 살펴보러 가볼까요?',
          spotlights: [
            { x: '80%', y: '53%', r: 50 }
          ],
          tooltip: { left: '60%', top: '62%' },
        },
  ],
  routine: [
    {
        message: '루틴섬에서는 평범한 하루 속 \n익숙함과 반복 속에서 지나간 \n마음들이 머물고 있어요.',
        spotlights: [
          { x: '50%', y: '75%', r: 100 }
        ],
        tooltip: { left: '50%', top: '40%' },
      },
    {
      message: '나의 감정이 색으로 표현되어 \n날짜에 맞게 저장되어 있어요',
      spotlights: [
        { x: '60%', y: '30%', r: 100 }
      ],
      tooltip: { left: '60%', top: '44%' },
    },
    {
        message: '편지들 중 가장 많은 감정색으로 \n섬이 밝혀져요',
        spotlights: [
          { x: '50%', y: '70%', r: 150 },
          { x: '59%', y: '28%', r: 70 },
        ],
        tooltip: { left: '50%', top: '38%' },
      },
      {
        message: '오늘의 마음도 잘 기록되었어요. \n그 여정을 다시 살펴보러 가볼까요?',
        spotlights: [
          { x: '80%', y: '53%', r: 50 }
        ],
        tooltip: { left: '60%', top: '62%' },
      },
  ],
  relate: [
    {
        message: '관계섬에는 누군가와의 사이에서 \n기대하고 서운했던, 그 모든 감정의 결들이 남아 있어요.',
        spotlights: [
          { x: '50%', y: '73%', r: 105 }
        ],
        tooltip: { left: '50%', top: '37%' },
      },
      {
        message: '나의 감정이 색으로 표현되어 \n날짜에 맞게 저장되어 있어요',
        spotlights: [
          { x: '32%', y: '39%', r: 50 },
          { x: '79%', y: '42%', r: 50 }
        ],
        tooltip: { left: '50%', top: '50%' },
      },
      {
        message: '편지들 중 가장 많은 감정색으로 \n섬이 밝혀져요',
        spotlights: [
          { x: '50%', y: '70%', r: 140 },
          { x: '50%', y: '44%', r: 100 },
        ],
        tooltip: { left: '50%', top: '10%' },
      },
      {
        message: '오늘의 마음도 잘 기록되었어요. \n그 여정을 다시 살펴보러 가볼까요?',
        spotlights: [
          { x: '80%', y: '53%', r: 50 }
        ],
        tooltip: { left: '60%', top: '62%' },
      },
  ],
};

export default function IslandTutorialOverlay({ onFinish, type }: IslandTutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const steps = islandTutorialSteps[type] || [];
  const currentStep = steps[step];
  const { tooltip } = currentStep || { tooltip: { left: '50%', top: '30%' } };

  return (
    <div className="island-tutorial-overlay">
      {currentStep?.spotlights.map((spotlight, index) => (
        <div
          key={index}
          className="island-tutorial-backdrop"
          style={{
            WebkitMaskImage: `radial-gradient(circle ${spotlight.r}px at ${spotlight.x} ${spotlight.y}, transparent 0 ${spotlight.r-10}px, black ${spotlight.r+10}px 100%)`,
            maskImage: `radial-gradient(circle ${spotlight.r}px at ${spotlight.x} ${spotlight.y}, transparent 0 ${spotlight.r-10}px, black ${spotlight.r+10}px 100%)`,
          }}
        />
      ))}
      <div className="island-tutorial-tooltip" style={{ left: tooltip.left, top: tooltip.top, transform: 'translate(-50%, 0)' }}>
        <p>{currentStep?.message}</p>
        <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onFinish()}>
          {step < steps.length - 1 ? '다음' : '편지를 눌러보세요'}
        </button>
      </div>
      <div className="island-tutorial-progress">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`island-tutorial-progress-dot ${index === step ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
} 