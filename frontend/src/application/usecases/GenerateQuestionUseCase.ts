import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import { EmotionRepository } from '../../domain/repositories/EmotionRepository';

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
}
