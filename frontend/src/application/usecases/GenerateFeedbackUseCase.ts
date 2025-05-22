import { LetterGenerationService } from '../../domain/services/LetterGenerationService';
import { LetterRepository } from '../../domain/repositories/LetterRepository';
import { EmotionRepository } from '../../domain/repositories/EmotionRepository';

export class GenerateFeedbackUseCase {
  constructor(
    private letterGenerationService: LetterGenerationService,
    private letterRepository: LetterRepository,
    private emotionRepository: EmotionRepository
  ) {}

  async execute(date: string): Promise<{
    feedback: string;
    highlightedParts: string[];
    success: boolean;
    error?: string;
  }> {
    try {
      // 편지 데이터 조회
      const letter = await this.letterRepository.getByDate(date);
      if (!letter || !letter.mockLetter || !letter.userResponse) {
        throw new Error('편지 데이터가 불완전합니다.');
      }

      // 감정 데이터 조회
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

      // AI 피드백 생성
      const result = await this.letterGenerationService.generateFeedback(
        letter.mockLetter,
        letter.userResponse,
        emotionContext
      );

      if (result.success) {
        // 생성된 피드백 저장
        await this.letterRepository.saveAiFeedback(date, result.feedback, result.highlightedParts);
      }

      return result;
    } catch (error) {
      console.error('AI 피드백 생성 실패:', error);
      return {
        feedback: '',
        highlightedParts: [],
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
