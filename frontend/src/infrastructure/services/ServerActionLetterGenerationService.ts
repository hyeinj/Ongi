import { LetterGenerationService } from '../../domain/services/LetterGenerationService';
import { ServerActionAdapter } from '../adapters/api/ServerActionAdapter';

export class ServerActionLetterGenerationService implements LetterGenerationService {
  constructor(private serverActionAdapter: ServerActionAdapter) {}

  async generateMockLetter(emotionContext: {
    category: string;
    emotion: string;
    answers: { [stage: string]: string };
  }): Promise<{
    mockLetter: string;
    realLetterId: string;
    success: boolean;
    error?: string;
  }> {
    return await this.serverActionAdapter.generateMockLetter(emotionContext);
  }

  async generateFeedback(
    mockLetter: string,
    userResponse: string,
    emotionContext: {
      category: string;
      emotion: string;
      answers: { [stage: string]: string };
    }
  ): Promise<{
    feedback: string;
    highlightedParts: string[];
    success: boolean;
    error?: string;
  }> {
    return await this.serverActionAdapter.generateFeedback(mockLetter, userResponse, emotionContext);
  }
}
