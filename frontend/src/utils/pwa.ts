// PWA 관련 유틸리티 함수들

// Navigator 타입 확장
interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

// PWA로 실행되고 있는지 확인
export const isPWA = (): boolean => {
  // iOS Safari PWA 확인
  const isIOSPWA = (window.navigator as ExtendedNavigator).standalone === true;
  
  // 일반적인 PWA 모드 확인
  const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches;
  
  // 최소 UI 모드 확인
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  
  // 풀스크린 모드 확인
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  
  return isIOSPWA || isStandalonePWA || isMinimalUI || isFullscreen;
};

// PWA 설치 가능한지 확인
export const canInstallPWA = (): boolean => {
  // iOS인 경우 별도 처리
  if (isIOS()) {
    return true; // iOS에서는 Safari에서만 설치 가능하지만 안내는 표시
  }
  
  // 안드로이드인 경우 별도 처리
  if (isAndroid()) {
    return true; // 안드로이드에서는 대부분의 브라우저에서 PWA 설치 가능
  }
  
  // 데스크톱 브라우저에서는 Service Worker 지원 여부로 판단
  return 'serviceWorker' in navigator;
};

// BeforeInstallPromptEvent 타입 정의
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// PWA 설치 이벤트 처리
export const handlePWAInstall = (deferredPrompt: BeforeInstallPromptEvent | null) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    return deferredPrompt.userChoice;
  }
  return Promise.resolve({ outcome: 'dismissed' as const });
};

// iOS 감지 함수
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
};

// 안드로이드 감지 함수
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// 브라우저별 PWA 설치 안내 메시지
export const getBrowserInstallMessage = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isiOS = isIOS();
  const isAndroidDevice = isAndroid();
  
  // iOS Safari
  if (isiOS && userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios')) {
    return '1. 하단의 공유 버튼 (📤)을 탭하세요\n2. "홈 화면에 추가"를 선택하세요\n3. "추가"를 탭하여 설치를 완료하세요';
  }
  
  // iOS Chrome
  if (isiOS && userAgent.includes('crios')) {
    return 'iOS에서는 Safari 브라우저에서만 홈 화면에 추가할 수 있습니다. Safari로 이 페이지를 열어주세요.';
  }
  
  // iOS Firefox
  if (isiOS && userAgent.includes('fxios')) {
    return 'iOS에서는 Safari 브라우저에서만 홈 화면에 추가할 수 있습니다. Safari로 이 페이지를 열어주세요.';
  }
  
  // Android Chrome
  if (isAndroidDevice && userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return '1. 브라우저 메뉴 (⋮)를 탭하세요\n2. "앱 설치" 또는 "홈 화면에 추가"를 선택하세요\n3. "설치"를 탭하여 완료하세요';
  }
  
  // Android Samsung Internet
  if (isAndroidDevice && userAgent.includes('samsungbrowser')) {
    return '1. 브라우저 메뉴를 탭하세요\n2. "페이지 추가" > "홈 화면"을 선택하세요\n3. "추가"를 탭하여 완료하세요';
  }
  
  // Android Firefox
  if (isAndroidDevice && userAgent.includes('firefox')) {
    return '1. 브라우저 메뉴를 탭하세요\n2. "페이지" > "홈 화면에 추가"를 선택하세요\n3. "추가"를 탭하여 완료하세요';
  }
  
  // Other Android browsers
  if (isAndroidDevice) {
    return '1. 브라우저 메뉴를 탭하세요\n2. "홈 화면에 추가" 또는 "앱 설치" 옵션을 찾으세요\n3. 설치를 완료하세요';
  }
  
  // Desktop Chrome
  if (userAgent.includes('chrome') && !userAgent.includes('edg') && !isiOS) {
    return '브라우저 주소창의 "설치" 버튼을 클릭하거나, 메뉴에서 "앱 설치"를 선택하세요.';
  }
  
  // Desktop Safari
  if (userAgent.includes('safari') && !userAgent.includes('chrome') && !isiOS) {
    return '공유 버튼을 눌러 "홈 화면에 추가"를 선택하세요.';
  }
  
  // Desktop Firefox
  if (userAgent.includes('firefox')) {
    return '주소창의 "설치" 아이콘을 클릭하거나, 메뉴에서 "홈 화면에 추가"를 선택하세요.';
  }
  
  // Desktop Edge
  if (userAgent.includes('edg')) {
    return '브라우저 메뉴에서 "앱" > "이 사이트를 앱으로 설치"를 선택하세요.';
  }
  
  return '브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치" 옵션을 찾아 선택하세요.';
}; 