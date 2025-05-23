import { Letter, Letters } from '../entities/Letters';

export interface LetterRepository {
  /**
   * 특정 날짜의 편지 데이터 조회
   */
  getByDate(date: string): Promise<Letter | null>;

  /**
   * 편지 데이터 저장
   */
  save(date: string, letter: Letter): Promise<void>;

  /**
   * 모든 편지 데이터 조회
   */
  getAll(): Promise<Letters>;

  /**
   * 특정 날짜의 편지 데이터 삭제
   */
  deleteByDate(date: string): Promise<void>;

  /**
   * 모의 편지 저장 (단계별)
   */
  saveMockLetter(date: string, mockLetter: string, realLetterId: string): Promise<void>;

  /**
   * 사용자 답장 저장
   */
  saveUserResponse(date: string, userResponse: string): Promise<void>;

  /**
   * AI 피드백 저장
   */
  saveAiFeedback(date: string, aiFeedback: string, highlightedParts: string[]): Promise<void>;
}
