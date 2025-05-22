import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import { HttpApiAdapter } from '../adapters/api/HttpApiAdapter';
import { Category, EmotionType } from '../../domain/entities/Emotion';

interface QuestionResponse {
  question: string;
}

interface EmotionAnalysisResponse {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

export class HttpQuestionGenerationService implements QuestionGenerationService {
  constructor(private httpAdapter: HttpApiAdapter) {}

  async generateStep3Question(step2Answer: string): Promise<string> {
    const response = await this.httpAdapter.post<QuestionResponse>('/step2-question', {
      answer: step2Answer,
    });
    return response.question;
  }

  async generateStep4Question(step2Answer: string, step3Answer: string): Promise<string> {
    const response = await this.httpAdapter.post<QuestionResponse>('/step3-question', {
      step2Answer,
      step3Answer,
    });
    return response.question;
  }

  async generateStep5Question(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<string> {
    const response = await this.httpAdapter.post<QuestionResponse>('/step4-question', {
      step2Answer,
      step3Answer,
      step4Answer: '', // step4는 감정 선택만 있으므로 빈 문자열
      step4Feelings: step4Feelings.join(', '),
    });
    return response.question;
  }

  async generateNextQuestion(
    previousAnswers: { [stage: string]: string },
    feelings?: string[]
  ): Promise<string> {
    const response = await this.httpAdapter.post<QuestionResponse>('/generate-question', {
      previousAnswers,
      feelings: feelings?.join(', '),
    });
    return response.question;
  }

  async analyzeEmotionAndCategory(allAnswers: { [stage: string]: string }): Promise<{
    category: Category;
    emotion: EmotionType;
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.httpAdapter.post<EmotionAnalysisResponse>('/analyze-emotion', {
        allAnswers,
      });
      return response;
    } catch (error) {
      console.error('감정 분석 실패:', error);
      // 실패 시 기본값 반환
      return {
        category: 'self' as Category,
        emotion: 'peace' as EmotionType,
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
