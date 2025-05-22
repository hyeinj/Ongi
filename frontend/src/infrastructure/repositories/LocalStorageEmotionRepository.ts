import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { DailyEmotion, EmotionEntry, Category, EmotionType } from '../../domain/entities/Emotion';
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter';

export class LocalStorageEmotionRepository implements EmotionRepository {
  constructor(private storageAdapter: LocalStorageAdapter) {
    // 초기화 시 기존 데이터 마이그레이션 실행
    this.migrateOldData();
  }

  async getByDate(date: string): Promise<DailyEmotion | null> {
    return this.storageAdapter.getEmotionByDate<DailyEmotion>(date);
  }

  async saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void> {
    let dailyEmotion = await this.getByDate(date);

    if (!dailyEmotion) {
      dailyEmotion = {
        entries: {},
        category: 'self', // 기본값
        emotion: 'peace', // 기본값
      };
    }

    dailyEmotion.entries[stage] = entry;
    this.storageAdapter.setEmotionByDate(date, dailyEmotion);
  }

  async updateCategoryAndEmotion(
    date: string,
    category: Category,
    emotion: EmotionType
  ): Promise<void> {
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

    this.storageAdapter.setEmotionByDate(date, dailyEmotion);
  }

  async getAll(): Promise<Record<string, DailyEmotion>> {
    const allData = this.storageAdapter.getEmotionData();
    return allData as Record<string, DailyEmotion>;
  }

  async deleteByDate(date: string): Promise<void> {
    this.storageAdapter.removeEmotionByDate(date);
  }

  // 기존 emotion_YYYY-MM-DD 형태 데이터를 새로운 구조로 마이그레이션
  private migrateOldData(): void {
    const oldKeys = this.storageAdapter.getAllEmotionKeys();

    if (oldKeys.length === 0) return;

    console.log('기존 감정 데이터를 새로운 구조로 마이그레이션 중...');

    const newData: Record<string, DailyEmotion> = {};

    oldKeys.forEach((key) => {
      const oldData = this.storageAdapter.get<DailyEmotion>(key);
      if (oldData) {
        // emotion_YYYY-MM-DD에서 YYYY-MM-DD 추출
        const date = key.replace('emotion_', '');
        newData[date] = oldData;

        // 기존 키 삭제
        this.storageAdapter.remove(key);
      }
    });

    // 기존 emotion 키에 있던 데이터와 병합
    const existingData = this.storageAdapter.getEmotionData();
    const mergedData = { ...existingData, ...newData };

    this.storageAdapter.setEmotionData(mergedData);

    console.log(`${oldKeys.length}개의 기존 감정 데이터를 마이그레이션했습니다.`);
  }
}
