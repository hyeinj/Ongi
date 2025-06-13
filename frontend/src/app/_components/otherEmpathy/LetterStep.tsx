'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import letterOpenedBgImg from '@/assets/images/letter-opened-bg.png';
import LetterContent from './LetterContent';

export default function LetterStep() {
  const [showLetterContent, setShowLetterContent] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [fadeFirstMessage, setFadeFirstMessage] = useState(true);

  useEffect(() => {
    // 바로 애니메이션과 텍스트 표시
    setAnimating(true);
    setShowLetterContent(true);

    // 1.5초 후에 첫 번째 메시지 페이드아웃 시작
    const fadeOutTimer = setTimeout(() => {
      setFadeFirstMessage(false);
    }, 1500);

    // 2초 후에 두 번째 메시지 표시
    const secondMessageTimer = setTimeout(() => {
      setShowSecondMessage(true);
    }, 2000);

    // 5초 후에 전체 내용 표시 (두 번째 메시지를 충분히 읽을 시간 제공)
    const fullContentTimer = setTimeout(() => {
      setShowFullContent(true);
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(secondMessageTimer);
      clearTimeout(fullContentTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div
        className={`flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`absolute top-1/3 z-10 text-center text-white transition-opacity duration-500 ease-in-out ${
            showFullContent ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {!showSecondMessage ? (
            <p
              className={`text-lg transition-opacity duration-500 ease-in-out ${
                fadeFirstMessage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              온기우체부의 답장 편지를 열어보았어요.
            </p>
          ) : (
            <p className="text-lg transition-opacity duration-800 ease-in-out opacity-100">
              이때, 스쳐 지나가기엔 아쉬운 문장을
              <br />
              하이라이트 해보아요.
              <br />
              나중에 다시 꺼내보며
              <br />
              지금의 마음을 떠올릴 수 있어요.
            </p>
          )}
        </div>

        {/* 새로운 LetterContent 컴포넌트 */}
        <LetterContent isVisible={showFullContent} />

        <div
          className={`absolute bottom-0 w-full transition-transform duration-1500 ease-out ${
            showLetterContent ? 'translate-y-0' : 'translate-y-full'
          } ${showFullContent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        >
          <Image
            src={letterOpenedBgImg}
            alt="편지 배경"
            width={500}
            height={350}
            className="w-full h-auto"
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
