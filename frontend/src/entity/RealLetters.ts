import { EmotionType } from './Emotion';

export interface RealLetter {
  id: string;
  question: string;
  answer: string;
}

export type RealLetters = Record<EmotionType, RealLetter[]>;
