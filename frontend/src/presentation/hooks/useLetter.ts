import { useState } from 'react';
import { DIContainer } from '../../infrastructure/container/DIContainer';
import { Letter } from '../../domain/entities/Letters';

export const useLetter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = DIContainer.getInstance();

  const generateMockLetter = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await container.generateLetterUseCase.generateMockLetter(date);

      if (!result.success) {
        setError(result.error || '모의 편지 생성에 실패했습니다.');
        return null;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserResponse = async (date: string, userResponse: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await container.saveLetterResponseUseCase.execute(date, userResponse);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '답장 저장에 실패했습니다.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeedback = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await container.generateFeedbackUseCase.execute(date);

      if (!result.success) {
        setError(result.error || 'AI 피드백 생성에 실패했습니다.');
        return null;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getLetterData = async (date: string): Promise<Letter | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await container.getLetterDataUseCase.execute(date);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '편지 데이터 조회에 실패했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLetterData = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await container.getLetterDataUseCase.deleteByDate(date);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '편지 데이터 삭제에 실패했습니다.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllLetters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await container.getLetterDataUseCase.getAll();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '편지 목록 조회에 실패했습니다.';
      setError(errorMessage);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const saveHighlight = async (date: string, highlightedParts: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      await container.saveHighlightUseCase.execute(date, highlightedParts);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '하이라이트 저장에 실패했습니다.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
