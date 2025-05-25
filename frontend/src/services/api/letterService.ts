import { generateMockLetter, generateFeedback } from '../../app/actions/letterActions';
import { Category, EmotionType } from '../../core/entities';

interface LetterGenerationResult {
  success: boolean;
  error?: string;
  realLetterId?: string;
  mockLetter?: string;
}

interface FeedbackResult {
  success: boolean;
  error?: string;
  feedback?: string;
  highlightedParts?: string[];
}

interface EmotionContext {
  category: Category;
  emotion: EmotionType;
  answers: { [stage: string]: string };
}

// 편지 생성 관련 서비스
export class LetterService {
  
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
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '편지 생성에 실패했습니다.',
      };
    }
  }

  // 피드백 생성
  async generateFeedback(
    mockLetter: string,
    userResponse: string,
    emotionContext: EmotionContext
  ): Promise<FeedbackResult> {
    try {
      const result = await generateFeedback(mockLetter, userResponse, {
        category: emotionContext.category,
        emotion: emotionContext.emotion,
        answers: emotionContext.answers,
      });

      return {
        success: result.success,
        error: result.error,
        feedback: result.feedback,
        highlightedParts: result.highlightedParts,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '피드백 생성에 실패했습니다.',
      };
    }
  }
} 