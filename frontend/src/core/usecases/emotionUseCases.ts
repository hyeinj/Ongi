import { EmotionEntry, Category, EmotionType, DailyEmotion } from '../entities';
import { IslandUseCases } from './islandUseCases';

// 서비스 인터페이스들
export interface IQuestionService {
  generateQuestion(data: QuestionData): Promise<string>;
  analyzeEmotion(answers: { [stage: string]: string }): Promise<AnalysisResult>;
  generateFinalText(
    answers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<TextResult>;
  generateStep6Texts(answers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    options: string[];
    success: boolean;
    error?: string;
  }>;
  generateStep7Question(answers: {
    [stage: string]: string;
  }): Promise<{ question: string; success: boolean; error?: string }>;
}

export interface IEmotionStorage {
  getByDate(date: string): Promise<DailyEmotion | null>;
  saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void>;
  saveAIFeedback(date: string, feedback: string): Promise<void>;
  updateCategoryAndEmotion(date: string, category: Category, emotion: EmotionType): Promise<void>;
}

// 데이터 타입들
interface QuestionData {
  step2Answer: string;
  step3Answer?: string;
  step4Feelings?: string[];
}

interface AnalysisResult {
  category: Category;
  emotion: EmotionType;
  success: boolean;
  error?: string;
}

interface TextResult {
  finalText: string;
  success: boolean;
  error?: string;
}

// 감정 관련 비즈니스 로직을 담당하는 클래스
export class EmotionUseCases {
  constructor(
    private questionService: IQuestionService,
    private emotionStorage: IEmotionStorage,
    private islandUseCases: IslandUseCases
  ) {}

  // 감정 엔트리 저장
  async saveEmotionEntry(
    date: string,
    stage: string,
    question: string,
    answer: string
  ): Promise<void> {
    const entry: EmotionEntry = { question, answer };
    await this.emotionStorage.saveStageEntry(date, stage, entry);
  }

  // 다음 질문 생성
  async generateNextQuestion(
    step2Answer: string,
    step3Answer?: string,
    step4Feelings?: string[]
  ): Promise<string> {
    const questionData: QuestionData = { step2Answer };

    if (step3Answer) {
      questionData.step3Answer = step3Answer;
    }
    if (step4Feelings) {
      questionData.step4Feelings = step4Feelings;
    }

    return await this.questionService.generateQuestion(questionData);
  }

  // 감정 분석
  async analyzeEmotion(allAnswers: { [stage: string]: string }): Promise<AnalysisResult> {
    return await this.questionService.analyzeEmotion(allAnswers);
  }

  // 최종 텍스트 생성
  async generateFinalText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType
  ): Promise<TextResult> {
    return await this.questionService.generateFinalText(allAnswers, category, emotion);
  }

  // Step6 텍스트 생성
  async generateStep6Texts(allAnswers: { [stage: string]: string }): Promise<{
    smallText: string;
    largeText: string;
    options: string[];
    success: boolean;
    error?: string;
  }> {
    return await this.questionService.generateStep6Texts(allAnswers);
  }

  // Step7 질문 생성
  async generateStep7Question(allAnswers: {
    [stage: string]: string;
  }): Promise<{ question: string; success: boolean; error?: string }> {
    return await this.questionService.generateStep7Question(allAnswers);
  }

  // 스테이지 답변 조회
  async getStageAnswer(date: string, stage: string): Promise<string | null> {
    const data = await this.emotionStorage.getByDate(date);
    return data?.entries?.[stage]?.answer || null;
  }

  // 감정 분석 및 저장
  async analyzeAndSaveEmotion(date: string): Promise<AnalysisResult> {
    const data = await this.emotionStorage.getByDate(date);

    if (!data?.entries) {
      throw new Error('분석할 데이터가 없습니다.');
    }

    const allAnswers: { [stage: string]: string } = {};
    Object.entries(data.entries).forEach(([stage, entry]) => {
      allAnswers[stage] = (entry as EmotionEntry).answer;
    });

    const result = await this.analyzeEmotion(allAnswers);

    if (result.success) {
      await this.emotionStorage.updateCategoryAndEmotion(date, result.category, result.emotion);
      // Island에 해당 카테고리에 날짜 추가
      await this.islandUseCases.addDateToCategory(result.category, date);
    }

    return result;
  }

  // AI 피드백 저장
  async saveAIFeedback(date: string, feedback: string): Promise<void> {
    await this.emotionStorage.saveAIFeedback(date, feedback);
  }
}
