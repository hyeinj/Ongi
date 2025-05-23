'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useLetterHighlights } from '@/presentation/hooks/useLetterHighlights';
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
  '안녕하세요, 다니던 직장을 그만두고 남들과는 다른 길을 택한 30대 남자입니다.',
  '이 긴 여정에 저는 종종 외롭고, 지쳐버리는 것만 같네요.',
  '다시 삶이 즐겁고, 희망으로 차오르고, 외로움이 덜어지면 좋겠습니다.',
  '어떻게 하면 고민이 덜어질까요? 답을 주신다면, 온기에 제 마음을 담아 감사하겠습니다.',
]);

const answerLetterContent = createParagraphs('a', [
  '온기님, 오늘 하루 어떤 일이 있었나요?',
  '온기님을 둘러싼 세상이 오늘 하루 버겁게 다가왔을지. 혹은 어제보다는 조금 나마진 하루였을지 궁금합니다. 무슨 일이 있으셨든.',
  '몬기님, 오늘 하루 정말 수고 많으셨어요.',
  '온기님께서 이 편지를 받아보실 조음. 그날 날씨는 어떨까요? 그늘진 곳에서 느껴지는 차가운 기운 대신 , 오늘 제게 닿은 오후의 햇살을 가득 담아 온기님께 전해드리고 싶어요.',
  '위기와 역경을 딛고 썼다는 것은. 온기님께서 위기와 역경을 마주한 적이 있으셨다는 것이겠죠? 얼마나 힘들고, 마음이 아프셨을까요. 제가 감히 삼상할',
  '잣대는 어떤 모양일까요. 별 모양, 나뭇잎 모양, 세모. 네모.... 사실 우리 모두는 그런 정형화된 모양으로 찍어낼 수 없는 소중한 이들인데 말이에요. 온기님, 좌절하셔도 괜찮아요. 깊은 고민을 하며 시간을 보내셔도 괜찮아요. 고민 끝에 눈물을 흘리 셔도 정말 괜찮아요. 그러한 치열한 고민 끝에 온기님께서 내리신 결론이 아름답게 빛나고 있었으면 좋겠어요. 나는 존재만으로 반짝이고 있구나, 도형 틀로 찍힐 존재가 아니었어, 하고요.',
  '온기님, 어쩌면 온기님은 이미 즐거움과 희망을 스스로 만들어 주변에 전하고 계신 분일지도 몰라요. 온기님께서 마지막에 전해주신 그 한 문장으로 제 마음이 희망과 따뜻함으로 가득 찼거든요. 소중하게 빛나고 계신 온기님, 충분히 아름다우신 온기님.',
  '제가 온기님을 늘 응원하겠습니다.',
  '몬기님께 제 마음이 무사히 닿길 바라며...',
  '온기무체부 드림',
]);

// 편지 제목 데이터
const letterTitles: Record<LetterType, LetterTitle> = {
  worry: {
    title: `현재를 견뎌내는 긴 여정에 \n 외롭고, 지치는 것만 같아요.`,
    subtitle: '',
  },
  answer: {
    title: '온기님께서는 여전히, 늘 그래왔듯\n소중한 존재라는 것을 부디 잊지 않으시길 바라요.',
    subtitle: '※ 읽는 동안, 마음에 닿은 문장을 길게 눌러 하이라이트 해보세요.',
  },
};

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('worry');
  const [letterContent, setLetterContent] = useState<LetterParagraph[]>(worryLetterContent);
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);
  const [letterTitle, setLetterTitle] = useState<LetterTitle>(letterTitles.worry);
  const [hasViewedAnswer, setHasViewedAnswer] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

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

        <div className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] transition-opacity duration-300 ease-in-out overflow-y-auto overflow-hidden break-keep">
          <div className="flex flex-col items-center mb-5 relative">
            <Image src={postboxIcon} alt="편지함 아이콘" width={50} height={50} priority />

            <h3 className="text-center mt-3 font-medium text-lg text-amber-800 whitespace-pre-line">
              {letterTitle.title}
            </h3>
            <p className="text-end text-sm text-amber-700 mt-1 w-full">{letterTitle.subtitle}</p>
          </div>

          <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
            {letterContent.map((paragraph) => (
              <p
                id={`paragraph-${paragraph.id}`}
                key={paragraph.id}
                className=" text-gray-700 cursor-text"
                onClick={(e) =>
                  activeTab === 'answer' ? handleTextSelection(paragraph.id, paragraph.text, e) : ''
                }
              >
                {renderHighlightedText(paragraph.text, paragraph.id)}
              </p>
            ))}
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
