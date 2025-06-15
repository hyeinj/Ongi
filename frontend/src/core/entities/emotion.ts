// 감정 관련 타입들
export type Category = 'self' | 'growth' | 'routine' | 'relationship';
export type EmotionType = 'joy' | 'sadness' | 'anger' | 'anxiety' | 'peace';

export interface EmotionEntry {
  question: string;
  answer: string;
}

export interface StageEntries {
  [stage: string]: EmotionEntry;
}

export interface DailyEmotion {
  entries: StageEntries;
  category: Category;
  emotion: EmotionType;
  selfEmpathyId: string;
  reportId: string;
  island: string;
  aiFeedback?: string; //선택필드
}

export interface Emotions {
  [date: string]: DailyEmotion;
}
