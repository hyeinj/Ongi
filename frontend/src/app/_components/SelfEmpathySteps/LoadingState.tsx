'use client';

import './LoadingState.css';
import Image from 'next/image';
import mailBird from '@/assets/images/letter-exercise-bird.png';

interface LoadingStateProps {
  message?: string;
  type?: 'default' | 'question' | 'error' | 'rate-limit';
}

export default function LoadingState({ 
  message = "오늘의 자기공감 여정이 \n 차분히 정리되어 전해지고 있어요", 
  type = 'default' 
}: LoadingStateProps) {
  
  const getLoadingMessage = () => {
    switch (type) {
      case 'question':
        return '다음 질문으로 넘어가고 있어요';
      case 'error':
        return '오류가 발생했습니다. 다시 시도해주세요.';
      case 'rate-limit':
        return 'API 사용량 한도를 초과했습니다.\n잠시 후 다시 시도해주세요.';
      default:
        return message;
    }
  };

  return (
    <div className="loading-state">
      <div className="loading-content">
        <div className="loading-bird">
          <Image 
            src={mailBird} 
            alt="Loading bird" 
            width={60} 
            height={60}
            className="bird-image"
          />
        </div>
        <p className="loading-message" style={{ whiteSpace: 'pre-line' }}>
          {getLoadingMessage()}
        </p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
} 