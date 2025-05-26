import {
  generateMockLetter,
  generateFeedback,
  generateStructuredFeedback,
} from '../actions/letterActions';
import { Category, EmotionType } from '../../core/entities';
import { ILetterService } from '../../core/usecases/letterUseCases';

interface LetterGenerationResult {
  success: boolean;
  error?: string;
  realLetterId?: string;
  mockLetter?: string;
  letterTitle?: string;
  letterContent?: string;
}

interface FeedbackResult {
  success: boolean;
  error?: string;
  feedback?: string;
  highlightedParts?: string[];
  feedbackSections?: {
    emotionConnection?: string;
    empathyReflection?: string[];
    improvementSuggestion?: string[];
    overallComment?: string;
  };
}

interface EmotionContext {
  category: Category;
  emotion: EmotionType;
  answers: { [stage: string]: string };
}

// 편지 생성 관련 서비스 (인터페이스 구현)
export class LetterService implements ILetterService {
  // 모의 편지 생성
  async generateLetter(emotionContext: EmotionContext): Promise<LetterGenerationResult> {
    try {
      const result = await generateMockLetter({
        category: emotionContext.category,
        emotion: emotionContext.emotion,
        answers: emotionContext.answers,
      });

      return {
        success: result.success,
        error: result.error,
        realLetterId: result.realLetterId,
        mockLetter: result.mockLetter,
        letterTitle: result.letterTitle,
        letterContent: result.letterContent,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '편지 생성에 실패했습니다.',
      };
    }
  }

  // 피드백 생성 (구조화된 피드백 우선 시도)
  async generateFeedback(
    mockLetter: string,
    userResponse: string,
    emotionContext: EmotionContext
  ): Promise<FeedbackResult> {
    try {
      // 먼저 구조화된 피드백 시도
      const structuredResult = await generateStructuredFeedback(mockLetter, userResponse, {
        category: emotionContext.category,
        emotion: emotionContext.emotion,
        answers: emotionContext.answers,
      });

      if (structuredResult.success && structuredResult.feedbackSections) {
        return {
          success: true,
          feedbackSections: structuredResult.feedbackSections,
        };
      }

      // 구조화된 피드백 실패 시 기존 피드백으로 폴백
      const fallbackResult = await generateFeedback(mockLetter, userResponse, {
        category: emotionContext.category,
        emotion: emotionContext.emotion,
        answers: emotionContext.answers,
      });

      return {
        success: fallbackResult.success,
        error: fallbackResult.error,
        feedback: fallbackResult.feedback,
        highlightedParts: fallbackResult.highlightedParts,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '피드백 생성에 실패했습니다.',
      };
    }
  }
}
