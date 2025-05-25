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
}

export interface Emotions {
  [date: string]: DailyEmotion;
}

// 편지 관련 타입들
export interface Letter {
  mockLetter: string;
  userResponse: string;
  aiFeedback: string;
  realLetterId: string;
  highlightedParts: string[];
}

export interface Letters {
  [date: string]: Letter;
} 