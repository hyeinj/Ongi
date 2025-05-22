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
}
