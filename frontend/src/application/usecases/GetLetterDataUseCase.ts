import { LetterRepository } from '../../domain/repositories/LetterRepository';
import { Letter, Letters } from '../../domain/entities/Letters';

export class GetLetterDataUseCase {
  constructor(private letterRepository: LetterRepository) {}

  async execute(date: string): Promise<Letter | null> {
    try {
      return await this.letterRepository.getByDate(date);
    } catch (error) {
      console.error('편지 데이터 조회 실패:', error);
      throw error;
    }
  }

  async getAll(): Promise<Letters> {
    try {
      return await this.letterRepository.getAll();
    } catch (error) {
      console.error('모든 편지 데이터 조회 실패:', error);
      throw error;
    }
  }

  async deleteByDate(date: string): Promise<void> {
    try {
      await this.letterRepository.deleteByDate(date);
    } catch (error) {
      console.error('편지 데이터 삭제 실패:', error);
      throw error;
    }
  }
}
