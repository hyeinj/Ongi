import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { EmotionEntry } from '../../domain/entities/Emotion';

export class SaveEmotionEntryUseCase {
  constructor(private emotionRepository: EmotionRepository) {}

  async execute(date: string, stage: string, question: string, answer: string): Promise<void> {
    const entry: EmotionEntry = {
      question,
      answer,
    };

    await this.emotionRepository.saveStageEntry(date, stage, entry);
  }
}
