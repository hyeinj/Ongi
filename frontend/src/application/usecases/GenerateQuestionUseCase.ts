import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { Category, EmotionType } from '../../domain/entities/Emotion';

interface EmotionAnalysisResult {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

export class GenerateQuestionUseCase {
  constructor(
    private questionService: QuestionGenerationService,
    private emotionRepository: EmotionRepository
  ) {}

  async executeForStep3(step2Answer: string): Promise<string> {
    return await this.questionService.generateStep3Question(step2Answer);
  }

  async executeForStep4(step2Answer: string, step3Answer: string): Promise<string> {
    return await this.questionService.generateStep4Question(step2Answer, step3Answer);
  }

  async executeForStep5(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<string> {
    return await this.questionService.generateStep5Question(
      step2Answer,
      step3Answer,
      step4Feelings
    );
  }

  async executeForNextStep(date: string, feelings?: string[]): Promise<string> {
    const dailyEmotion = await this.emotionRepository.getByDate(date);
    if (!dailyEmotion) {
      throw new Error('해당 날짜의 감정 데이터를 찾을 수 없습니다.');
    }

    const previousAnswers: { [stage: string]: string } = {};
    for (const [stage, entry] of Object.entries(dailyEmotion.entries)) {
      previousAnswers[stage] = entry.answer;
    }

    return await this.questionService.generateNextQuestion(previousAnswers, feelings);
  }

  async analyzeEmotionAndCategory(date: string): Promise<EmotionAnalysisResult> {
    const emotion = await this.emotionRepository.getByDate(date);

    if (!emotion || !emotion.entries) {
      throw new Error('분석할 감정 데이터가 없습니다.');
    }

    // 모든 답변을 객체로 변환
    const allAnswers: { [stage: string]: string } = {};
    Object.entries(emotion.entries).forEach(([stage, entry]) => {
      allAnswers[stage] = entry.answer;
    });

    return await this.questionService.analyzeEmotionAndCategory(allAnswers);
  }

  async generateFinalCardText(date: string): Promise<{
    finalText: string;
    success: boolean;
    error?: string;
  }> {
    const emotion = await this.emotionRepository.getByDate(date);

    if (!emotion || !emotion.entries || !emotion.category || !emotion.emotion) {
      throw new Error('최종 텍스트 생성을 위한 데이터가 부족합니다.');
    }

    // 모든 답변을 객체로 변환
    const allAnswers: { [stage: string]: string } = {};
    Object.entries(emotion.entries).forEach(([stage, entry]) => {
      allAnswers[stage] = entry.answer;
    });

    return await this.questionService.generateFinalCardText(
      allAnswers,
      emotion.category,
      emotion.emotion
    );
  }

  async generateStep6Texts(date: string): Promise<{
    smallText: string;
    largeText: string;
    success: boolean;
    error?: string;
  }> {
    const emotion = await this.emotionRepository.getByDate(date);

    if (!emotion || !emotion.entries) {
      throw new Error('Step6 텍스트 생성을 위한 데이터가 부족합니다.');
    }

    // Step2~Step5 답변을 객체로 변환
    const allAnswers: { [stage: string]: string } = {};
    Object.entries(emotion.entries).forEach(([stage, entry]) => {
      if (['step2', 'step3', 'step4', 'step5'].includes(stage)) {
        allAnswers[stage] = entry.answer;
      }
    });

    return await this.questionService.generateStep6Texts(allAnswers);
  }
}
