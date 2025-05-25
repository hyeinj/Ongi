import { Letter } from '../entities';

interface LetterGenerationResult {
  success: boolean;
  error?: string;
  realLetterId?: string;
  mockLetter?: string;
}

interface FeedbackResult {
  success: boolean;
  error?: string;
  feedback?: string;
}

// 편지 관련 비즈니스 로직을 담당하는 클래스
export class LetterUseCases {
  
  // 편지 생성
  async generateLetter(
    date: string,
    generateFunction: (date: string) => Promise<LetterGenerationResult>
  ): Promise<LetterGenerationResult> {
    return await generateFunction(date);
  }

  // 사용자 응답 저장
  async saveUserResponse(
    date: string,
    response: string,
    saveFunction: (date: string, response: string) => Promise<void>
  ): Promise<void> {
    await saveFunction(date, response);
  }

  // 피드백 생성
  async generateFeedback(
    date: string,
    generateFunction: (date: string) => Promise<FeedbackResult>
  ): Promise<FeedbackResult> {
    return await generateFunction(date);
  }

  // 하이라이트 저장
  async saveHighlight(
    date: string,
    highlights: string[],
    saveFunction: (date: string, highlights: string[]) => Promise<void>
  ): Promise<void> {
    await saveFunction(date, highlights);
  }

  // 편지 데이터 조회
  async getLetterData(
    date: string,
    getFunction: (date: string) => Promise<Letter | null>
  ): Promise<Letter | null> {
    return await getFunction(date);
  }
} 