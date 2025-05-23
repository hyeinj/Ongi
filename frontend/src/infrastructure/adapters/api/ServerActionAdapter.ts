import { 
  generateStep3Question,
  generateStep4Question,
  generateStep5Question,
  generateNextQuestion,
  analyzeEmotionAndCategory,
  generateFinalCardText,
  generateStep6Texts,
} from '../../../app/actions/questionActions';

import {
  generateMockLetter,
  generateFeedback,
} from '../../../app/actions/letterActions';

import { Category, EmotionType } from '../../../domain/entities/Emotion';

/**
 * Next.js 서버 액션들을 어댑터 패턴으로 래핑하여
 * 인프라스트럭처 레이어에서 사용할 수 있도록 합니다.
 */
export class ServerActionAdapter {
  // Question Generation 관련 메서드들
  async generateStep3Question(step2Answer: string): Promise<{
    question: string;
    success: boolean;
    error?: string;
  }> {
    return await generateStep3Question(step2Answer);
  }

  async generateStep4Question(step2Answer: string, step3Answer: string): Promise<{
    question: string;
    success: boolean;
    error?: string;
  }> {
    return await generateStep4Question(step2Answer, step3Answer);
  }

  async generateStep5Question(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<{
    question: string;
    success: boolean;
    error?: string;
  }> {
    return await generateStep5Question(step2Answer, step3Answer, step4Feelings);
  }

  async generateNextQuestion(
    previousAnswers: { [stage: string]: string },
    feelings?: string[]
  ): Promise<{
    question: string;
    success: boolean;
    error?: string;
  }> {
    return await generateNextQuestion(previousAnswers, feelings);
  }

  async analyzeEmotionAndCategory(allAnswers: {
    [stage: string]: string;
  }): Promise<{
    category: Category;
    emotion: EmotionType;
    success: boolean;
    error?: string;
  }> {
    return await analyzeEmotionAndCategory(allAnswers);
  }

  async generateFinalCardText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<{
    finalText: string;
    success: boolean;
    error?: string;
  }> {
    return await generateFinalCardText(allAnswers, category, emotion);
  }

  async generateStep6Texts(allAnswers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    success: boolean;
    error?: string;
  }> {
    return await generateStep6Texts(allAnswers);
  }

  // Letter Generation 관련 메서드들
  async generateMockLetter(emotionContext: {
    category: string;
    emotion: string;
    answers: { [stage: string]: string };
  }): Promise<{
    mockLetter: string;
    realLetterId: string;
    success: boolean;
    error?: string;
  }> {
    return await generateMockLetter(emotionContext);
  }

  async generateFeedback(
    mockLetter: string,
    userResponse: string,
    emotionContext: {
      category: string;
      emotion: string;
      answers: { [stage: string]: string };
    }
  ): Promise<{
    feedback: string;
    highlightedParts: string[];
    success: boolean;
    error?: string;
  }> {
    return await generateFeedback(mockLetter, userResponse, emotionContext);
  }
} 