import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { DailyEmotion, Category, EmotionType } from '../../domain/entities/Emotion';

export class GetEmotionDataUseCase {
  constructor(private emotionRepository: EmotionRepository) {}

  async execute(date: string): Promise<DailyEmotion | null> {
    return await this.emotionRepository.getByDate(date);
  }

  async getAll(): Promise<Record<string, DailyEmotion>> {
    return await this.emotionRepository.getAll();
  }

  async updateCategoryAndEmotion(
    date: string,
    category: Category,
    emotion: EmotionType
  ): Promise<void> {
    await this.emotionRepository.updateCategoryAndEmotion(date, category, emotion);
  }

  async deleteByDate(date: string): Promise<void> {
    await this.emotionRepository.deleteByDate(date);
  }
}
