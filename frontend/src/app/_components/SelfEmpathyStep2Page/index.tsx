"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/SelfEmpathyStep2Page.css';
import Image from 'next/image';

// 이미지 import
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import bottomMt from '@/assets/images/self-empathy-mountain.png';
import arrow from '@/assets/icons/arrow.png';
import selfProgress from '@/assets/icons/self-progress.png';

const SelfEmpathyStep2Page: React.FC = () => {
  const router = useRouter();

  return (
    <div className="self-empathy-step2-page">
      <div className="div">
        <Image className="ver" src={bottomMt} alt="배경 이미지" />
        
        <Image className="element-1" alt="별똥별 1" src={star1} />
        <Image className="element-2" alt="별똥별 2" src={star2} />
        <Image className="element-3" alt="별똥별 3" src={star3} />

        <div className="content">
          <div className="header">
            <button className="back-button" onClick={() => router.push('/self-empathy/1')}>
              <Image src={arrow} alt="뒤로 가기" />
            </button>
            <Image className="progress-bar" src={selfProgress} alt="진행 상태" />
          </div>

          <div className="question-text">
            <p className="small-text">무지님의 하루가 궁금해요.</p>
            <p className="large-text">오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?</p>
          </div>

          <textarea
            className="answer-input"
            placeholder="답변을 입력해주세요"
          />
          
        </div>
      </div>
    </div>
  );
};

export default SelfEmpathyStep2Page; 