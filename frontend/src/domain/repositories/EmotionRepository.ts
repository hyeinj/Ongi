import { DailyEmotion, EmotionEntry, Category, EmotionType } from '../entities/Emotion';

export interface EmotionRepository {
  /**
   * 특정 날짜의 감정 데이터를 조회
   * @param date YYYY-MM-DD 형식
   * @returns DailyEmotion 또는 null
   */
  getByDate(date: string): Promise<DailyEmotion | null>;

  /**
   * 특정 날짜의 특정 stage에 EmotionEntry를 추가/업데이트
   * @param date YYYY-MM-DD 형식
   * @param stage 스테이지 이름 (예: 'stage1', 'stage2')
   * @param entry EmotionEntry 객체
   */
  saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void>;

  /**
   * 특정 날짜의 카테고리와 감정 타입을 업데이트
   * @param date YYYY-MM-DD 형식
   * @param category 카테고리
   * @param emotion 감정 타입
   */
  updateCategoryAndEmotion(date: string, category: Category, emotion: EmotionType): Promise<void>;
}
