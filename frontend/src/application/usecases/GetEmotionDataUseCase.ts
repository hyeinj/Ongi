import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { DailyEmotion, Category, EmotionType } from '../../domain/entities/Emotion';

export class GetEmotionDataUseCase {
  constructor(private emotionRepository: EmotionRepository) {}

  async execute(date: string): Promise<DailyEmotion | null> {
    return await this.emotionRepository.getByDate(date);
  }

  async updateCategoryAndEmotion(
    date: string,
    category: Category,
    emotion: EmotionType
  ): Promise<void> {
    await this.emotionRepository.updateCategoryAndEmotion(date, category, emotion);
  }
}
