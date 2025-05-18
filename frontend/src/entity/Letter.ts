export interface Letter {
  userId: string;
  letterId: string;
  answer: LetterAnswer;
}

// 답장(영어 번역 키값) 인터페이스
export interface LetterAnswer {
  reply: string;
}
