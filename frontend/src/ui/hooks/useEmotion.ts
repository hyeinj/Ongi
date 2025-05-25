import { useState, useCallback } from 'react';
import { EmotionUseCases } from '../../core/usecases/emotionUseCases';
import { QuestionService } from '../../services/api/questionService';
import { EmotionStorage } from '../../services/storage/emotionStorage';
import { DailyEmotion, Category, EmotionType } from '../../core/entities';

// 간소화된 감정 훅
export const useEmotion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 의존성을 직접 생성 (DI Container 제거)
  const emotionUseCases = new EmotionUseCases();
  const questionService = new QuestionService();
  const emotionStorage = new EmotionStorage();

  // 감정 엔트리 저장
  const saveEmotionEntry = useCallback(async (
    date: string,
    stage: string,
    question: string,
    answer: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await emotionUseCases.saveEmotionEntry(
        date,
        stage,
        question,
        answer,
        emotionStorage.saveStageEntry.bind(emotionStorage)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '감정 저장에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 다음 질문 생성
  const generateNextQuestion = useCallback(async (
    step2Answer: string,
    step3Answer?: string,
    step4Feelings?: string[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await emotionUseCases.generateNextQuestion(
        step2Answer,
        questionService.generateQuestion.bind(questionService),
        step3Answer,
        step4Feelings
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '질문 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 감정 분석
  const analyzeEmotion = useCallback(async (allAnswers: { [stage: string]: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await emotionUseCases.analyzeEmotion(
        allAnswers,
        questionService.analyzeEmotion.bind(questionService)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '감정 분석에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 최종 텍스트 생성
  const generateFinalText = useCallback(async (
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await emotionUseCases.generateFinalText(
        allAnswers,
        category,
        emotion,
        questionService.generateFinalText.bind(questionService)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '텍스트 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 감정 데이터 조회
  const getEmotionData = useCallback(async (date: string): Promise<DailyEmotion | null> => {
    try {
      setError(null);
      return await emotionStorage.getByDate(date);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '감정 데이터 조회에 실패했습니다.';
      setError(errorMessage);
      return null;
    }
  }, []);

  // 카테고리와 감정 업데이트
  const updateCategoryAndEmotion = useCallback(async (
    date: string,
    category: Category,
    emotion: EmotionType
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await emotionStorage.updateCategoryAndEmotion(date, category, emotion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '카테고리/감정 업데이트에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    saveEmotionEntry,
    generateNextQuestion,
    analyzeEmotion,
    generateFinalText,
    getEmotionData,
    updateCategoryAndEmotion,
  };
}; 