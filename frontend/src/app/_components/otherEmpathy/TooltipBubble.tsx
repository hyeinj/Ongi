'use client';

import React, { useState, useEffect } from 'react';

interface TooltipBubbleProps {
  message: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  duration?: number;
  isVisible: boolean;
  onHide?: () => void;
}

const TooltipBubble: React.FC<TooltipBubbleProps> = ({
  message,
  position = 'top',
  duration = 5000,
  isVisible,
  onHide,
}) => {
  const [animation, setAnimation] = useState<'fadeIn' | 'fadeOut' | null>(null);

  useEffect(() => {
    if (isVisible) {
      setAnimation('fadeIn');

      const timer = setTimeout(() => {
        setAnimation('fadeOut');

        // 애니메이션이 끝난 후 완전히 숨김 처리
        const hideTimer = setTimeout(() => {
          if (onHide) {
            onHide();
          }
        }, 500); // fadeOut 애니메이션 길이와 동일하게

        return () => clearTimeout(hideTimer);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setAnimation(null);
    }
  }, [isVisible, duration, onHide]);

  // 위치에 따른 스타일 결정
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return {
          bubbleClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          arrowClass:
            'top-full left-1/2 -ml-2 border-t-amber-100 border-l-transparent border-r-transparent border-b-0 border-t-[8px] border-l-[8px] border-r-[8px]',
        };
      case 'right':
        return {
          bubbleClass: 'left-full top-1/2 -translate-y-1/2 ml-2',
          arrowClass:
            'right-full top-1/2 -mt-2 border-r-amber-100 border-t-transparent border-b-transparent border-l-0 border-r-[8px] border-t-[8px] border-b-[8px]',
        };
      case 'bottom':
        return {
          bubbleClass: 'top-full left-1/2 -translate-x-1/2 mt-2',
          arrowClass:
            'bottom-full left-1/2 -ml-2 border-b-amber-100 border-l-transparent border-r-transparent border-t-0 border-b-[8px] border-l-[8px] border-r-[8px]',
        };
      case 'left':
        return {
          bubbleClass: 'right-full top-1/2 -translate-y-1/2 mr-2',
          arrowClass:
            'left-full top-1/2 -mt-2 border-l-amber-100 border-t-transparent border-b-transparent border-r-0 border-l-[8px] border-t-[8px] border-b-[8px]',
        };
      default:
        return {
          bubbleClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          arrowClass:
            'top-full left-1/2 -ml-2 border-t-amber-100 border-l-transparent border-r-transparent border-b-0 border-t-[8px] border-l-[8px] border-r-[8px]',
        };
    }
  };

  const { bubbleClass, arrowClass } = getPositionStyle();

  if (!isVisible && animation !== 'fadeOut') return null;

  return (
    <div className={`absolute ${bubbleClass} z-50 ${animation ? `animate-${animation}` : ''}`}>
      <div className="bg-amber-100 p-3 rounded-lg shadow-md max-w-[200px]">
        <div className={`absolute ${arrowClass} w-0 h-0`}></div>
        <p className="text-sm text-amber-800 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default TooltipBubble;
