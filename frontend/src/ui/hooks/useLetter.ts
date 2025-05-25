import { useState, useCallback } from 'react';
import { LetterUseCases } from '../../core/usecases/letterUseCases';
import { LetterService } from '../../services/api/letterService';
import { LetterStorage } from '../../services/storage/letterStorage';
import { Letter, Category, EmotionType } from '../../core/entities';

interface EmotionContext {
  category: Category;
  emotion: EmotionType;
  answers: { [stage: string]: string };
}

// 간소화된 편지 훅
export const useLetter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 의존성을 직접 생성 (DI Container 제거)
  const letterUseCases = new LetterUseCases();
  const letterService = new LetterService();
  const letterStorage = new LetterStorage();

  // 편지 생성
  const generateLetter = useCallback(async (
    date: string,
    emotionContext: EmotionContext
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await letterUseCases.generateLetter(
        date,
        async () => await letterService.generateLetter(emotionContext)
      );

      // 성공시 스토리지에 저장
      if (result.success && result.mockLetter && result.realLetterId) {
        await letterStorage.saveLetter(date, {
          mockLetter: result.mockLetter,
          realLetterId: result.realLetterId,
        });
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '편지 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 사용자 응답 저장
  const saveUserResponse = useCallback(async (
    date: string,
    response: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await letterUseCases.saveUserResponse(
        date,
        response,
        letterStorage.saveUserResponse.bind(letterStorage)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '응답 저장에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 피드백 생성
  const generateFeedback = useCallback(async (
    date: string,
    mockLetter: string,
    userResponse: string,
    emotionContext: EmotionContext
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await letterUseCases.generateFeedback(
        date,
        async () => await letterService.generateFeedback(mockLetter, userResponse, emotionContext)
      );

      // 성공시 스토리지에 저장
      if (result.success && result.feedback) {
        await letterStorage.saveLetter(date, {
          aiFeedback: result.feedback,
        });
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '피드백 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 하이라이트 저장
  const saveHighlights = useCallback(async (
    date: string,
    highlights: string[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await letterUseCases.saveHighlight(
        date,
        highlights,
        letterStorage.saveHighlights.bind(letterStorage)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '하이라이트 저장에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 편지 데이터 조회
  const getLetterData = useCallback(async (date: string): Promise<Letter | null> => {
    try {
      setError(null);
      
      return await letterUseCases.getLetterData(
        date,
        letterStorage.getByDate.bind(letterStorage)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '편지 데이터 조회에 실패했습니다.';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    generateLetter,
    saveUserResponse,
    generateFeedback,
    saveHighlights,
    getLetterData,
  };
}; 