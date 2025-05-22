export interface LetterGenerationService {
  /**
   * 감정 데이터를 기반으로 모의 편지 생성
   */
  generateMockLetter(emotionContext: {
    category: string;
    emotion: string;
    answers: { [stage: string]: string };
  }): Promise<{
    mockLetter: string;
    realLetterId: string;
    success: boolean;
    error?: string;
  }>;

  /**
   * 사용자 답장에 대한 AI 피드백 생성
   */
  generateFeedback(
    mockLetter: string,
    userResponse: string,
    emotionContext: {
      category: string;
      emotion: string;
      answers: { [stage: string]: string };
    }
  ): Promise<{
    feedback: string;
    highlightedParts: string[];
    success: boolean;
    error?: string;
  }>;
}
