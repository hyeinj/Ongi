import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import {
  generateStep3Question,
  generateStep4Question,
  generateStep5Question,
  generateNextQuestion,
} from '../../app/actions/questionActions';

export class ServerActionQuestionGenerationService implements QuestionGenerationService {
  async generateStep3Question(step2Answer: string): Promise<string> {
    const response = await generateStep3Question(step2Answer);

    if (!response.success) {
      throw new Error(response.error || 'Step3 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateStep4Question(step2Answer: string, step3Answer: string): Promise<string> {
    const response = await generateStep4Question(step2Answer, step3Answer);

    if (!response.success) {
      throw new Error(response.error || 'Step4 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateStep5Question(
    step2Answer: string,
    step3Answer: string,
    step4Feelings: string[]
  ): Promise<string> {
    const response = await generateStep5Question(step2Answer, step3Answer, step4Feelings);

    if (!response.success) {
      throw new Error(response.error || 'Step5 질문 생성에 실패했습니다.');
    }

    return response.question;
  }

  async generateNextQuestion(
    previousAnswers: { [stage: string]: string },
    feelings?: string[]
  ): Promise<string> {
    const response = await generateNextQuestion(previousAnswers, feelings);

    if (!response.success) {
      throw new Error(response.error || '다음 질문 생성에 실패했습니다.');
    }

    return response.question;
  }
}
