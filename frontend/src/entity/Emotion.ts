export type Category = 'self' | 'growth' | 'routine' | 'relationship';
export type EmotionType = 'joy' | 'sadness' | 'anger' | 'anxiety' | 'peace';

export interface EmotionEntry {
  question: string;
  answer: string;
}

export interface DailyEmotion {
  entries: EmotionEntry[];
  category: Category;
  emotion: EmotionType;
}

export interface Emotions {
  [date: string]: DailyEmotion;
}
