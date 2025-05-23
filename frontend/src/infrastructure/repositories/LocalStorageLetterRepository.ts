import { LetterRepository } from '../../domain/repositories/LetterRepository';
import { Letter, Letters } from '../../domain/entities/Letters';
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter';

export class LocalStorageLetterRepository implements LetterRepository {
  private readonly STORAGE_KEY = 'letters';

  constructor(private storageAdapter: LocalStorageAdapter) {}

  async getByDate(date: string): Promise<Letter | null> {
    try {
      const lettersData = await this.storageAdapter.getLetterData();
      const letterData = lettersData[date];
      return letterData ? (letterData as Letter) : null;
    } catch (error) {
      console.error('편지 데이터 조회 실패:', error);
      return null;
    }
  }

  async save(date: string, letter: Letter): Promise<void> {
    try {
      await this.storageAdapter.setLetterByDate(date, letter);
    } catch (error) {
      console.error('편지 데이터 저장 실패:', error);
      throw error;
    }
  }

  async getAll(): Promise<Letters> {
    try {
      const lettersData = await this.storageAdapter.getLetterData();
      return lettersData as Letters;
    } catch (error) {
      console.error('모든 편지 데이터 조회 실패:', error);
      return {};
    }
  }

  async deleteByDate(date: string): Promise<void> {
    try {
      const lettersData = await this.storageAdapter.getLetterData();
      delete lettersData[date];
      await this.storageAdapter.setLetterData(lettersData);
    } catch (error) {
      console.error('편지 데이터 삭제 실패:', error);
      throw error;
    }
  }

  async saveMockLetter(date: string, mockLetter: string, realLetterId: string): Promise<void> {
    try {
      const existingLetter = await this.getByDate(date);
      const newLetter: Letter = {
        ...existingLetter,
        mockLetter,
        realLetterId,
        userResponse: existingLetter?.userResponse || '',
        aiFeedback: existingLetter?.aiFeedback || '',
        highlightedParts: existingLetter?.highlightedParts || [],
      };
      await this.save(date, newLetter);
    } catch (error) {
      console.error('모의 편지 저장 실패:', error);
      throw error;
    }
  }

  async saveUserResponse(date: string, userResponse: string): Promise<void> {
    try {
      const existingLetter = await this.getByDate(date);
      if (!existingLetter) {
        throw new Error('모의 편지가 먼저 생성되어야 합니다.');
      }
      const updatedLetter: Letter = {
        ...existingLetter,
        userResponse,
      };
      await this.save(date, updatedLetter);
    } catch (error) {
      console.error('사용자 답장 저장 실패:', error);
      throw error;
    }
  }

  async saveAiFeedback(
    date: string,
    aiFeedback: string,
    highlightedParts: string[]
  ): Promise<void> {
    try {
      const existingLetter = await this.getByDate(date);
      if (!existingLetter) {
        throw new Error('편지 데이터가 존재하지 않습니다.');
      }
      const updatedLetter: Letter = {
        ...existingLetter,
        aiFeedback,
        highlightedParts,
      };
      await this.save(date, updatedLetter);
    } catch (error) {
      console.error('AI 피드백 저장 실패:', error);
      throw error;
    }
  }
}
