'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/styles/SelfEmpathyPage.css';
import arrow from '@/assets/icons/arrow.png';

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
      <div className="background">
        <Image className="ver" src={bottomMt} alt="배경 이미지" />

        <div className="text-wrapper">
          <p className="text-line line1">지금 이 순간,</p>
          <p className="text-line line2">머무는 마음을 함께 바라보아요.</p>
          <p className="text-line line3">어떤 감정이든 있는 그대로 괜찮아요.</p>
          <br />
          <p className="text-line line4">잠시 발걸음을 멈추고</p>
          <p className="text-line line5">5가지 질문과 함께</p>
          <p className="text-line line6">오늘의 나를 만나볼까요?</p>
        </div>
        <button
          className="back-button"
          onClick={() => router.push('/')}
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        >
          <Image src={arrow} alt="뒤로 가기" />
        </button>

        <Image className="element-1" alt="별똥별 1" src={star1} />
        <Image className="element-2" alt="별똥별 2" src={star2} />
        <Image className="element-3" alt="별똥별 3" src={star3} />

        <button className="bottom-button" onClick={handleNextStep}>
          <Image src={bottomButton} alt="다음으로" />
          <span className="button-text">내 마음 들여다보기</span>
        </button>
      </div>
    </div>
  );
};

export default SelfEmpathyPage;
