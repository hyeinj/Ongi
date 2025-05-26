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
import PWAInstallModal from '@/app/_components/common/PWAInstallModal';
import { usePWAInstall } from '@/ui/hooks/usePWAInstall';
import TutorialOverlay from './TutorialOverlay';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { shouldShowInstallModal, hideInstallModal } = usePWAInstall();

  // 임시 데이터 - 나중에 백엔드에서 가져올 예정
  const letterCounts = {
    self: 3,
    growth: 5,
    routine: 2,
    relate: 4,
  };

  // 상태 분리
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // PWA 모달이 필요한지, 튜토리얼이 필요한지 한 번에 판단
    const neverShowPWA = localStorage.getItem('pwa-install-never-show');
    const pwaReminder = localStorage.getItem('pwa-install-reminder');
    const isTutorialDone = localStorage.getItem('homepage_tutorial_done');

    // PWA 모달 조건(예시)
    if (!neverShowPWA && (!pwaReminder || new Date(pwaReminder) < new Date()) && shouldShowInstallModal) {
      setShowPWAModal(true);
      setShowTutorial(false); // PWA 모달이 뜰 때는 튜토리얼 무조건 숨김
    } else if (!isTutorialDone) {
      setShowTutorial(true);
      setShowPWAModal(false);
    }
  }, [shouldShowInstallModal]);

  // PWA 모달 닫힐 때 튜토리얼 띄우기
  const handlePWAModalClose = () => {
    setShowPWAModal(false);
    if (!localStorage.getItem('homepage_tutorial_done')) {
      setShowTutorial(true);
    }
  };

  const handleTutorialFinish = () => {
    localStorage.setItem('homepage_tutorial_done', 'true');
    setShowTutorial(false);
  };

  const handlePostOfficeClick = () => {
    router.replace('/self-empathy/1');
  };

  return (
    <div className="home-page">
      {showPWAModal && (
        <PWAInstallModal
          isOpen={showPWAModal}
          onClose={handlePWAModalClose}
        />
      )}
      {showTutorial && <TutorialOverlay onFinish={handleTutorialFinish} />}
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
        <Image className="self" alt="자아섬" src={self} onClick={() => router.push('/island/self')} />
        <Image className="growth" alt="성장섬" src={growth} onClick={() => router.push('/island/growth')} />
        <Image className="routine" alt="루틴섬" src={routine} onClick={() => router.push('/island/routine')} />
        <Image className="relate" alt="관계섬" src={relate} onClick={() => router.push('/island/relate')} />
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
