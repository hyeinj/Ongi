import { useState, useCallback } from 'react';
import { Letter } from '../../domain/entities/Letters';
import { LetterFacade } from '../facades/LetterFacade';
import { ContainerFactory } from '../../composition/ContainerFactory';

interface UseLetterReturn {
  // 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션
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

export const useLetter = (): UseLetterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterFacade] = useState(() => {
    const useCases = ContainerFactory.createLetterUseCases();
    return new LetterFacade(useCases);
  });

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    setError(message);
    console.error('Letter error:', err);
  }, []);

  const generateMockLetter = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await letterFacade.generateMockLetter(date);
      if (!result.success) {
        setError(result.error || '모의 편지 생성에 실패했습니다.');
        return null;
      }
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const saveUserResponse = useCallback(async (userResponse: string, date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await letterFacade.saveUserResponse(userResponse, date);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const generateFeedback = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await letterFacade.generateFeedback(date);
      if (!result.success) {
        setError(result.error || 'AI 피드백 생성에 실패했습니다.');
        return null;
      }
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const getLetterData = useCallback(async (date?: string): Promise<Letter | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await letterFacade.getLetterData(date);
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const deleteLetterData = useCallback(async (date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await letterFacade.deleteLetterData(date);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const getAllLetters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await letterFacade.getAllLetters();
      return result;
    } catch (err) {
      handleError(err);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

  const saveHighlight = useCallback(async (highlightedParts: string[], date?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await letterFacade.saveHighlight(highlightedParts, date);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [letterFacade, handleError]);

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
