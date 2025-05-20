'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useLetterHighlights } from '@/infra/useLetterHighlights';
import localFont from 'next/font/local';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

interface LetterContentProps {
  isVisible: boolean;
}

type LetterType = 'worry' | 'answer';

interface LetterParagraph {
  id: string;
  text: string;
}

// 타이틀 정보를 담는 인터페이스
interface LetterTitle {
  title: string;
  subtitle: string;
}

// 문단 ID 생성 헬퍼 함수
const createParagraphs = (type: string, texts: string[]): LetterParagraph[] => {
  return texts.map((text, index) => ({
    id: `${type}${index + 1}`,
    text,
  }));
};

// 편지 내용 데이터
const worryLetterContent = createParagraphs('w', [
  '* 지금 회사에서 일어난 일이 잘 맞는지요?',
  '회사일로 힘들긴 해요...',
  '요즘 회사에서 급작스러운 프로젝트 변경으로 스트레스가 큽니다. 저도 잘못했다고 생각하는 부분이 있는데, 팀장님이 일방적으로 저를 탓하는 것 같아 억울해요.',
  '동시에 제 실수가 맞는지, 그래도 이렇게 질책 받을만큼 큰 문제인지 확신이 안 들어요.',
  '객관적인 시각으로 봤을 때 이런 상황에서 제가 정말 문제인걸까요?',
]);

const answerLetterContent = createParagraphs('a', [
  '* 힘든 일을 겪고 계시는군요.',
  '프로젝트 변경으로 인한 스트레스와 팀장님의 질책으로 힘드실 것 같아요.',
  '객관적인 판단을 원하시는 마음이 느껴집니다. 실수가 있었다고 느끼시면서도, 일방적인 비난이 부당하게 느껴지는 건 자연스러운 감정이에요.',
  '이런 상황에서는 팀장님과 직접 대화를 통해 오해를 풀어보는 것도 좋은 방법이 될 수 있을 것 같습니다.',
  '힘든 시간이지만 스스로를 너무 몰아세우지 마시고, 객관적인 평가와 함께 자신을 돌보는 시간도 가지시길 바랍니다.',
]);

// 편지 제목 데이터
const letterTitles: Record<LetterType, LetterTitle> = {
  worry: {
    title: '혼자만의는 편안함 못 그리워도',
    subtitle: '소중한 공유하는 것은 부담 없이 편안하게',
  },
  answer: {
    title: '소중한 공감이 전해지길 바라요',
    subtitle: '* 지금 회사에서의 어려움을 공감해요',
  },
};

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('worry');
  const [letterContent, setLetterContent] = useState<LetterParagraph[]>(worryLetterContent);
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);
  const [letterTitle, setLetterTitle] = useState<LetterTitle>(letterTitles.worry);

  const { handleTextSelection, renderHighlightedText } = useLetterHighlights({
    letterType: activeTab,
    letterContent,
  });

  // 편지 내용 변경 시 페이드 효과
  const changeLetterContent = (type: LetterType) => {
    if (type === activeTab) return;

    setContentChanging(true);
    setFadeIn(false);

    setTimeout(() => {
      setActiveTab(type);
      setLetterContent(type === 'worry' ? worryLetterContent : answerLetterContent);
      setLetterTitle(letterTitles[type]);
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

        <div className="relative bg-[#F7F4E6] w-full mx-auto p-6 z-20 h-[80vh] transition-opacity duration-300 ease-in-out overflow-y-auto">
          <div className="flex flex-col items-center mb-5">
            <Image src={postboxIcon} alt="편지함 아이콘" width={50} height={50} priority />
            <h3 className="text-center mt-3 font-medium text-lg text-amber-800">
              {letterTitle.title}
            </h3>
            <p className="text-center text-sm text-amber-700 mt-1">{letterTitle.subtitle}</p>
          </div>

          <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
            {letterContent.map((paragraph) => (
              <p
                id={`paragraph-${paragraph.id}`}
                key={paragraph.id}
                className=" text-gray-700 cursor-text"
                onClick={(e) => handleTextSelection(paragraph.id, paragraph.text, e)}
              >
                {renderHighlightedText(paragraph.text, paragraph.id)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
