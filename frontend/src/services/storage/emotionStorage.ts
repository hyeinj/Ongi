import { DailyEmotion, EmotionEntry, Category, EmotionType } from '../../core/entities';
import { IEmotionStorage } from '../../core/usecases/emotionUseCases';

const EMOTION_STORAGE_KEY = 'emotion';

// 감정 데이터 스토리지 서비스 (인터페이스 구현)
export class EmotionStorage implements IEmotionStorage {
  // 날짜별 감정 데이터 조회
  async getByDate(date: string): Promise<DailyEmotion | null> {
    try {
      const allData = this.getAllEmotions();
      return allData[date] || null;
    } catch (error) {
      console.error('감정 데이터 조회 실패:', error);
      return null;
    }
  }

  // 스테이지별 엔트리 저장
  async saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void> {
    try {
      let dailyEmotion = await this.getByDate(date);

      if (!dailyEmotion) {
        dailyEmotion = {
          entries: {},
          category: 'self',
          emotion: 'peace',
          aiFeedback: '',
          selfEmpathyId: '',
          reportId: '',
          island: '',
        };
      }

      dailyEmotion.entries[stage] = entry;
      this.saveEmotion(date, dailyEmotion);
    } catch (error) {
      console.error('감정 엔트리 저장 실패:', error);
      throw error;
    }
  }

  // 자기공감 ai 피드백 저장
  async saveAIFeedback(date: string, feedback: string): Promise<void> {
    const dailyEmotion = await this.getByDate(date);
    try {
      if (!dailyEmotion) {
        throw new Error('해당 날짜에 감정 데이터가 존재하지 않아 AI 피드백을 저장할 수 없습니다.');
      }

      dailyEmotion.aiFeedback = feedback; //선택 필드이므로 추가 저장 가능
      this.saveEmotion(date, dailyEmotion);
    } catch (error) {
      console.error('AI 피드백 저장 실패:', error);
      throw error;
    }
  }

  // 카테고리와 감정 업데이트
  async updateCategoryAndEmotion(
    date: string,
    category: Category,
    emotion: EmotionType
  ): Promise<void> {
    try {
      let dailyEmotion = await this.getByDate(date);

      if (!dailyEmotion) {
        dailyEmotion = {
          entries: {},
          category,
          emotion,
          selfEmpathyId: '',
          reportId: '',
          island: '',
        };
      } else {
        dailyEmotion.category = category;
        dailyEmotion.emotion = emotion;
      }

      this.saveEmotion(date, dailyEmotion);
    } catch (error) {
      console.error('카테고리/감정 업데이트 실패:', error);
      throw error;
    }
  }

  async saveData(date: string, data: Partial<DailyEmotion>): Promise<void> {
    try {
      const allData = this.getAllEmotions();
      const existingData = allData[date];
      allData[date] = { ...existingData, ...data };
      localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('감정 데이터 저장 실패:', error);
      throw error;
    }
  }

  // 모든 감정 데이터 조회
  async getAll(): Promise<Record<string, DailyEmotion>> {
    try {
      return this.getAllEmotions();
    } catch (error) {
      console.error('전체 감정 데이터 조회 실패:', error);
      return {};
    }
  }

  // 날짜별 데이터 삭제
  async deleteByDate(date: string): Promise<void> {
    try {
      const allData = this.getAllEmotions();
      delete allData[date];
      localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('감정 데이터 삭제 실패:', error);
      throw error;
    }
  }

  // 내부 헬퍼 메서드들
  private getAllEmotions(): Record<string, DailyEmotion> {
    const data = localStorage.getItem(EMOTION_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveEmotion(date: string, emotion: DailyEmotion): void {
    const allData = this.getAllEmotions();
    allData[date] = emotion;
    localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(allData));
  }
}
