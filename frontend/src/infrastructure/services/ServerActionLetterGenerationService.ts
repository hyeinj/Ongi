import { LetterGenerationService } from '../../domain/services/LetterGenerationService';
import { generateMockLetter, generateFeedback } from '../../app/actions/letterActions';

export class ServerActionLetterGenerationService implements LetterGenerationService {
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
    return await generateMockLetter(emotionContext);
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
    return await generateFeedback(mockLetter, userResponse, emotionContext);
  }
}
