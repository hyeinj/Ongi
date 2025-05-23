import { LetterRepository } from '../../domain/repositories/LetterRepository';

export class SaveLetterResponseUseCase {
  constructor(private letterRepository: LetterRepository) {}

  async execute(date: string, userResponse: string): Promise<void> {
    try {
      await this.letterRepository.saveUserResponse(date, userResponse);
    } catch (error) {
      console.error('편지 답장 저장 실패:', error);
      throw error;
    }
  }
}
