import { useState, useCallback, useEffect } from 'react';
import { DailyEmotion, Category, EmotionType } from '../../domain/entities/Emotion';
import { EmotionFacade } from '../facades/EmotionFacade';

interface UseEmotionReturn {
  // 상태
  emotionData: DailyEmotion | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  saveStep2AndGenerateStep3: (answer: string) => Promise<string | null>;
  saveStep3AndGenerateStep4: (question: string, answer: string) => Promise<string | null>;
  saveStep4FeelingsAndGenerateStep5: (
    question: string,
    emotionType: 'positive' | 'neutral' | 'negative',
    feelings: string[]
  ) => Promise<string | null>;
  saveStageAnswer: (stage: string, question: string, answer: string) => Promise<void>;
  updateCategoryAndEmotion: (category: Category, emotion: EmotionType) => Promise<void>;
  getStageAnswer: (stage: string) => Promise<string | null>;
  refreshEmotionData: () => Promise<void>;
  migrateFromLegacyStorage: () => Promise<void>;
}

export function useEmotion(): UseEmotionReturn {
  const [emotionData, setEmotionData] = useState<DailyEmotion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionFacade] = useState(() => new EmotionFacade());

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    setError(message);
    console.error('Emotion error:', err);
  }, []);

  const refreshEmotionData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await emotionFacade.getEmotionData();
      setEmotionData(data);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [emotionFacade, handleError]);

  const saveStep2AndGenerateStep3 = useCallback(
    async (answer: string): Promise<string | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const nextQuestion = await emotionFacade.saveStep2AndGenerateStep3(answer);
        await refreshEmotionData();
        return nextQuestion;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [emotionFacade, refreshEmotionData, handleError]
  );

  const saveStep3AndGenerateStep4 = useCallback(
    async (question: string, answer: string): Promise<string | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const nextQuestion = await emotionFacade.saveStep3AndGenerateStep4(question, answer);
        await refreshEmotionData();
        return nextQuestion;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [emotionFacade, refreshEmotionData, handleError]
  );

  const saveStep4FeelingsAndGenerateStep5 = useCallback(
    async (
      question: string,
      emotionType: 'positive' | 'neutral' | 'negative',
      feelings: string[]
    ): Promise<string | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const nextQuestion = await emotionFacade.saveStep4FeelingsAndGenerateStep5(
          question,
          emotionType,
          feelings
        );
        await refreshEmotionData();
        return nextQuestion;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [emotionFacade, refreshEmotionData, handleError]
  );

  const saveStageAnswer = useCallback(
    async (stage: string, question: string, answer: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        await emotionFacade.saveStageAnswer(stage, question, answer);
        await refreshEmotionData();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [emotionFacade, refreshEmotionData, handleError]
  );

  const updateCategoryAndEmotion = useCallback(
    async (category: Category, emotion: EmotionType): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        await emotionFacade.updateCategoryAndEmotion(category, emotion);
        await refreshEmotionData();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [emotionFacade, refreshEmotionData, handleError]
  );

  const getStageAnswer = useCallback(
    async (stage: string): Promise<string | null> => {
      try {
        return await emotionFacade.getStageAnswer(stage);
      } catch (err) {
        handleError(err);
        return null;
      }
    },
    [emotionFacade, handleError]
  );

  const migrateFromLegacyStorage = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await emotionFacade.migrateFromLegacyStorage();
      await refreshEmotionData();
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [emotionFacade, refreshEmotionData, handleError]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    refreshEmotionData();
  }, [refreshEmotionData]);

  return {
    emotionData,
    isLoading,
    error,
    saveStep2AndGenerateStep3,
    saveStep3AndGenerateStep4,
    saveStep4FeelingsAndGenerateStep5,
    saveStageAnswer,
    updateCategoryAndEmotion,
    getStageAnswer,
    refreshEmotionData,
    migrateFromLegacyStorage,
  };
}
