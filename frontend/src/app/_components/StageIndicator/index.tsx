'use client';

import React from 'react';
import { useStageIndicator } from '@/app/_store/stageIndicator';

export default function StageIndicator() {
  const { currentStage, totalStages } = useStageIndicator();

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalStages }, (_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
            i + 1 === currentStage ? 'font-bold text-white' : 'text-gray-300'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
