"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/SelfEmpathyPage.css';

// 이미지 import
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import bottomMt from '@/assets/images/self-empathy-mountain.png';
import bottomButton from '@/assets/icons/bottombutton.png';

const SelfEmpathyPage: React.FC = () => {
  const router = useRouter();

  const handleNextStep = () => {
    router.push('/self-empathy/2');
  };

  return (
    <div className="self-empathy-page">
      <div className="div">
        <div className="ver" style={{ backgroundImage: `url(${bottomMt})` }} />

        <div className="text-wrapper">
          <p className="text-line line1">지금 이 순간,</p>
          <p className="text-line line2">머무는 마음을 함께 바라보아요.</p>
          <p className="text-line line3">어떤 감정이든 있는 그대로 괜찮아요.</p>
          <br />
          <p className="text-line line4">잠시 발걸음을 멈추고</p>
          <p className="text-line line5">오늘의 나를 만나볼까요?</p>
        </div>

        <img className="element-1" alt="별똥별 1" src={star1.src} />
        <img className="element-2" alt="별똥별 2" src={star2.src} />
        <img className="element-3" alt="별똥별 3" src={star3.src} />

        <button className="bottom-button" onClick={handleNextStep}>
          <img src={bottomButton.src} alt="다음으로" />
          <span className="button-text">내 마음 들여다보기</span>
        </button>
      </div>
    </div>
  );
};

export default SelfEmpathyPage; 