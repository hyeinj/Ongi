'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useRealLetter } from '@/ui/hooks/useRealLetter';
import localFont from 'next/font/local';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

interface LetterContentProps {
  isVisible: boolean;
}

// 기존 인터페이스와 호환성을 위해 유지
interface LetterParagraph {
  id: string;
  text: string;
}

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [fadeIn, setFadeIn] = useState(false);

  // 실제 편지 데이터 가져오기
  const { worryContent, isLoading, error } = useRealLetter();

  // worryContent를 기존 인터페이스 형태로 변환 (메모이제이션)
  const letterContent: LetterParagraph[] = useMemo(() => {
    if (!worryContent || worryContent.length === 0) return [];

    return worryContent.map((paragraph, index) => ({
      id: paragraph.id || `paragraph-${index}`,
      text: paragraph.text,
    }));
  }, [worryContent]);

  useEffect(() => {
    if (isVisible) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isVisible]);

  // 편지 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">편지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
        isVisible && fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center p-4 ${garamFont.className}`}
      >
        <div className="w-full flex justify-end pr-3">
          <div className="flex space-x-[-8px]">
            <button className="py-1 px-4 rounded-t-lg text-sm bg-[#FFDB68] text-black font-medium z-10">
              고민편지
            </button>
          </div>
        </div>

        <div className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] transition-opacity duration-300 ease-in-out overflow-y-auto overflow-hidden break-keep">
          <div className="flex flex-col items-center mb-5 relative">
            <Image
              src={postboxIcon}
              alt="편지함 아이콘"
              width={50}
              height={50}
              priority
              loading="eager"
            />
          </div>

          <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
            {letterContent.length > 0 ? (
              letterContent.map((paragraph) => (
                <p
                  id={`paragraph-${paragraph.id}`}
                  key={paragraph.id}
                  className=" text-gray-700 cursor-text"
                >
                  {paragraph.text}
                </p>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>편지 내용을 불러올 수 없습니다.</p>
                <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
