'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useLetterHighlights } from '@/ui/hooks/useLetterHighlights';
import { useRealLetter } from '@/ui/hooks/useRealLetter';
import localFont from 'next/font/local';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

interface LetterContentProps {
  isVisible: boolean;
}

type LetterType = 'worry' | 'answer';

// 기존 인터페이스와 호환성을 위해 유지
interface LetterParagraph {
  id: string;
  text: string;
}

// useRealLetter 훅에서 LetterTitle 타입을 사용하므로 여기서는 제거

// 기존 정적 데이터는 제거하고 useRealLetter 훅을 사용

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('worry');
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);
  const [hasViewedAnswer, setHasViewedAnswer] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  // 실제 편지 데이터 가져오기
  const {
    worryContent,
    answerContent,
    letterTitles: realLetterTitles,
    isLoading: letterLoading,
  } = useRealLetter();

  // 현재 활성 탭에 따른 편지 내용
  const letterContent: LetterParagraph[] = activeTab === 'worry' ? worryContent : answerContent;
  const letterTitle = activeTab === 'worry' ? realLetterTitles.worry : realLetterTitles.answer;

  const { handleTextSelection, renderHighlightedText } = useLetterHighlights({
    letterType: activeTab,
    letterContent,
    date: currentDate,
  });

  // 편지 내용 변경 시 페이드 효과
  const changeLetterContent = (type: LetterType) => {
    if (type === activeTab) return;

    setContentChanging(true);
    setFadeIn(false);

    if (type === 'answer') {
      setHasViewedAnswer(true);
    }

    setTimeout(() => {
      setActiveTab(type);
      setFadeIn(true);
      setContentChanging(false);
    }, 300);
  };

  useEffect(() => {
    if (isVisible) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isVisible]);

  // 편지 로딩 중일 때 표시
  if (letterLoading) {
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
            <button
              className={`py-1 px-4 rounded-t-lg text-sm transition-colors ${
                activeTab === 'worry'
                  ? 'bg-[#FFDB68] text-black font-medium z-10'
                  : 'bg-[#FFEDB5] text-black active:bg-[#fee9a1]'
              }`}
              onClick={() => changeLetterContent('worry')}
              disabled={contentChanging}
            >
              고민편지
            </button>
            <button
              className={`py-1 px-4 rounded-t-lg text-sm transition-colors ${
                activeTab === 'answer'
                  ? 'bg-[#FFDB68] text-black font-medium z-10'
                  : 'bg-[#FFEDB5] text-black active:bg-[#fee9a1]'
              }`}
              onClick={() => changeLetterContent('answer')}
              disabled={contentChanging}
            >
              답장편지
            </button>
          </div>
        </div>

        <div className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] transition-opacity duration-300 ease-in-out overflow-y-auto overflow-hidden break-keep">
          <div className="flex flex-col items-center mb-5 relative">
            <Image src={postboxIcon} alt="편지함 아이콘" width={50} height={50} priority />

            <h3 className="text-center mt-3 font-medium text-lg text-amber-800 whitespace-pre-line">
              {letterTitle.title}
            </h3>
            <p className="text-end text-sm text-amber-700 mt-1 w-full">{letterTitle.subtitle}</p>
          </div>

          <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
            {letterContent.length > 0 ? (
              letterContent.map((paragraph) => (
                <p
                  id={`paragraph-${paragraph.id}`}
                  key={paragraph.id}
                  className=" text-gray-700 cursor-text"
                  onClick={(e) =>
                    activeTab === 'answer'
                      ? handleTextSelection(paragraph.id, paragraph.text, e)
                      : ''
                  }
                >
                  {renderHighlightedText(paragraph.text, paragraph.id)}
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

        {hasViewedAnswer && (
          <div className="absolute bottom-8 right-8 z-40">
            <Link href="/other-empathy/3">
              <div
                className=" p-4.5 rounded-full bg-[#FFEDB5] active:bg-[#fee9a1] cursor-pointer"
                style={{ boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.3)' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
