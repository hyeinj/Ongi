import { LetterGenerationService } from '../../domain/services/LetterGenerationService';
import { LetterRepository } from '../../domain/repositories/LetterRepository';
import { EmotionRepository } from '../../domain/repositories/EmotionRepository';

export class GenerateLetterUseCase {
  constructor(
    private letterGenerationService: LetterGenerationService,
    private letterRepository: LetterRepository,
    private emotionRepository: EmotionRepository
  ) {}

  async generateMockLetter(date: string): Promise<{
    mockLetter: string;
    realLetterId: string;
    success: boolean;
    error?: string;
  }> {
    try {
      // 해당 날짜의 감정 데이터 조회
      const dailyEmotion = await this.emotionRepository.getByDate(date);
      if (!dailyEmotion) {
        throw new Error('해당 날짜의 감정 데이터를 찾을 수 없습니다.');
      }

      // 감정 컨텍스트 구성
      const emotionContext = {
        category: dailyEmotion.category || 'self',
        emotion: dailyEmotion.emotion || 'peace',
        answers: Object.fromEntries(
          Object.entries(dailyEmotion.entries).map(([stage, entry]) => [stage, entry.answer])
        ),
      };

      // 모의 편지 생성
      const result = await this.letterGenerationService.generateMockLetter(emotionContext);

      if (result.success) {
        // 생성된 모의 편지 저장
        await this.letterRepository.saveMockLetter(date, result.mockLetter, result.realLetterId);
      }

      return result;
    } catch (error) {
      console.error('모의 편지 생성 실패:', error);
      return {
        mockLetter: '',
        realLetterId: '',
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
