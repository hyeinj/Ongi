'use client';

import React from 'react';
import '@/styles/SelfEmpathyPage.css';
import { useParams } from 'next/navigation';

export default function SkeletonQuestion() {
  // URL 파라미터를 통해 현재 스텝 확인
  const params = useParams();
  const step = (params?.step as string) || '';
  const isEmotionStep = step === '3'; // Step4는 감정 선택 단계
  const isResultStep = step === '8'; // Step8은 최종 결과 화면

  // 스켈레톤 UI 유형 결정
  // 결과 화면, 감정 선택 화면, 일반 텍스트 입력 화면

  if (isResultStep) {
    // 최종 결과 화면 스켈레톤 (Step8)
    return (
      <div className="self-empathy-question">
        <div className="skeleton-final-message">
          <div className="skeleton-final-line"></div>
          <div className="skeleton-final-line" style={{ width: '80%' }}></div>
        </div>

        <div className="skeleton-final-card">
          <div className="skeleton-final-card-text"></div>
          <div className="skeleton-final-card-text"></div>
          <div className="skeleton-final-card-text"></div>
          <div className="skeleton-final-card-text" style={{ width: '60%' }}></div>
        </div>

        <div className="skeleton-final-bottom">
          <div className="skeleton-final-line" style={{ width: '50%' }}></div>
          <div className="skeleton-final-line" style={{ width: '70%' }}></div>
          <div className="skeleton-final-line" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="self-empathy-question">
      <div className="question-container mt-8">
        <div className="skeleton-small"></div>
        <div className="skeleton-large"></div>
      </div>

      {isEmotionStep ? (
        // 감정 선택 스텝의 스켈레톤 (Step4)
        <div className="skeleton-content-wrapper">
          {/* 감정 아이콘 영역 */}
          <div className="skeleton-emotion-icons">
            <div className="skeleton-emotion-icon"></div>
            <div className="skeleton-emotion-icon"></div>
            <div className="skeleton-emotion-icon"></div>
          </div>

          {/* 감정 목록 영역 */}
          <div className="skeleton-feeling-list">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="skeleton-feeling-item"></div>
            ))}
          </div>

          {/* 다음 버튼 */}
          <div className="skeleton-button-container">
            <div className="skeleton-button"></div>
          </div>
        </div>
      ) : (
        // 일반 텍스트 입력 스텝의 스켈레톤 (다른 스텝)
        <div className="skeleton-content-wrapper">
          <div className="skeleton-textarea"></div>
        </div>
      )}
    </div>
  );
}
