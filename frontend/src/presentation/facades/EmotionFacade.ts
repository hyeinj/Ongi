import { DailyEmotion, Category, EmotionType } from '../../domain/entities/Emotion';
import { DIContainer } from '../../infrastructure/container/DIContainer';

export class EmotionFacade {
  private container: DIContainer;

  constructor() {
    this.container = DIContainer.getInstance();
  }

  /**
   * 현재 날짜를 YYYY-MM-DD 형식으로 반환
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * 특정 날짜의 감정 데이터 조회
   */
  async getEmotionData(date?: string): Promise<DailyEmotion | null> {
    const targetDate = date || this.getCurrentDate();
    return await this.container.getEmotionDataUseCase.execute(targetDate);
  }

  /**
   * Step2 답변 저장 및 Step3 질문 생성
   */
  async saveStep2AndGenerateStep3(answer: string): Promise<string> {
    const date = this.getCurrentDate();

    // Step2 답변 저장
    await this.container.saveEmotionEntryUseCase.execute(
      date,
      'step2',
      '오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?',
      answer
    );

    // Step3 질문 생성
    return await this.container.generateQuestionUseCase.executeForStep3(answer);
  }

  /**
   * Step3 답변 저장 및 Step4 질문 생성
   */
  async saveStep3AndGenerateStep4(question: string, answer: string): Promise<string> {
    const date = this.getCurrentDate();

    // Step3 답변 저장
    await this.container.saveEmotionEntryUseCase.execute(date, 'step3', question, answer);

    // 이전 답변들 가져오기
    const emotionData = await this.getEmotionData(date);
    const step2Answer = emotionData?.entries.step2?.answer || '';

    // Step4 질문 생성
    return await this.container.generateQuestionUseCase.executeForStep4(step2Answer, answer);
  }

  /**
   * Step4 감정 저장 및 Step5 질문 생성
   */
  async saveStep4FeelingsAndGenerateStep5(
    question: string,
    emotionType: 'positive' | 'neutral' | 'negative',
    feelings: string[]
  ): Promise<string> {
    const date = this.getCurrentDate();

    // Step4 감정 데이터 저장
    await this.container.saveEmotionEntryUseCase.execute(
      date,
      'step4',
      question,
      `감정 유형: ${emotionType}, 세부 감정: ${feelings.join(', ')}`
    );

    // 이전 답변들 가져오기
    const emotionData = await this.getEmotionData(date);
    const step2Answer = emotionData?.entries.step2?.answer || '';
    const step3Answer = emotionData?.entries.step3?.answer || '';

    // Step5 질문 생성
    return await this.container.generateQuestionUseCase.executeForStep5(
      step2Answer,
      step3Answer,
      feelings
    );
  }

  /**
   * 일반적인 단계 답변 저장
   */
  async saveStageAnswer(stage: string, question: string, answer: string): Promise<void> {
    const date = this.getCurrentDate();
    await this.container.saveEmotionEntryUseCase.execute(date, stage, question, answer);
  }

  /**
   * 카테고리와 감정 타입 업데이트
   */
  async updateCategoryAndEmotion(category: Category, emotion: EmotionType): Promise<void> {
    const date = this.getCurrentDate();
    await this.container.getEmotionDataUseCase.updateCategoryAndEmotion(date, category, emotion);
  }

  /**
   * 다음 질문 생성 (유연한 사용을 위함)
   */
  async generateNextQuestion(feelings?: string[]): Promise<string> {
    const date = this.getCurrentDate();
    return await this.container.generateQuestionUseCase.executeForNextStep(date, feelings);
  }

  /**
   * 특정 날짜의 특정 스테이지 답변 조회
   */
  async getStageAnswer(stage: string, date?: string): Promise<string | null> {
    const targetDate = date || this.getCurrentDate();
    const emotionData = await this.getEmotionData(targetDate);
    return emotionData?.entries[stage]?.answer || null;
  }

  /**
   * 로컬 스토리지에서 기존 데이터 마이그레이션 (기존 컴포넌트와의 호환성을 위함)
   */
  async migrateFromLegacyStorage(): Promise<void> {
    // 기존 localStorage 키들에서 데이터 가져오기
    const step2Answer = localStorage.getItem('step2Answer');
    const step3Answer = localStorage.getItem('step3Answer');
    const step4Feelings = localStorage.getItem('step4Feelings');
    const step4EmotionType = localStorage.getItem('step4EmotionType');

    if (step2Answer) {
      await this.saveStageAnswer(
        'step2',
        '오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?',
        step2Answer
      );
    }

    if (step3Answer) {
      const step3Question = localStorage.getItem('step3Question') || '생성된 질문';
      await this.saveStageAnswer('step3', step3Question, step3Answer);
    }

    if (step4Feelings && step4EmotionType) {
      const feelings = JSON.parse(step4Feelings);
      const step4Question = localStorage.getItem('step4Question') || '감정 선택 질문';
      await this.saveStageAnswer(
        'step4',
        step4Question,
        `감정 유형: ${step4EmotionType}, 세부 감정: ${feelings.join(', ')}`
      );
    }
  }
}
