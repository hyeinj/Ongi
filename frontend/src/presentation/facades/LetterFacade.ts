import { Letter, Letters } from '../../domain/entities/Letters';
import { LetterUseCases } from '../../composition/ContainerFactory';

export class LetterFacade {
  private generateLetterUseCase: LetterUseCases['generateLetterUseCase'];
  private saveLetterResponseUseCase: LetterUseCases['saveLetterResponseUseCase'];
  private generateFeedbackUseCase: LetterUseCases['generateFeedbackUseCase'];
  private getLetterDataUseCase: LetterUseCases['getLetterDataUseCase'];
  private saveHighlightUseCase: LetterUseCases['saveHighlightUseCase'];

  constructor(useCases: LetterUseCases) {
    this.generateLetterUseCase = useCases.generateLetterUseCase;
    this.saveLetterResponseUseCase = useCases.saveLetterResponseUseCase;
    this.generateFeedbackUseCase = useCases.generateFeedbackUseCase;
    this.getLetterDataUseCase = useCases.getLetterDataUseCase;
    this.saveHighlightUseCase = useCases.saveHighlightUseCase;
  }

  /**
   * 현재 날짜를 YYYY-MM-DD 형식으로 반환
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * 모의 편지 생성
   */
  async generateMockLetter(date?: string): Promise<{
    success: boolean;
    error?: string;
    realLetterId?: string;
    mockLetter?: string;
  }> {
    const targetDate = date || this.getCurrentDate();
    return await this.generateLetterUseCase.generateMockLetter(targetDate);
  }

  /**
   * 사용자 답장 저장
   */
  async saveUserResponse(userResponse: string, date?: string): Promise<void> {
    const targetDate = date || this.getCurrentDate();
    await this.saveLetterResponseUseCase.execute(targetDate, userResponse);
  }

  /**
   * AI 피드백 생성
   */
  async generateFeedback(date?: string): Promise<{
    success: boolean;
    error?: string;
    feedback?: string;
    highlightedParts?: string[];
  }> {
    const targetDate = date || this.getCurrentDate();
    return await this.generateFeedbackUseCase.execute(targetDate);
  }

  /**
   * 특정 날짜의 편지 데이터 조회
   */
  async getLetterData(date?: string): Promise<Letter | null> {
    const targetDate = date || this.getCurrentDate();
    return await this.getLetterDataUseCase.execute(targetDate);
  }

  /**
   * 특정 날짜의 편지 데이터 삭제
   */
  async deleteLetterData(date?: string): Promise<void> {
    const targetDate = date || this.getCurrentDate();
    await this.getLetterDataUseCase.deleteByDate(targetDate);
  }

  /**
   * 모든 편지 데이터 조회
   */
  async getAllLetters(): Promise<Letters> {
    return await this.getLetterDataUseCase.getAll();
  }

  /**
   * 하이라이트 저장
   */
  async saveHighlight(highlightedParts: string[], date?: string): Promise<void> {
    const targetDate = date || this.getCurrentDate();
    await this.saveHighlightUseCase.execute(targetDate, highlightedParts);
  }
} 