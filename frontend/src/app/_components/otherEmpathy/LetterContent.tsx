'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postboxIcon from '@/assets/images/postbox-icon.png';

interface LetterContentProps {
  isVisible: boolean;
}

type LetterType = 'worry' | 'answer';

interface LetterParagraph {
  id: string;
  text: string;
}

// 하이라이트 정보를 저장하기 위한 인터페이스
interface Highlight {
  id: string; // 고유 ID
  text: string; // 하이라이트된 텍스트
  letterType: LetterType; // 어떤 편지에서 하이라이트했는지
  paragraphId: string; // 어떤 문단에서 하이라이트했는지
  startIndex: number; // 하이라이트 시작 위치
  endIndex: number; // 하이라이트 끝 위치
  createdAt: number; // 생성 시간
}

// 걱정 편지 내용과 답장 편지 내용 데이터
const worryLetterContent = [
  { id: 'w1', text: '* 지금 회사에서 일어난 일이 잘 맞는지요?' },
  { id: 'w2', text: '회사일로 힘들긴 해요...' },
  {
    id: 'w3',
    text: '요즘 회사에서 급작스러운 프로젝트 변경으로 스트레스가 큽니다. 저도 잘못했다고 생각하는 부분이 있는데, 팀장님이 일방적으로 저를 탓하는 것 같아 억울해요.',
  },
  {
    id: 'w4',
    text: '동시에 제 실수가 맞는지, 그래도 이렇게 질책 받을만큼 큰 문제인지 확신이 안 들어요.',
  },
  {
    id: 'w5',
    text: '객관적인 시각으로 봤을 때 이런 상황에서 제가 정말 문제인걸까요?',
  },
];

const answerLetterContent = [
  { id: 'a1', text: '* 힘든 일을 겪고 계시는군요.' },
  {
    id: 'a2',
    text: '프로젝트 변경으로 인한 스트레스와 팀장님의 질책으로 힘드실 것 같아요.',
  },
  {
    id: 'a3',
    text: '객관적인 판단을 원하시는 마음이 느껴집니다. 실수가 있었다고 느끼시면서도, 일방적인 비난이 부당하게 느껴지는 건 자연스러운 감정이에요.',
  },
  {
    id: 'a4',
    text: '이런 상황에서는 팀장님과 직접 대화를 통해 오해를 풀어보는 것도 좋은 방법이 될 수 있을 것 같습니다.',
  },
  {
    id: 'a5',
    text: '힘든 시간이지만 스스로를 너무 몰아세우지 마시고, 객관적인 평가와 함께 자신을 돌보는 시간도 가지시길 바랍니다.',
  },
];

