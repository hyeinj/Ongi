'use client';

import React, { useEffect, useState } from 'react';
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
import { useUserCheck, getAllIslandCounts, IslandCounts } from '@/infra';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isFirstVisit, isLoading } = useUserCheck();
  const [islandCounts, setIslandCounts] = useState<IslandCounts>({
    self: 0,
    growth: 0,
    routine: 0,
    relate: 0,
  });

  useEffect(() => {
    if (!isLoading) {
      // 첫 방문자인 경우 환영 메시지 또는 온보딩 화면으로 리다이렉트할 수 있습니다
      if (isFirstVisit) {
        console.log('처음 방문하셨습니다! 환영합니다!');
        // 온보딩 페이지가 있다면 리다이렉트
        // router.push('/onboarding');
      }

      // 섬 데이터 가져오기
      const counts = getAllIslandCounts();
      setIslandCounts(counts);
    }
  }, [isLoading, isFirstVisit, router]);

  const handlePostOfficeClick = () => {
    router.replace('/self-empathy/1');
  };

  // 로딩 중인 경우 로딩 화면 표시
  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="home-page">
      <div className="background">
        <div className="text-wrapper">
          <Image className="line" alt="Line" src={line} />

          <p>무지 님의 시간이 머무는 섬이에요.</p>
          <p>따뜻한 기록 하나, 띄워볼까요?</p>
        </div>
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

        {/* 섬별 기록 수 표시 */}
        <div className="circle-ellipse circle-self">
          <span>{islandCounts.self}</span>
        </div>
        <div className="circle-ellipse circle-growth">
          <span>{islandCounts.growth}</span>
        </div>
        <div className="circle-ellipse circle-routine">
          <span>{islandCounts.routine}</span>
        </div>
        <div className="circle-ellipse circle-relate">
          <span>{islandCounts.relate}</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
