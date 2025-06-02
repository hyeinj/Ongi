'use client';

import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
  type?: 'default' | 'question' | 'analyzing' | 'error' | 'rate-limit';
}

export default function LoadingState({ 
  message = "로딩 중...", 
  type = 'default' 
}: LoadingStateProps) {
  
  const getLoadingMessage = () => {
    switch (type) {
      case 'question':
        return '다음 질문으로 넘어가는 중입니다';
      case 'analyzing':
        return '답변을 분석하고 있어요...';
      case 'error':
        return '오류가 발생했습니다. 다시 시도해주세요.';
      case 'rate-limit':
        return 'API 사용량 한도를 초과했습니다.\n잠시 후 다시 시도해주세요.';
      default:
        return message;
    }
  };

  const getSpinnerColor = () => {
    if (type === 'error' || type === 'rate-limit') {
      return ['#EF4444', '#F87171', '#FCA5A5']; // 빨간색 계열
    }
    return ['#8B5CF6', '#A78BFA', '#C4B5FD']; // 기본 보라색 계열
  };

  const colors = getSpinnerColor();

  return (
    <div className="loading-state">
      <div className="loading-content">
        <div className="loading-spinner">
          <div 
            className="spinner-ring" 
            style={{ borderTopColor: colors[0] }}
          ></div>
          <div 
            className="spinner-ring" 
            style={{ borderTopColor: colors[1] }}
          ></div>
          <div 
            className="spinner-ring" 
            style={{ borderTopColor: colors[2] }}
          ></div>
        </div>
        <p className="loading-message" style={{ whiteSpace: 'pre-line' }}>
          {getLoadingMessage()}
        </p>
        <div className="loading-dots">
          <span style={{ backgroundColor: colors[0] }}></span>
          <span style={{ backgroundColor: colors[0] }}></span>
          <span style={{ backgroundColor: colors[0] }}></span>
        </div>
      </div>
    </div>
  );
} 