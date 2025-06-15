import { useState, useCallback, useMemo } from 'react';
import { EmotionUseCases } from '../../core/usecases/emotionUseCases';
import { IslandUseCases } from '../../core/usecases/islandUseCases';
import { QuestionService } from '../../services/api/questionService';
import { EmotionStorage } from '../../services/storage/emotionStorage';
import { IslandStorage } from '../../services/storage/islandStorage';
import { Category, DailyEmotion, EmotionEntry, EmotionType } from '../../core/entities';

// 기존 인터페이스와 호환되는 감정 훅
export const useEmotion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DI: 의존성 주입으로 UseCase에 구현체들을 주입
  const questionService = useMemo(() => new QuestionService(), []);
  const emotionStorage = useMemo(() => new EmotionStorage(), []);
  const islandStorage = useMemo(() => new IslandStorage(), []);
  const islandUseCases = useMemo(() => new IslandUseCases(islandStorage), [islandStorage]);
  const emotionUseCases = useMemo(
    () => new EmotionUseCases(questionService, emotionStorage, islandUseCases),
    [questionService, emotionStorage, islandUseCases]
  );

  // 현재 날짜 가져오기
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // 기존 인터페이스: 스테이지 답변 저장
  const saveStageAnswer = useCallback(
    async (stage: string, question: string, answer: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const today = getCurrentDate();
        await emotionUseCases.saveEmotionEntry(today, stage, question, answer);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '저장에 실패했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [emotionUseCases]
  );

  const getStageAnswer = useCallback(
    async (stage: string): Promise<string | null> => {
      try {
        const today = getCurrentDate();
        return await emotionUseCases.getStageAnswer(today, stage);
      } catch (err) {
        console.error('답변 조회 실패:', err);
        return null;
      }
    },
    [emotionUseCases]
  );

  // 기존 인터페이스: 최종 카드 텍스트 생성
  const generateFinalCardText = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = getCurrentDate();
      const data = await emotionStorage.getByDate(today);

      if (!data?.entries || !data.category || !data.emotion) {
        throw new Error('최종 텍스트 생성을 위한 데이터가 부족합니다.');
      }

      const allAnswers: { [stage: string]: string } = {};
      Object.entries(data.entries).forEach(([stage, entry]) => {
        allAnswers[stage] = (entry as EmotionEntry).answer;
      });

      // aiFeedback 저장 추가
      const result = await emotionUseCases.generateFinalText(
        allAnswers,
        data.category,
        data.emotion
      );

      if (result.success) {
        await emotionUseCases.saveAIFeedback(today, result.finalText);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '텍스트 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionUseCases, emotionStorage]);

  const saveAIFeedback = useCallback(
    async (date: string, feedback: string) => {
      return await emotionUseCases.saveAIFeedback(date, feedback);
    },
    [emotionUseCases]
  );

  const getEmotionByDate = useCallback(
    async (date: string) => {
      return await emotionStorage.getByDate(date);
    },
    [emotionStorage]
  );

  const saveEmotionByDate = useCallback(
    async (date: string, data: Partial<DailyEmotion>) => {
      return await emotionStorage.saveData(date, data);
    },
    [emotionStorage]
  );

  const updateCategoryAndEmotion = useCallback(
    async (category: Category, emotion: EmotionType) => {
      try {
        setIsLoading(true);
        setError(null);
        const today = getCurrentDate();
        // core의 usecase 단으로 변경 (island 로컬스토리지 addDateToCategory 추가된 상태)
        await emotionUseCases.updateCategoryAndEmotion(today, category, emotion);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '카테고리/감정 업데이트에 실패했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [emotionUseCases]
  );

  return {
    isLoading,
    error,
    // 기존 인터페이스 메서드들
    saveStageAnswer,
    getStageAnswer,
    generateFinalCardText,
    setIsLoading, // 로딩 상태를 외부에서 제어할 수 있도록 추가
    saveAIFeedback,
    getEmotionByDate,
    saveEmotionByDate,
    updateCategoryAndEmotion,
  };
};
