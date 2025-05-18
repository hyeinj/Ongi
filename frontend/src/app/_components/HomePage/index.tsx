"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/styles/HomePage.css';
import homepageMt from '@/assets/images/homepage-mountain.png';
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import postoffice from '@/assets/images/postoffice.png';
import line from '@/assets/images/line.png';
import self from '@/assets/images/self.png';
import growth from '@/assets/images/growth.png';
import routine from '@/assets/images/routine.png';
import relate from '@/assets/images/relate.png';

const HomePage: React.FC = () => {
  const router = useRouter();
  
  // 임시 데이터 - 나중에 백엔드에서 가져올 예정
  const letterCounts = {
    self: 3,
    growth: 5,
    routine: 2,
    relate: 4
  };

  const handlePostOfficeClick = () => {
      router.replace('/self-empathy/1');
  };

  return (
    <div className="home-page">
      <div className="background">
        <div className="text-wrapper">
          <p>무지 님의 시간이 머무는 섬이에요.</p>
          <p>따뜻한 기록 하나, 띄워볼까요?</p>
        </div>
        <Image className="line" alt="Line" src={line} />
        <Image 
          className="postoffice" 
          alt="우체국" 
          src={postoffice}
          onClick={handlePostOfficeClick}
        />
        <Image className="element-1" alt="별똥별 1" src={star1} />
        <Image className="element-2" alt="별똥별 2" src={star2} />
        <Image className="element-3" alt="별똥별 3" src={star3} />
        <Image className="mountain" alt="산" src={homepageMt} />
        <Image className="self" alt="자아섬" src={self} />
        <Image className="growth" alt="성장섬" src={growth} />
        <Image className="routine" alt="루틴섬" src={routine} />
        <Image className="relate" alt="관계섬" src={relate} />
        {/* 백앤드로 채워야하는 숫자 */}
        <div className="circle-ellipse circle-self">
          <span>{letterCounts.self}</span>
        </div>
        <div className="circle-ellipse circle-growth">
          <span>{letterCounts.growth}</span>
        </div>
        <div className="circle-ellipse circle-routine">
          <span>{letterCounts.routine}</span>
        </div>
        <div className="circle-ellipse circle-relate">
          <span>{letterCounts.relate}</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 