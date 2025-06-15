// 편지 관련 타입들
export interface Letter {
  mockLetter?: string;
  userResponse: string;
  aiFeedback?: string;
  realLetterId?: string;
  highlightedParts: string[];
  // RealLetter 관련 필드 추가
  realLetterData?: RealLetterData;
  // 4개 영역 피드백
  feedbackSections?: {
    emotionConnection?: string; // 1. 감정 연결 피드백
    empathyReflection?: string[]; // 2. 공감 문장 반영 [원문, 위로문장]
    improvementSuggestion?: string[]; // 3. 개선 제안 [제목, 내용]
    finalMessage?: string; // 4. 최종 메시지
  };
  review?: {
    letterExercise: string;
    otherEmpathy: string;
  };
}

export interface Letters {
  [date: string]: Letter;
}

export interface RealLetterData {
  letterTitle?: string;
  worryContent: Array<{ id: string; text: string }>;
  answerContent: Array<{ id: string; text: string }>;
}
