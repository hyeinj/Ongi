import { Letter, Category, EmotionType } from '../entities';

// 서비스 인터페이스들
export interface ILetterService {
  generateLetter(emotionContext: EmotionContext): Promise<LetterGenerationResult>;
  generateFeedback(mockLetter: string, userResponse: string, emotionContext: EmotionContext): Promise<FeedbackResult>;
}

export interface ILetterStorage {
  getByDate(date: string): Promise<Letter | null>;
  saveLetter(date: string, letter: Partial<Letter>): Promise<void>;
  saveUserResponse(date: string, response: string): Promise<void>;
  saveHighlights(date: string, highlights: string[]): Promise<void>;
  getAll(): Promise<Record<string, Letter>>;
  deleteByDate(date: string): Promise<void>;
}

// 데이터 타입들
interface EmotionContext {
  category: Category;
  emotion: EmotionType;
  answers: { [stage: string]: string };
}

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
  highlightedParts?: string[];
}

// 편지 관련 비즈니스 로직을 담당하는 클래스
export class LetterUseCases {
  constructor(
    private letterService: ILetterService,
    private letterStorage: ILetterStorage
  ) {}
  
  // 편지 생성
  async generateLetter(
    date: string,
    emotionContext: EmotionContext
  ): Promise<LetterGenerationResult> {
    const result = await this.letterService.generateLetter(emotionContext);
    
    // 성공시 스토리지에 저장
    if (result.success && result.mockLetter && result.realLetterId) {
      await this.letterStorage.saveLetter(date, {
        mockLetter: result.mockLetter,
        realLetterId: result.realLetterId,
      });
    }
    
    return result;
  }

  // 사용자 응답 저장
  async saveUserResponse(
    date: string,
    response: string
  ): Promise<void> {
    await this.letterStorage.saveUserResponse(date, response);
  }

  // 피드백 생성
  async generateFeedback(
    date: string,
    mockLetter: string,
    userResponse: string,
    emotionContext: EmotionContext
  ): Promise<FeedbackResult> {
    const result = await this.letterService.generateFeedback(mockLetter, userResponse, emotionContext);
    
    // 성공시 스토리지에 저장
    if (result.success && result.feedback) {
      await this.letterStorage.saveLetter(date, {
        aiFeedback: result.feedback,
      });
    }
    
    return result;
  }

  // 하이라이트 저장
  async saveHighlight(
    date: string,
    highlights: string[]
  ): Promise<void> {
    await this.letterStorage.saveHighlights(date, highlights);
  }

  // 편지 데이터 조회
  async getLetterData(
    date: string
  ): Promise<Letter | null> {
    return await this.letterStorage.getByDate(date);
  }

  // 모든 편지 조회
  async getAllLetters(): Promise<Record<string, Letter>> {
    return await this.letterStorage.getAll();
  }

  // 편지 데이터 삭제
  async deleteLetterData(date: string): Promise<void> {
    await this.letterStorage.deleteByDate(date);
  }
} 