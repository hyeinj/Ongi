export type Category = 'self' | 'growth' | 'routine' | 'relationship';
export type EmotionType = 'joy' | 'sadness' | 'anger' | 'anxiety' | 'peace';

export interface EmotionEntry {
  question: string;
  answer: string;
}

export interface StageEntries {
  [stage: string]: EmotionEntry; // 예: 'stage1', 'stage2' 등
}

export interface DailyEmotion {
  entries: StageEntries;
  category: Category;
  emotion: EmotionType;
}

export interface Emotions {
  [date: string]: DailyEmotion;
}
