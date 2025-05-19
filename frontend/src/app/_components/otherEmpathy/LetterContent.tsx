'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postboxIcon from '@/assets/images/postbox-icon.png';

interface LetterContentProps {
  isVisible: boolean;
}

type LetterType = 'worry' | 'answer';

interface HighlightedText {
  id: string;
  text: string;
  isHighlighted: boolean;
}

// 걱정 편지 내용과 답장 편지 내용 데이터
const worryLetterContent = [
  { id: 'w1', text: '* 지금 회사에서 일어난 일이 잘 맞는지요?', isHighlighted: false },
  { id: 'w2', text: '회사일로 힘들긴 해요...', isHighlighted: false },
  {
    id: 'w3',
    text: '요즘 회사에서 급작스러운 프로젝트 변경으로 스트레스가 큽니다. 저도 잘못했다고 생각하는 부분이 있는데, 팀장님이 일방적으로 저를 탓하는 것 같아 억울해요.',
    isHighlighted: true,
  },
  {
    id: 'w4',
    text: '동시에 제 실수가 맞는지, 그래도 이렇게 질책 받을만큼 큰 문제인지 확신이 안 들어요.',
    isHighlighted: false,
  },
  {
    id: 'w5',
    text: '객관적인 시각으로 봤을 때 이런 상황에서 제가 정말 문제인걸까요?',
    isHighlighted: false,
  },
];

const answerLetterContent = [
  { id: 'a1', text: '* 힘든 일을 겪고 계시는군요.', isHighlighted: false },
  {
    id: 'a2',
    text: '프로젝트 변경으로 인한 스트레스와 팀장님의 질책으로 힘드실 것 같아요.',
    isHighlighted: false,
  },
  {
    id: 'a3',
    text: '객관적인 판단을 원하시는 마음이 느껴집니다. 실수가 있었다고 느끼시면서도, 일방적인 비난이 부당하게 느껴지는 건 자연스러운 감정이에요.',
    isHighlighted: true,
  },
  {
    id: 'a4',
    text: '이런 상황에서는 팀장님과 직접 대화를 통해 오해를 풀어보는 것도 좋은 방법이 될 수 있을 것 같습니다.',
    isHighlighted: false,
  },
  {
    id: 'a5',
    text: '힘든 시간이지만 스스로를 너무 몰아세우지 마시고, 객관적인 평가와 함께 자신을 돌보는 시간도 가지시길 바랍니다.',
    isHighlighted: false,
  },
];

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('worry');
  const [letterContent, setLetterContent] = useState<HighlightedText[]>(worryLetterContent);
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);

  // 편지 내용 변경 시 페이드 효과
  const changeLetterContent = (type: LetterType) => {
    if (type === activeTab) return;

    setContentChanging(true);
    setFadeIn(false);

    setTimeout(() => {
      setActiveTab(type);
      setLetterContent(type === 'worry' ? worryLetterContent : answerLetterContent);
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

  // 하이라이트 토글 함수
  const toggleHighlight = (id: string) => {
    setLetterContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isHighlighted: !item.isHighlighted } : item))
    );
  };

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
        isVisible && fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute top-0 w-full flex justify-end px-4 py-2">
        <div className="flex space-x-2">
          <button
            className={`py-1 px-3 rounded-full text-sm transition-colors duration-300 ${
              activeTab === 'worry'
                ? 'bg-yellow-500 text-black font-medium'
                : 'bg-white/80 text-black'
            }`}
            onClick={() => changeLetterContent('worry')}
            disabled={contentChanging}
          >
            고민편지
          </button>
          <button
            className={`py-1 px-3 rounded-full text-sm transition-colors duration-300 ${
              activeTab === 'answer'
                ? 'bg-yellow-500 text-black font-medium'
                : 'bg-white/80 text-black'
            }`}
            onClick={() => changeLetterContent('answer')}
            disabled={contentChanging}
          >
            답장편지
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg max-w-md w-full mx-auto p-6 z-20 shadow-lg transition-opacity duration-300 ease-in-out">
        <div className="flex flex-col items-center mb-5">
          <Image src={postboxIcon} alt="편지함 아이콘" width={50} height={50} priority />
          <h3 className="text-center mt-3 font-medium text-lg text-amber-800">
            {activeTab === 'worry'
              ? '혼자만의는 편안함 못 그리워도'
              : '소중한 공감이 전해지길 바라요'}
          </h3>
          <p className="text-center text-sm text-amber-700 mt-1">
            {activeTab === 'worry'
              ? '소중한 공유하는 것은 부담 없이 편안하게'
              : '* 지금 회사에서의 어려움을 공감해요'}
          </p>
        </div>

        <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
          {letterContent.map((paragraph) => (
            <p
              key={paragraph.id}
              className={`text-sm ${
                paragraph.isHighlighted ? 'bg-yellow-100 p-2 rounded ' : 'text-gray-700'
              } cursor-pointer transition-all duration-200`}
              onClick={() => toggleHighlight(paragraph.id)}
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
