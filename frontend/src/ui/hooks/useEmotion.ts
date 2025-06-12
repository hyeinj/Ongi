import { useState, useCallback, useMemo } from 'react';
import { EmotionUseCases } from '../../core/usecases/emotionUseCases';
import { IslandUseCases } from '../../core/usecases/islandUseCases';
import { QuestionService } from '../../services/api/questionService';
import { EmotionStorage } from '../../services/storage/emotionStorage';
import { IslandStorage } from '../../services/storage/islandStorage';
import { DailyEmotion, EmotionEntry } from '../../core/entities';
import { Category, EmotionType } from '../../core/entities';

// 기존 인터페이스와 호환되는 감정 훅
export const useEmotion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<DailyEmotion | null>(null);

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

  // 기존 인터페이스: Step2 답변 저장 및 Step3 질문 생성
  const saveStep2AndGenerateStep3 = useCallback(
    async (answer: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const today = getCurrentDate();
        const question = '오늘 하루, 가장 인상깊었던 일은 무엇이었나요??';

        // 1. 답변 저장
        await emotionUseCases.saveEmotionEntry(today, 'step2', question, answer);

        // 2. 다음 질문 생성
        const nextQuestion = await emotionUseCases.generateNextQuestion(answer);
        return nextQuestion;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '처리에 실패했습니다.';
        setError(errorMessage);
        throw err;
      }
    },
    [emotionUseCases]
  );

  // 기존 인터페이스: Step3 답변 저장 및 Step4 질문 생성
  const saveStep3AndGenerateStep4 = useCallback(
    async (question: string, answer: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const today = getCurrentDate();

        // 1. 답변 저장
        await emotionUseCases.saveEmotionEntry(today, 'step3', question, answer);

        // 2. 다음 질문 생성 (step2 답변도 필요)
        const emotionData = await emotionStorage.getByDate(today);
        const step2Answer = emotionData?.entries?.step2?.answer || '';

        const nextQuestion = await emotionUseCases.generateNextQuestion(step2Answer, answer);
        return nextQuestion;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '처리에 실패했습니다.';
        setError(errorMessage);
        throw err;
      }
    },
    [emotionUseCases, emotionStorage]
  );

  // 기존 인터페이스: Step4 감정 저장 및 Step5 질문 생성
  const saveStep4FeelingsAndGenerateStep5 = useCallback(
    async (question: string, selectedFeelings: string[]) => {
      try {
        setIsLoading(true);
        setError(null);

        const today = getCurrentDate();
        const answer = selectedFeelings.join(', ');

        // 1. 답변 저장
        await emotionUseCases.saveEmotionEntry(today, 'step4', question, answer);

        // 2. 다음 질문 생성
        const emotionData = await emotionStorage.getByDate(today);
        const step2Answer = emotionData?.entries?.step2?.answer || '';
        const step3Answer = emotionData?.entries?.step3?.answer || '';

        const nextQuestion = await emotionUseCases.generateNextQuestion(
          step2Answer,
          step3Answer,
          selectedFeelings
        );
        return nextQuestion;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '처리에 실패했습니다.';
        setError(errorMessage);
        throw err;
      }
    },
    [emotionUseCases, emotionStorage]
  );

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

  // 기존 인터페이스: 스테이지 답변 조회
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

  // 기존 인터페이스: 감정 분석 및 저장
  const analyzeAndSaveEmotionAndCategory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = getCurrentDate();
      const result = await emotionUseCases.analyzeAndSaveEmotion(today);

      if (result.success) {
        const data = await emotionStorage.getByDate(today);
        setEmotionData(data);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionUseCases, emotionStorage]);

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

      return await emotionUseCases.generateFinalText(allAnswers, data.category, data.emotion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '텍스트 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionUseCases, emotionStorage]);

  // 기존 인터페이스: Step6 텍스트 생성
  const generateStep6Texts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = getCurrentDate();
      const data = await emotionStorage.getByDate(today);

      if (!data?.entries) {
        throw new Error('Step6 텍스트 생성을 위한 데이터가 부족합니다.');
      }

      const allAnswers: { [stage: string]: string } = {};
      Object.entries(data.entries).forEach(([stage, entry]) => {
        if (['step2', 'step3', 'step4', 'step5'].includes(stage)) {
          allAnswers[stage] = (entry as EmotionEntry).answer;
        }
      });

      return await emotionUseCases.generateStep6Texts(allAnswers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Step6 텍스트 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionStorage, emotionUseCases]);

  // Step7 질문 생성
  const generateStep7Question = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = getCurrentDate();
      const data = await emotionStorage.getByDate(today);

      if (!data?.entries) {
        throw new Error('Step7 질문 생성을 위한 데이터가 부족합니다.');
      }

      const allAnswers: { [stage: string]: string } = {};
      Object.entries(data.entries).forEach(([stage, entry]) => {
        if (['step2', 'step3', 'step4', 'step5'].includes(stage)) {
          allAnswers[stage] = (entry as EmotionEntry).answer;
        }
      });

      return await emotionUseCases.generateStep7Question(allAnswers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Step7 질문 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionStorage, emotionUseCases]);

  const updateCategoryAndEmotion = useCallback(async (category: Category, emotion: EmotionType) => {
    try {
      setIsLoading(true);
      setError(null);
      const today = getCurrentDate();
      await emotionStorage.updateCategoryAndEmotion(today, category, emotion);
      const data = await emotionStorage.getByDate(today);
      setEmotionData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '카테고리/감정 업데이트에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [emotionStorage]);

  return {
    isLoading,
    error,
    emotionData,
    // 기존 인터페이스 메서드들
    saveStep2AndGenerateStep3,
    saveStep3AndGenerateStep4,
    saveStep4FeelingsAndGenerateStep5,
    saveStageAnswer,
    getStageAnswer,
    analyzeAndSaveEmotionAndCategory,
    generateFinalCardText,
    generateStep6Texts,
    generateStep7Question,
    updateCategoryAndEmotion,
    setIsLoading, // 로딩 상태를 외부에서 제어할 수 있도록 추가
  };
};
