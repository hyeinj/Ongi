import { Category, EmotionType } from '../entities/Emotion';

interface EmotionAnalysisResult {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

export interface QuestionGenerationService {
  /**
   * Step2 답변을 기반으로 Step3 질문 생성
   */
  generateStep3Question(step2Answer: string): Promise<string>;

  /**
   * Step2, Step3 답변을 기반으로 Step4 질문 생성
   */
  generateStep4Question(step2Answer: string, step3Answer: string): Promise<string>;

  /**
   * Step2-Step4 답변과 감정을 기반으로 Step5 질문 생성
   */
  generateStep5Question(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<string>;

  /**
   * 모든 이전 답변을 기반으로 다음 질문 생성
   */
  generateNextQuestion(
    previousAnswers: { [stage: string]: string },
    feelings?: string[]
  ): Promise<string>;

  /**
   * 모든 답변을 분석하여 사용자의 오늘 기분을 가장 잘 나타내는 category와 emotion을 결정
   */
  analyzeEmotionAndCategory(allAnswers: {
    [stage: string]: string;
  }): Promise<EmotionAnalysisResult>;

  /**
   * 모든 답변과 분석된 감정을 기반으로 최종 카드 텍스트 생성
   */
  generateFinalCardText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<{
    finalText: string;
    success: boolean;
    error?: string;
  }>;

  /**
   * Step2-Step5 답변을 기반으로 Step6의 smallText와 largeText 생성
   */
  generateStep6Texts(allAnswers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    success: boolean;
    error?: string;
  }>;
}
