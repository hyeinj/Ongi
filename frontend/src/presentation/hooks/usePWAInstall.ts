'use client';

import { useState, useEffect } from 'react';
import { isPWA, canInstallPWA } from '@/utils/pwa';

interface UsePWAInstallReturn {
  shouldShowInstallModal: boolean;
  showInstallModal: () => void;
  hideInstallModal: () => void;
}

// iOS 감지 함수
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
};

// 안드로이드 감지 함수
const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// 모바일에서 PWA 설치 안내가 필요한지 확인
const shouldShowPWAGuideOnMobile = (): boolean => {
  // iOS와 안드로이드에서는 모든 브라우저에서 안내 표시
  return isIOS() || isAndroid();
};

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [shouldShowInstallModal, setShouldShowInstallModal] = useState(false);

  useEffect(() => {
    // 디버깅 정보 로깅
    console.log('PWA Install Hook - 디버깅 정보:', {
      isPWAMode: isPWA(),
      isIOSDevice: isIOS(),
      isAndroidDevice: isAndroid(),
      userAgent: navigator.userAgent,
      canInstall: canInstallPWA()
    });

    // 이미 PWA로 실행 중이면 모달을 표시하지 않음
    if (isPWA()) {
      console.log('이미 PWA 모드로 실행 중입니다.');
      return;
    }

    // 모바일 기기 확인
    const isiOS = isIOS();
    const isAndroidDevice = isAndroid();
    const isMobile = isiOS || isAndroidDevice;
    
    // 모바일이 아닌 경우 기존 로직 사용
    if (!isMobile && !canInstallPWA()) {
      console.log('데스크톱에서 PWA 설치 불가능');
      return;
    }
    
    // 모바일인 경우 안내 표시 여부 확인
    if (isMobile && !shouldShowPWAGuideOnMobile()) {
      return;
    }

    // 사용자가 "다시 보지 않기"를 선택했는지 확인
    const neverShow = localStorage.getItem('pwa-install-never-show');
    if (neverShow === 'true') {
      return;
    }

    // 사용자가 "나중에 하기"를 선택했는지 확인
    const reminderDate = localStorage.getItem('pwa-install-reminder');
    if (reminderDate) {
      const reminderTime = new Date(reminderDate);
      const now = new Date();
      if (now < reminderTime) {
        return; // 아직 reminder 시간이 되지 않음
      } else {
        // reminder 시간이 지났으므로 항목 제거
        localStorage.removeItem('pwa-install-reminder');
      }
    }

    
    const timer = setTimeout(() => {
      console.log('PWA 설치 모달 표시');
      setShouldShowInstallModal(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const showInstallModal = () => {
    setShouldShowInstallModal(true);
  };

  const hideInstallModal = () => {
    setShouldShowInstallModal(false);
  };

  return {
    shouldShowInstallModal,
    showInstallModal,
    hideInstallModal,
  };
}; 