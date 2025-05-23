'use client';

import React, { useState, useEffect } from 'react';
import { useLetter } from './useLetter';

interface LetterParagraph {
  id: string;
  text: string;
}

type LetterType = 'worry' | 'answer';

// 하이라이트 정보를 저장하기 위한 인터페이스
export interface Highlight {
  id: string; // 고유 ID
  text: string; // 하이라이트된 텍스트
  letterType: LetterType; // 어떤 편지에서 하이라이트했는지
  paragraphId: string; // 어떤 문단에서 하이라이트했는지
  paragraphText: string; // 문단 전체 텍스트 (문단 식별용)
  sentenceIndex: number; // 문장 인덱스
  createdAt: number; // 생성 시간
}

// 훅 인터페이스
interface UseLetterHighlightsProps {
  letterType: LetterType;
  letterContent: LetterParagraph[];
  date?: string; // 편지 날짜 추가 (기본값: 오늘)
}

// 문장 분리 함수
const splitIntoSentences = (text: string): string[] => {
  // 마침표, 물음표, 느낌표로 문장 구분 (단, 줄바꿈도 하나의 문장 구분자로 간주)
  const result = text.split(/(?<=[.!?])\s+|(?<=\n)/);
  // 빈 문장 필터링
  return result.filter((sentence) => sentence.trim().length > 0);
};

export function useLetterHighlights({ letterType, letterContent, date }: UseLetterHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const { saveHighlight, getLetterData } = useLetter();
  const currentDate = date || new Date().toISOString().split('T')[0];

  // Letters 시스템에서 하이라이트 로드
  const loadHighlightsFromLetters = async () => {
    try {
      const letterData = await getLetterData(currentDate);
      if (letterData && letterData.highlightedParts) {
        // highlightedParts를 Highlight 객체로 변환
        const convertedHighlights: Highlight[] = letterData.highlightedParts
          .map((text, index) => {
            // 해당 텍스트가 포함된 문단 찾기
            for (const paragraph of letterContent) {
              const sentences = splitIntoSentences(paragraph.text);
              const sentenceIndex = sentences.findIndex(
                (sentence) => sentence.trim() === text.trim()
              );

              if (sentenceIndex !== -1) {
                return {
                  id: `highlight_${Date.now()}_${index}`,
                  text: text.trim(),
                  letterType,
                  paragraphId: paragraph.id,
                  paragraphText: paragraph.text,
                  sentenceIndex,
                  createdAt: Date.now(),
                };
              }
            }
            return null;
          })
          .filter((highlight): highlight is Highlight => highlight !== null);

        setHighlights(convertedHighlights);
      }
    } catch (error) {
      console.error('하이라이트 불러오기 실패:', error);
    }
  };

  // 하이라이트를 Letters 시스템에 저장
  const saveHighlightsToLetters = async (updatedHighlights: Highlight[]) => {
    try {
      // 현재 letterType에 해당하는 하이라이트만 필터링
      const currentTypeHighlights = updatedHighlights.filter((h) => h.letterType === letterType);

      // 하이라이트된 텍스트만 추출
      const highlightedParts = currentTypeHighlights.map((h) => h.text);

      await saveHighlight(highlightedParts, currentDate);
    } catch (error) {
      console.error('하이라이트 저장 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 Letters 시스템에서 하이라이트 로드
  useEffect(() => {
    loadHighlightsFromLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterContent, currentDate]); // letterContent 또는 날짜가 변경될 때마다 로드

  // 하이라이트 변경시 Letters 시스템에 저장
  useEffect(() => {
    if (highlights.length > 0) {
      saveHighlightsToLetters(highlights);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlights]);

  // 새 하이라이트 아이디 생성
  const generateHighlightId = () => {
    return `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 문장 클릭 시 하이라이트 처리
  const handleTextSelection = (
    paragraphId: string,
    paragraphText: string,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    event.preventDefault(); // 기본 동작 방지

    // 클릭한 요소 가져오기
    const target = event.target as HTMLElement;
    if (!target || !target.dataset.sentenceIndex) return;

    // 문장 인덱스 가져오기
    const sentenceIndex = parseInt(target.dataset.sentenceIndex, 10);

    // 문장 가져오기
    const sentences = splitIntoSentences(paragraphText);
    if (sentenceIndex >= sentences.length) return;

    const clickedSentence = sentences[sentenceIndex];

    // 이미 하이라이트된 문장인지 확인
    const existingHighlight = highlights.find(
      (h) =>
        h.paragraphId === paragraphId &&
        h.letterType === letterType &&
        h.sentenceIndex === sentenceIndex
    );

    if (existingHighlight) {
      // 이미 하이라이트된 문장이면 하이라이트 제거
      setHighlights((prev) => prev.filter((h) => h.id !== existingHighlight.id));
    } else {
      // 새로운 하이라이트 추가
      const newHighlight: Highlight = {
        id: generateHighlightId(),
        text: clickedSentence.trim(),
        letterType,
        paragraphId,
        paragraphText,
        sentenceIndex,
        createdAt: Date.now(),
      };

      setHighlights((prev) => [...prev, newHighlight]);
    }
  };

  // 특정 문단의 하이라이트만 필터링
  const getHighlightsForParagraph = (paragraphId: string) => {
    return highlights.filter((h) => h.paragraphId === paragraphId && h.letterType === letterType);
  };

  // 텍스트에 하이라이트 적용 (문장 기준)
  const renderHighlightedText = (text: string, paragraphId: string) => {
    const sentences = splitIntoSentences(text);
    const paragraphHighlights = getHighlightsForParagraph(paragraphId);

    if (sentences.length === 0) {
      return <span>{text}</span>;
    }

    return (
      <>
        {sentences.map((sentence, index) => {
          // 이 문장이 하이라이트되어 있는지 확인
          const isHighlighted = paragraphHighlights.some((h) => h.sentenceIndex === index);

          return (
            <span
              key={`sentence-${paragraphId}-${index}`}
              data-sentence-index={index}
              className={`${
                isHighlighted ? 'bg-yellow-100 px-1 py-0.5 rounded' : ''
              } cursor-pointer`}
            >
              {sentence}
              {index < sentences.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </>
    );
  };

  // 특정 문단의 하이라이트된 텍스트 목록 가져오기
  const getHighlightedTextsByParagraph = (paragraphId: string) => {
    return getHighlightsForParagraph(paragraphId).map((h) => h.text);
  };

  // 모든 하이라이트된 텍스트 가져오기
  const getAllHighlightedTexts = () => {
    return highlights
      .filter((h) => h.letterType === letterType)
      .map((h) => ({ text: h.text, paragraphId: h.paragraphId }));
  };

  return {
    highlights,
    handleTextSelection,
    renderHighlightedText,
    getHighlightedTextsByParagraph,
    getAllHighlightedTexts,
  };
}
