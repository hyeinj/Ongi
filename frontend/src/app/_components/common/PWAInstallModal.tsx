'use client';

import React, { useEffect, useState } from 'react';
import { getBrowserInstallMessage, handlePWAInstall } from '@/utils/pwa';
import '@/styles/PWAInstallModal.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installMessage, setInstallMessage] = useState<string>('');
  const [canShowInstallButton, setCanShowInstallButton] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);

  useEffect(() => {
    // iOS 감지
    const isiOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIOS(isiOSDevice);
    
    // 안드로이드 감지
    const isAndroidDevice = /Android/.test(navigator.userAgent);
    setIsAndroid(isAndroidDevice);
    
    // 브라우저별 설치 안내 메시지 설정
    setInstallMessage(getBrowserInstallMessage());

    // beforeinstallprompt 이벤트 리스너 등록 (안드로이드와 데스크톱에서)
    if (!isiOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('beforeinstallprompt 이벤트 감지됨');
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setCanShowInstallButton(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        const choiceResult = await handlePWAInstall(deferredPrompt);
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA 설치가 수락되었습니다');
        }
        setDeferredPrompt(null);
        setCanShowInstallButton(false);
        onClose();
      } catch (error) {
        console.error('PWA 설치 중 오류가 발생했습니다:', error);
      }
    }
  };

  const handleRemindLater = () => {
    // 24시간 후에 다시 표시하도록 localStorage에 저장
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem('pwa-install-reminder', tomorrow.toISOString());
    onClose();
  };

  const handleDontShowAgain = () => {
    // 더 이상 표시하지 않도록 localStorage에 저장
    localStorage.setItem('pwa-install-never-show', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="pwa-modal-overlay" onClick={onClose}>
      <div className="pwa-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pwa-modal-header">
          <h2>{isIOS || isAndroid ? '홈 화면에 추가하기' : '앱으로 설치하기'}</h2>
          <button className="pwa-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="pwa-modal-body">
          <div className="pwa-modal-icon">
            📱
          </div>
          <p className="pwa-modal-title">
            더 편리한 앱 경험을 위해<br />
            홈 화면에 추가해보세요!
          </p>
          <p className="pwa-modal-description">
            • 빠른 접근과 더 나은 성능<br />
            • 오프라인에서도 이용 가능<br />
            • 푸시 알림으로 새로운 소식 확인
          </p>
          
          {canShowInstallButton ? (
            <button className="pwa-install-button" onClick={handleInstallClick}>
              지금 설치하기
            </button>
          ) : (
            <div className="pwa-manual-install">
              <p className="pwa-manual-title">설치 방법:</p>
              <p className="pwa-manual-description" style={{ whiteSpace: 'pre-line' }}>
                {installMessage}
              </p>
              {isIOS && (navigator.userAgent.includes('CriOS') || navigator.userAgent.includes('FxiOS')) && (
                <button 
                  className="pwa-safari-link"
                  onClick={() => {
                    const currentUrl = window.location.href;
                    window.open(`x-web-search://?${currentUrl}`, '_blank');
                  }}
                >
                  Safari로 열기
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="pwa-modal-footer">
          <button className="pwa-button-secondary" onClick={handleRemindLater}>
            나중에 하기
          </button>
          <button className="pwa-button-text" onClick={handleDontShowAgain}>
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallModal; 