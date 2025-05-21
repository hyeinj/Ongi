'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, EmotionType } from '@/entity';
import { addEmotionEntry, setCategoryAndEmotion } from '@/infra/emotionStorage';
import {
  generateFirstQuestion,
  generateFollowUpQuestion,
  generateFinalEmpathy,
} from '@/app/_actions/openai';

// 질문과 답변 타입
export interface Conversation {
  question: string;
  answer: string;
}

// 컨텍스트 상태 타입
interface SelfEmpathyState {
  // 현재 단계의 smallText와 largeText
  smallText: string;
  largeText: string;

  // 사용자 답변
  userAnswer: string;

  // 대화 기록 (질문-답변 쌍)
  conversations: Conversation[];

  // 최종 공감 메시지, 카테고리, 감정
  empathyMessage: string;
  category: Category;
  emotion: EmotionType;

  // 로딩 상태
  isLoading: boolean;

  // 초기화 상태
  isInitialized: boolean;
}

// 컨텍스트 액션 타입
interface SelfEmpathyActions {
  // 사용자 답변 업데이트
  setUserAnswer: (answer: string) => void;

  // 첫 번째 질문 생성
  generateInitialQuestion: () => Promise<void>;

  // 다음 질문 생성
  generateNextQuestion: () => Promise<{ success: boolean; error?: unknown } | void>;

  // 최종 공감 메시지 생성
  generateEmpathy: () => Promise<{ success: boolean; error?: unknown } | void>;

  // 컨텍스트 초기화
  resetContext: () => void;
}

// 컨텍스트 타입
export type SelfEmpathyContextType = SelfEmpathyState & SelfEmpathyActions;

// 기본 상태 값
const initialState: SelfEmpathyState = {
  smallText: '',
  largeText: '',
  userAnswer: '',
  conversations: [],
  empathyMessage: '',
  category: 'self',
  emotion: 'peace',
  isLoading: false,
  isInitialized: false,
};

// 컨텍스트 생성
const SelfEmpathyContext = createContext<SelfEmpathyContextType | undefined>(undefined);

// 컨텍스트 훅
export function useSelfEmpathy() {
  const context = useContext(SelfEmpathyContext);
  if (context === undefined) {
    throw new Error('useSelfEmpathy must be used within a SelfEmpathyProvider');
  }
  return context;
}

// 컨텍스트 제공자
export function SelfEmpathyProvider({ children }: { children: ReactNode }) {
  // 상태 관리
  const [state, setState] = useState<SelfEmpathyState>(initialState);

  // 사용자 답변 업데이트
  const setUserAnswer = (answer: string) => {
    setState((prev) => ({
      ...prev,
      userAnswer: answer,
    }));
  };

  // 첫 번째 질문 생성
  const generateInitialQuestion = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // GPT를 사용하여 첫 번째 질문 생성
      const { smallText, largeText } = await generateFirstQuestion();

      setState((prev) => ({
        ...prev,
        smallText,
        largeText,
        isInitialized: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('초기 질문 생성 중 오류:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 다음 질문 생성
  const generateNextQuestion = async () => {
    try {
      // 사용자 답변이 비어있으면 처리하지 않음
      if (!state.userAnswer.trim()) {
        return;
      }

      // 먼저 로딩 상태로 변경
      setState((prev) => ({ ...prev, isLoading: true }));

      // smallText와 largeText를 합쳐서 완전한 질문 구성
      const fullQuestion = `${state.smallText} ${state.largeText}`.trim();

      // 현재 질문과 사용자 답변을 대화 기록에 추가
      const currentQA: Conversation = {
        question: fullQuestion,
        answer: state.userAnswer,
      };

      // 로컬 스토리지에 질문-답변 저장
      addEmotionEntry({
        question: fullQuestion,
        answer: state.userAnswer,
      });

      // 새로운 대화 기록
      const updatedConversations = [...state.conversations, currentQA];

      // 먼저 userAnswer를 초기화하여 다음 화면으로 넘어갔을 때 이전 답변이 보이지 않도록 함
      setState((prev) => ({
        ...prev,
        userAnswer: '',
      }));

      // GPT를 사용하여 다음 질문 생성
      const { smallText, largeText } = await generateFollowUpQuestion(updatedConversations);

      // 나머지 상태 업데이트
      setState((prev) => ({
        ...prev,
        smallText,
        largeText,
        conversations: updatedConversations,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('다음 질문 생성 중 오류:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error };
    }
  };

  // 최종 공감 메시지 생성
  const generateEmpathy = async () => {
    try {
      // 사용자 답변이 비어있으면 처리하지 않음
      if (!state.userAnswer.trim()) {
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      // smallText와 largeText를 합쳐서 완전한 질문 구성
      const fullQuestion = `${state.smallText} ${state.largeText}`.trim();

      // 마지막 질문과 사용자 답변을 대화 기록에 추가
      const currentQA: Conversation = {
        question: fullQuestion,
        answer: state.userAnswer,
      };

      // 로컬 스토리지에 질문-답변 저장
      addEmotionEntry({
        question: fullQuestion,
        answer: state.userAnswer,
      });

      // 새로운 대화 기록
      const updatedConversations = [...state.conversations, currentQA];

      // 먼저 userAnswer를 초기화하여 다음 화면으로 넘어갔을 때 이전 답변이 보이지 않도록 함
      setState((prev) => ({
        ...prev,
        userAnswer: '',
      }));

      // GPT를 사용하여 최종 공감 메시지 생성
      const { empathyMessage, category, emotion } = await generateFinalEmpathy(
        updatedConversations
      );

      // 카테고리와 감정 타입 검증
      const validCategory = ['self', 'growth', 'routine', 'relationship'].includes(category)
        ? (category as Category)
        : 'self';

      const validEmotion = ['joy', 'sadness', 'anger', 'anxiety', 'peace'].includes(emotion)
        ? (emotion as EmotionType)
        : 'peace';

      // 로컬 스토리지에 카테고리와 감정 저장
      setCategoryAndEmotion(validCategory, validEmotion);

      setState((prev) => ({
        ...prev,
        empathyMessage,
        category: validCategory,
        emotion: validEmotion,
        conversations: updatedConversations,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('공감 메시지 생성 중 오류:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error };
    }
  };

  // 컨텍스트 초기화
  const resetContext = () => {
    setState(initialState);
  };

  // 컴포넌트 첫 렌더링 시 초기 질문 생성
  useEffect(() => {
    if (!state.isInitialized && !state.isLoading) {
      generateInitialQuestion();
    }
  }, [state.isInitialized, state.isLoading]);

  // 컨텍스트 값
  const contextValue: SelfEmpathyContextType = {
    ...state,
    setUserAnswer,
    generateInitialQuestion,
    generateNextQuestion,
    generateEmpathy,
    resetContext,
  };

  return <SelfEmpathyContext.Provider value={contextValue}>{children}</SelfEmpathyContext.Provider>;
}
