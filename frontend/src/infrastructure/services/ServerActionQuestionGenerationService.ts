import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import {
  generateStep3Question,
  generateStep4Question,
  generateStep5Question,
  generateNextQuestion,
  analyzeEmotionAndCategory,
  generateFinalCardText,
  generateStep6Texts,
} from '../../app/actions/questionActions';
import { Category, EmotionType } from '../../domain/entities/Emotion';

interface EmotionAnalysisResult {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

export class ServerActionQuestionGenerationService implements QuestionGenerationService {
  async generateStep3Question(step2Answer: string): Promise<string> {
    const response = await generateStep3Question(step2Answer);

    if (!response.success) {
      throw new Error(response.error || 'Step3 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateStep4Question(step2Answer: string, step3Answer: string): Promise<string> {
    const response = await generateStep4Question(step2Answer, step3Answer);

    if (!response.success) {
      throw new Error(response.error || 'Step4 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateStep5Question(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<string> {
    const response = await generateStep5Question(step2Answer, step3Answer, step4Feelings);

    if (!response.success) {
      throw new Error(response.error || 'Step5 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateNextQuestion(
    previousAnswers: { [stage: string]: string },
    feelings?: string[]
  ): Promise<string> {
    const response = await generateNextQuestion(previousAnswers, feelings);

    if (!response.success) {
      throw new Error(response.error || '다음 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async analyzeEmotionAndCategory(allAnswers: {
    [stage: string]: string;
  }): Promise<EmotionAnalysisResult> {
    const response = await analyzeEmotionAndCategory(allAnswers);

    if (!response.success) {
      console.warn('감정 분석 실패, 기본값 사용:', response.error);
    }

    return response;
  }

  async generateFinalCardText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<{
    finalText: string;
    success: boolean;
    error?: string;
  }> {
    const response = await generateFinalCardText(allAnswers, category, emotion);

    if (!response.success) {
      console.warn('최종 카드 텍스트 생성 실패:', response.error);
    }

    return response;
  }

  async generateStep6Texts(allAnswers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    success: boolean;
    error?: string;
  }> {
    const response = await generateStep6Texts(allAnswers);

    if (!response.success) {
      console.warn('Step6 텍스트 생성 실패:', response.error);
    }

    return response;
  }
}
