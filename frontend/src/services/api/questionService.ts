import {
  generateStep3Question,
  generateStep4Question,
  generateStep5Question,
  generateStep7Question,
  analyzeEmotionAndCategory,
  generateFinalCardText,
  generateStep6Texts,
} from '../actions/questionActions';
import { Category, EmotionType } from '../../core/entities';
import { IQuestionService } from '../../core/usecases/emotionUseCases';

interface QuestionData {
  step2Answer: string;
  step3Answer?: string;
  step4Feelings?: string[];
}

interface AnalysisResult {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

interface TextResult {
  finalText: string;
  success: boolean;
  error?: string;
}

// 질문 생성 관련 서비스 (인터페이스 구현)
export class QuestionService implements IQuestionService {
  // 다음 질문 생성
  async generateQuestion(data: QuestionData): Promise<string> {
    const { step2Answer, step3Answer, step4Feelings } = data;

    if (!step3Answer) {
      const result = await generateStep3Question(step2Answer);
      if (!result.success) {
        throw new Error(result.error || '질문 생성에 실패했습니다.');
      }
      return result.question;
    }

    if (!step4Feelings) {
      const result = await generateStep4Question(step2Answer, step3Answer);
      if (!result.success) {
        throw new Error(result.error || '질문 생성에 실패했습니다.');
      }
      return result.question;
    }

    const result = await generateStep5Question(step2Answer, step3Answer, step4Feelings);
    if (!result.success) {
      throw new Error(result.error || '질문 생성에 실패했습니다.');
    }
    // Step5는 smallText와 largeText를 합쳐서 반환 (기존 호환성 유지)
    return `${result.smallText}\n${result.largeText}`;
  }

  // 감정 분석
  async analyzeEmotion(allAnswers: { [stage: string]: string }): Promise<AnalysisResult> {
    return await analyzeEmotionAndCategory(allAnswers);
  }

  // 최종 텍스트 생성
  async generateFinalText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<TextResult> {
    return await generateFinalCardText(allAnswers, category, emotion);
  }

  // Step6 텍스트 생성
  async generateStep6Texts(allAnswers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    options: string[];
    success: boolean;
    error?: string;
  }> {
    return await generateStep6Texts(allAnswers);
  }

  // Step7 질문 생성
  async generateStep7Question(allAnswers: { [stage: string]: string }): Promise<{
    question: string;
    success: boolean;
    error?: string;
  }> {
    return await generateStep7Question(allAnswers);
  }
}
