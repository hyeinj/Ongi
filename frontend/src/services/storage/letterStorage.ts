import { Letter } from '../../core/entities';
import { ILetterStorage } from '../../core/usecases/letterUseCases';

const LETTER_STORAGE_KEY = 'letters';

// RealLetter 데이터 타입
interface RealLetterData {
  worryContent: Array<{ id: string; text: string }>;
  answerContent: Array<{ id: string; text: string }>;
  emotion: string;
  category?: string;
  selectedAt: string;
}

// 편지 데이터 스토리지 서비스 (인터페이스 구현)
export class LetterStorage implements ILetterStorage {
  // 날짜별 편지 데이터 조회
  async getByDate(date: string): Promise<Letter | null> {
    try {
      const allData = this.getAllLetters();
      return allData[date] || null;
    } catch (error) {
      console.error('편지 데이터 조회 실패:', error);
      return null;
    }
  }

  // 편지 저장
  async saveLetter(date: string, letter: Partial<Letter>): Promise<void> {
    try {
      const allData = this.getAllLetters();
      const existingLetter = allData[date] || {
        mockLetter: '',
        userResponse: '',
        aiFeedback: '',
        realLetterId: '',
        highlightedParts: [],
      };

      allData[date] = { ...existingLetter, ...letter };
      localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('편지 저장 실패:', error);
      throw error;
    }
  }

  // RealLetter 데이터 저장
  async saveRealLetter(date: string, realLetterData: RealLetterData): Promise<void> {
    try {
      await this.saveLetter(date, { realLetterData });
    } catch (error) {
      console.error('RealLetter 저장 실패:', error);
      throw error;
    }
  }

  // RealLetter 데이터 조회
  async getRealLetter(date: string): Promise<RealLetterData | null> {
    try {
      const letter = await this.getByDate(date);
      return letter?.realLetterData || null;
    } catch (error) {
      console.error('RealLetter 조회 실패:', error);
      return null;
    }
  }

  // RealLetter 존재 여부 확인
  async hasRealLetter(date: string): Promise<boolean> {
    try {
      const realLetter = await this.getRealLetter(date);
      return !!realLetter;
    } catch (error) {
      console.error('RealLetter 존재 여부 확인 실패:', error);
      return false;
    }
  }

  // 사용자 응답 저장
  async saveUserResponse(date: string, response: string): Promise<void> {
    await this.saveLetter(date, { userResponse: response });
  }

  // 하이라이트 저장
  async saveHighlights(date: string, highlights: string[]): Promise<void> {
    await this.saveLetter(date, { highlightedParts: highlights });
  }

  // 모든 편지 데이터 조회
  async getAll(): Promise<Record<string, Letter>> {
    try {
      return this.getAllLetters();
    } catch (error) {
      console.error('전체 편지 데이터 조회 실패:', error);
      return {};
    }
  }

  // 날짜별 데이터 삭제
  async deleteByDate(date: string): Promise<void> {
    try {
      const allData = this.getAllLetters();
      delete allData[date];
      localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('편지 데이터 삭제 실패:', error);
      throw error;
    }
  }

  // 내부 헬퍼 메서드들
  private getAllLetters(): Record<string, Letter> {
    const data = localStorage.getItem(LETTER_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
}
