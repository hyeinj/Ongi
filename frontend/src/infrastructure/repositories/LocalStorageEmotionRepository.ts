import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { DailyEmotion, EmotionEntry, Category, EmotionType } from '../../domain/entities/Emotion';
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter';

export class LocalStorageEmotionRepository implements EmotionRepository {
  constructor(private storageAdapter: LocalStorageAdapter) {}

  async getByDate(date: string): Promise<DailyEmotion | null> {
    const key = this.storageAdapter.getEmotionKey(date);
    return this.storageAdapter.get<DailyEmotion>(key);
  }

  async saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void> {
    const key = this.storageAdapter.getEmotionKey(date);
    let dailyEmotion = await this.getByDate(date);

    if (!dailyEmotion) {
      dailyEmotion = {
        entries: {},
        category: 'self', // 기본값
        emotion: 'peace', // 기본값
      };
    }

    dailyEmotion.entries[stage] = entry;
    this.storageAdapter.set(key, dailyEmotion);
  }

  async updateCategoryAndEmotion(
    date: string,
    category: Category,
    emotion: EmotionType
  ): Promise<void> {
    const key = this.storageAdapter.getEmotionKey(date);
    let dailyEmotion = await this.getByDate(date);

    if (!dailyEmotion) {
      dailyEmotion = {
        entries: {},
        category,
        emotion,
      };
    } else {
      dailyEmotion.category = category;
      dailyEmotion.emotion = emotion;
    }

    this.storageAdapter.set(key, dailyEmotion);
  }
}