// 로컬 스토리지 키
const STORAGE_KEY = 'letter_highlights';

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [activeTab, setActiveTab] = useState<LetterType>('worry');
  const [letterContent, setLetterContent] = useState<LetterParagraph[]>(worryLetterContent);
  const [fadeIn, setFadeIn] = useState(false);
  const [contentChanging, setContentChanging] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // 로컬 스토리지 관련 함수 (미래에 사용 예정)
  /*
  const loadHighlightsFromStorage = () => {
    if (typeof window === 'undefined') return; // SSR 대응
    
    try {
      const savedHighlights = localStorage.getItem(STORAGE_KEY);
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }
    } catch (error) {
      console.error('Failed to load highlights from localStorage:', error);
    }
  };

  const saveHighlightsToStorage = (updatedHighlights: Highlight[]) => {
    if (typeof window === 'undefined') return; // SSR 대응
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHighlights));
    } catch (error) {
      console.error('Failed to save highlights to localStorage:', error);
    }
  };
  */

  // 컴포넌트 마운트 시 로컬 스토리지에서 하이라이트 로드
  useEffect(() => {
    // 현재는 주석 처리 (미래에 사용)
    // loadHighlightsFromStorage();
  }, []);

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

  // 선택 영역이 기존 하이라이트와 겹치는지 확인
  const findOverlappingHighlights = (
    startIndex: number,
    endIndex: number,
    paragraphId: string
  ): Highlight[] => {
    return highlights.filter(
      (h) =>
        h.paragraphId === paragraphId &&
        h.letterType === activeTab &&
        // 1. 선택 영역이 하이라이트 내부에 완전히 포함되는 경우
        // 2. 하이라이트가 선택 영역 내부에 완전히 포함되는 경우
        // 3. 선택 영역의 일부만 하이라이트와 겹치는 경우
        ((startIndex >= h.startIndex && startIndex < h.endIndex) ||
          (endIndex > h.startIndex && endIndex <= h.endIndex) ||
          (startIndex <= h.startIndex && endIndex >= h.endIndex))
    );
  };

  // 새 하이라이트 아이디 생성
  const generateHighlightId = () => {
    return `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 텍스트 선택 시 하이라이트 처리
  const handleTextSelection = (paragraphId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // 기본 동작 방지

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    const paragraph = letterContent.find((p) => p.id === paragraphId);

    if (!paragraph) return;

    // 선택 영역의 인덱스 계산
    const paragraphElement = document.getElementById(`paragraph-${paragraphId}`);
    if (!paragraphElement) return;

    // 문단 내에서의 시작과 끝 인덱스 계산
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(paragraphElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startIndex = preSelectionRange.toString().length;
    const endIndex = startIndex + selectedText.length;

    // 기존 하이라이트와 겹치는 영역 확인
    const overlappingHighlights = findOverlappingHighlights(startIndex, endIndex, paragraphId);

    // 하이라이트 업데이트 처리
    if (overlappingHighlights.length > 0) {
      // 해당 문단의 모든 하이라이트 가져오기
      const currentHighlights = [...highlights];
      const newHighlights: Highlight[] = [];

      currentHighlights.forEach((highlight) => {
        // 겹치지 않는 하이라이트는 그대로 유지
        if (!overlappingHighlights.some((oh) => oh.id === highlight.id)) {
          newHighlights.push(highlight);
          return;
        }

        // 겹치는 하이라이트 처리
        const h = highlight;

        // 케이스 1: 선택 영역이 하이라이트 시작 부분과 겹침
        if (startIndex <= h.startIndex && endIndex > h.startIndex && endIndex < h.endIndex) {
          // 선택 영역 이후 부분만 하이라이트로 유지
          newHighlights.push({
            id: generateHighlightId(),
            text: paragraph.text.substring(endIndex, h.endIndex),
            letterType: h.letterType,
            paragraphId: h.paragraphId,
            startIndex: endIndex,
            endIndex: h.endIndex,
            createdAt: Date.now(),
          });
        }
        // 케이스 2: 선택 영역이 하이라이트 끝 부분과 겹침
        else if (startIndex > h.startIndex && startIndex < h.endIndex && endIndex >= h.endIndex) {
          // 선택 영역 이전 부분만 하이라이트로 유지
          newHighlights.push({
            id: generateHighlightId(),
            text: paragraph.text.substring(h.startIndex, startIndex),
            letterType: h.letterType,
            paragraphId: h.paragraphId,
            startIndex: h.startIndex,
            endIndex: startIndex,
            createdAt: Date.now(),
          });
        }
        // 케이스 3: 선택 영역이 하이라이트 중간에 있음
        else if (startIndex > h.startIndex && endIndex < h.endIndex) {
          // 선택 영역 앞부분 하이라이트
          newHighlights.push({
            id: generateHighlightId(),
            text: paragraph.text.substring(h.startIndex, startIndex),
            letterType: h.letterType,
            paragraphId: h.paragraphId,
            startIndex: h.startIndex,
            endIndex: startIndex,
            createdAt: Date.now(),
          });

          // 선택 영역 뒷부분 하이라이트
          newHighlights.push({
            id: generateHighlightId(),
            text: paragraph.text.substring(endIndex, h.endIndex),
            letterType: h.letterType,
            paragraphId: h.paragraphId,
            startIndex: endIndex,
            endIndex: h.endIndex,
            createdAt: Date.now(),
          });
        }
        // 케이스 4: 선택 영역이 하이라이트 전체를 포함
        // 이 경우 아무것도 추가하지 않음 (하이라이트 완전 제거)
      });

      setHighlights(newHighlights);
    } else {
      // 겹치는 하이라이트가 없으면 새 하이라이트 추가
      const newHighlight: Highlight = {
        id: generateHighlightId(),
        text: selectedText,
        letterType: activeTab,
        paragraphId: paragraphId,
        startIndex,
        endIndex,
        createdAt: Date.now(),
      };

      setHighlights((prev) => [...prev, newHighlight]);
    }

    // 선택 초기화
    selection.removeAllRanges();
  };

  // 특정 문단의 하이라이트만 필터링
  const getHighlightsForParagraph = (paragraphId: string) => {
    return highlights.filter((h) => h.paragraphId === paragraphId && h.letterType === activeTab);
  };

  // 텍스트에 하이라이트 적용 (텍스트의 위치 기반)
  const renderHighlightedText = (text: string, paragraphId: string) => {
    const paragraphHighlights = getHighlightsForParagraph(paragraphId);

    if (paragraphHighlights.length === 0) {
      return <span>{text}</span>;
    }

    // 하이라이트를 시작 위치 기준으로 정렬
    const sortedHighlights = [...paragraphHighlights].sort((a, b) => a.startIndex - b.startIndex);

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, idx) => {
      // 하이라이트 앞 부분 텍스트 추가
      if (highlight.startIndex > lastIndex) {
        result.push(
          <span key={`text-${idx}-${lastIndex}`}>
            {text.substring(lastIndex, highlight.startIndex)}
          </span>
        );
      }

      // 하이라이트된 텍스트 추가
      result.push(
        <span key={`highlight-${highlight.id}`} className="bg-yellow-100 px-1 py-0.5 rounded">
          {text.substring(highlight.startIndex, highlight.endIndex)}
        </span>
      );

      lastIndex = highlight.endIndex;
    });

    // 마지막 하이라이트 이후 텍스트 추가
    if (lastIndex < text.length) {
      result.push(<span key={`text-end-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return <>{result}</>;
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
              id={`paragraph-${paragraph.id}`}
              key={paragraph.id}
              className="text-sm text-gray-700 cursor-text"
              onMouseUp={(e) => handleTextSelection(paragraph.id, e)}
              onTouchEnd={(e) => handleTextSelection(paragraph.id, e)}
            >
              {renderHighlightedText(paragraph.text, paragraph.id)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
