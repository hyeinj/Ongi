'use client';

import React from 'react';
import '@/styles/SelfEmpathyPage.css';

export default function SkeletonQuestion() {
  return (
    <div className="self-empathy-question">
      <div className="question-container">
        <div
          className="skeleton-small"
          style={{ width: '60%', height: '20px', marginBottom: '8px' }}
        ></div>
        <div className="skeleton-large" style={{ width: '80%', height: '28px' }}></div>
      </div>
      <div className="skeleton-content" style={{ height: '200px' }}></div>
    </div>
  );
}
