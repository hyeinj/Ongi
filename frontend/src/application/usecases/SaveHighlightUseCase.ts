import { LetterRepository } from '../../domain/repositories/LetterRepository';

export class SaveHighlightUseCase {
  constructor(private letterRepository: LetterRepository) {}

  async execute(date: string, highlightedParts: string[]): Promise<void> {
    // 기존 편지 데이터 가져오기
    const existingLetter = await this.letterRepository.getByDate(date);

    if (!existingLetter) {
      // 편지가 없는 경우 기본 구조로 생성
      const newLetter = {
        mockLetter: '',
        userResponse: '',
        aiFeedback: '',
        realLetterId: '',
        highlightedParts,
      };
      await this.letterRepository.save(date, newLetter);
    } else {
      // 기존 편지에 하이라이트 업데이트
      const updatedLetter = {
        ...existingLetter,
        highlightedParts,
      };
      await this.letterRepository.save(date, updatedLetter);
    }
  }
}
