// 편지 관련 타입들
export interface Letter {
  mockLetter: string;
  userResponse: string;
  aiFeedback: string;
  realLetterId: string;
  highlightedParts: string[];
  // 4개 영역 피드백
  feedbackSections?: {
    emotionConnection?: string; // 1. 감정 연결 피드백
    empathyReflection?: string[]; // 2. 공감 문장 반영 [원문, 위로문장]
    improvementSuggestion?: string[]; // 3. 개선 제안 [제목, 내용]
    overallComment?: string; // 4. 전체 코멘트
  };
}

export interface Letters {
  [date: string]: Letter;
}
