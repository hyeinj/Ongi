'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useLetterHighlights } from '@/ui/hooks/useLetterHighlights';
import { useLetter } from '@/ui/hooks/useLetter';
import { RealLetterData } from '@/core/entities/letter';
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

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('answer');
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);
  const [realLetterData, setRealLetterData] = useState<RealLetterData | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  // 실제 편지 데이터 가져오기
  const { getRealLetter, isLoading: letterLoading } = useLetter();

  // 편지 데이터 로드
  useEffect(() => {
    const fetchRealLetter = async () => {
      try {
        const letterData = await getRealLetter();
        if (letterData) {
          setRealLetterData(letterData);
        }
      } catch (error) {
        console.error('편지 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchRealLetter();
  }, [getRealLetter]);

  // 툴팁 표시 로직
  useEffect(() => {
    if (realLetterData && isVisible && fadeIn) {
      // 이미 툴팁을 본 적이 있는지 확인
      const hasSeenTooltip = localStorage.getItem('otherEmpathy-tooltip-seen');

      if (!hasSeenTooltip) {
        // 렌더링 완료 후 툴팁 표시
        const showTimer = setTimeout(() => {
          setShowTooltip(true);
        }, 500); // 렌더링 완료 후 0.5초 대기

        // 9초 후 툴팁 숨김
        const hideTimer = setTimeout(() => {
          setShowTooltip(false);
          // 툴팁을 본 것으로 표시
          localStorage.setItem('otherEmpathy-tooltip-seen', 'true');
        }, 9500); // 0.5초 대기 + 9초 표시

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [realLetterData, isVisible, fadeIn]);

  // 현재 활성 탭에 따른 편지 내용
  const letterContent: LetterParagraph[] =
    activeTab === 'worry'
      ? realLetterData?.worryContent || []
      : realLetterData?.answerContent || [];

  const letterTitle = {
    title: realLetterData?.letterTitle || '편지를 불러오는 중...',
    subtitle: activeTab === 'worry' ? '고민을 나눠주신 분께서' : '따뜻한 마음을 전해주신 분께서',
  };

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
  if (letterLoading || !realLetterData) {
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
                  : 'bg-[#919191] text-black active:bg-[#fee9a1]'
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
                  : 'bg-[#919191] text-black active:bg-[#fee9a1]'
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
            <Image
              src={postboxIcon}
              alt="편지함 아이콘"
              width={50}
              height={50}
              priority
              loading="eager"
            />

            {/* 툴팁 말풍선 */}
            {showTooltip && (
              <div className="absolute -top-2 right-5 z-50">
                <div className="relative bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 animate-bounce">
                  <p className="text-sm text-gray-700 whitespace-nowrap font-medium">
                    마음에 드는 문장을 눌러보세요
                  </p>
                  {/* 말풍선 꼬리 */}
                  <div className="absolute bottom-0 left-4 transform translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-center mt-3 font-medium text-lg text-amber-800 whitespace-pre-line">
              {letterTitle.title}
            </h3>
            <p className="text-end text-sm text-amber-700 mt-1 w-full animate-pulse">
              {letterTitle.subtitle}
            </p>
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

        <div className="absolute bottom-8 right-8 z-40">
          <Link href="/other-empathy/2">
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
      </div>
    </div>
  );
}
