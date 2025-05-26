import React, { useState } from 'react';
import '@/styles/TutorialOverlay.css';

interface TutorialOverlayProps {
  onFinish: () => void;
}

const steps = [
  {
    message: '이 우체국 섬을 누르면 오늘의 기록을 시작할 수 있어요',
    spotlight: { x: '50%', y: '68%', r: 150 },
    tooltip: { left: '50%', top: '30%' },
  },
  {
    message: '오늘의 기록들은 이 섬들에 아카이빙되어 보여집니다.',
    spotlight: { x: '50%', y: '35%', r: 180 },
    tooltip: { left: '50%', top: '60%' },
  },
  {
    message: '오늘, 나의 감정에 귀 기울인 이야기라면 "자아의 섬"에 저장돼요',
    spotlight: { x: '35%', y: '27%', r: 85 },
    tooltip: { left: '35%', top: '40%' },
  },
  {
    message: "공부나 일, 미래를 향한 발걸음이라면 '성장의 섬'에 기록돼요.",
    spotlight: { x: '20%', y: '40%', r: 80 },
    tooltip: { left: '35%', top: '52%' },
  },
  {
    message: "하루의 루틴 속에서 있었던 소소한 순간들은 ‘루틴의 섬’으로 모여요",
    spotlight: { x: '73%', y: '29%', r: 63 },
    tooltip: { left: '65%', top: '38%' },
  },
  {
    message: "누군가와의 관계에서 느낀 감정들은 ‘관계의 섬’으로 흘러가요.",
    spotlight: { x: '73%', y: '44%', r: 79 },
    tooltip: { left: '65%', top: '55%' },
  },
];

export default function TutorialOverlay({ onFinish }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const { x, y, r } = steps[step].spotlight;
  const { left, top } = steps[step].tooltip;

  // mask CSS 동적 생성
  const maskStyle = {
    WebkitMaskImage: `radial-gradient(circle ${r}px at ${x} ${y}, transparent 0 ${r-10}px, black ${r+10}px 100%)`,
    maskImage: `radial-gradient(circle ${r}px at ${x} ${y}, transparent 0 ${r-10}px, black ${r+10}px 100%)`,
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop" style={maskStyle} />
      <div className="tutorial-tooltip" style={{ left, top, transform: 'translate(-50%, 0)' }}>
        <p>{steps[step].message}</p>
        <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onFinish()}>
          {step < steps.length - 1 ? '다음' : '확인'}
        </button>
      </div>
    </div>
  );
}
