import { useState, useCallback, useMemo } from 'react';
import { LetterUseCases } from '../../core/usecases/letterUseCases';
import { LetterService } from '../../services/api/letterService';
import { LetterStorage } from '../../services/storage/letterStorage';
import { EmotionStorage } from '../../services/storage/emotionStorage';
import { Letter, Category, EmotionType } from '../../core/entities';

interface EmotionContext {
  category: Category;
  emotion: EmotionType;
  answers: { [stage: string]: string };
}

interface UseLetterReturn {
  // 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션 (기존 인터페이스 호환)
  generateMockLetter: (date?: string) => Promise<{
    success: boolean;
    error?: string;
    realLetterId?: string;
    mockLetter?: string;
  } | null>;
  saveUserResponse: (userResponse: string, date?: string) => Promise<boolean>;
  generateFeedback: (date?: string) => Promise<{
    success: boolean;
    error?: string;
    feedback?: string;
    highlightedParts?: string[];
  } | null>;
  getLetterData: (date?: string) => Promise<Letter | null>;
  deleteLetterData: (date?: string) => Promise<boolean>;
  getAllLetters: () => Promise<Record<string, Letter>>;
  saveHighlight: (highlightedParts: string[], date?: string) => Promise<boolean>;
}

// 기존 인터페이스와 호환되는 편지 훅
export const useLetter = (): UseLetterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 의존성을 useMemo로 감싸서 매 렌더링마다 새로 생성되지 않도록 함
  const letterUseCases = useMemo(() => new LetterUseCases(), []);
  const letterService = useMemo(() => new LetterService(), []);
  const letterStorage = useMemo(() => new LetterStorage(), []);
  const emotionStorage = useMemo(() => new EmotionStorage(), []);

  // 현재 날짜 가져오기
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // 에러 처리 헬퍼
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    setError(message);
    console.error('Letter error:', err);
  }, []);

  // 기존 인터페이스: 모의 편지 생성
  const generateMockLetter = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      
      // 감정 데이터 가져오기
      const emotionData = await emotionStorage.getByDate(targetDate);
      if (!emotionData?.category || !emotionData?.emotion || !emotionData?.entries) {
        setError('감정 분석 데이터가 없습니다. 먼저 감정 분석을 완료해주세요.');
        return null;
      }

      const emotionContext: EmotionContext = {
        category: emotionData.category,
        emotion: emotionData.emotion,
        answers: Object.fromEntries(
          Object.entries(emotionData.entries).map(([stage, entry]) => [stage, entry.answer])
        ),
      };

      const result = await letterUseCases.generateLetter(
        targetDate,
        async () => await letterService.generateLetter(emotionContext)
      );

      // 성공시 스토리지에 저장
      if (result.success && result.mockLetter && result.realLetterId) {
        await letterStorage.saveLetter(targetDate, {
          mockLetter: result.mockLetter,
          realLetterId: result.realLetterId,
        });
      }

      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterUseCases, letterService, letterStorage, emotionStorage, handleError]);

  // 기존 인터페이스: 사용자 응답 저장
  const saveUserResponse = useCallback(async (userResponse: string, date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      await letterUseCases.saveUserResponse(
        targetDate,
        userResponse,
        letterStorage.saveUserResponse.bind(letterStorage)
      );
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterUseCases, letterStorage, handleError]);

  // 기존 인터페이스: 피드백 생성
  const generateFeedback = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      
      // 편지 데이터와 감정 데이터 가져오기
      const letterData = await letterStorage.getByDate(targetDate);
      const emotionData = await emotionStorage.getByDate(targetDate);
      
      if (!letterData?.mockLetter || !letterData?.userResponse) {
        setError('편지 데이터가 없습니다.');
        return null;
      }

      if (!emotionData?.category || !emotionData?.emotion || !emotionData?.entries) {
        setError('감정 분석 데이터가 없습니다.');
        return null;
      }

      const emotionContext: EmotionContext = {
        category: emotionData.category,
        emotion: emotionData.emotion,
        answers: Object.fromEntries(
          Object.entries(emotionData.entries).map(([stage, entry]) => [stage, entry.answer])
        ),
      };

      const result = await letterUseCases.generateFeedback(
        targetDate,
        async () => await letterService.generateFeedback(
          letterData.mockLetter,
          letterData.userResponse,
          emotionContext
        )
      );

      // 성공시 스토리지에 저장
      if (result.success && result.feedback) {
        await letterStorage.saveLetter(targetDate, {
          aiFeedback: result.feedback,
        });
      }

      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterUseCases, letterService, letterStorage, emotionStorage, handleError]);

  // 기존 인터페이스: 편지 데이터 조회
  const getLetterData = useCallback(async (date?: string): Promise<Letter | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      const result = await letterUseCases.getLetterData(
        targetDate,
        letterStorage.getByDate.bind(letterStorage)
      );
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterUseCases, letterStorage, handleError]);

  // 기존 인터페이스: 편지 데이터 삭제
  const deleteLetterData = useCallback(async (date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      await letterStorage.deleteByDate(targetDate);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterStorage, handleError]);

  // 기존 인터페이스: 모든 편지 조회
  const getAllLetters = useCallback(async (): Promise<Record<string, Letter>> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await letterStorage.getAll();
      return result;
    } catch (err) {
      handleError(err);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [letterStorage, handleError]);

  // 기존 인터페이스: 하이라이트 저장
  const saveHighlight = useCallback(async (highlightedParts: string[], date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date || getCurrentDate();
      await letterUseCases.saveHighlight(
        targetDate,
        highlightedParts,
        letterStorage.saveHighlights.bind(letterStorage)
      );
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterUseCases, letterStorage, handleError]);

  return {
    isLoading,
    error,
    generateMockLetter,
    saveUserResponse,
    generateFeedback,
    getLetterData,
    deleteLetterData,
    getAllLetters,
    saveHighlight,
  };
}; 