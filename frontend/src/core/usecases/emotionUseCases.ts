import { EmotionEntry, Category, EmotionType } from '../entities';

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
  
  // 감정 엔트리 저장
  async saveEmotionEntry(
    date: string, 
    stage: string, 
    question: string, 
    answer: string,
    saveToStorage: (date: string, stage: string, entry: EmotionEntry) => Promise<void>
  ): Promise<void> {
    const entry: EmotionEntry = { question, answer };
    await saveToStorage(date, stage, entry);
  }

  // 다음 질문 생성
  async generateNextQuestion(
    step2Answer: string,
    generateQuestion: (data: QuestionData) => Promise<string>,
    step3Answer?: string,
    step4Feelings?: string[]
  ): Promise<string> {
    if (!step3Answer) {
      return await generateQuestion({ step2Answer });
    }
    if (!step4Feelings) {
      return await generateQuestion({ step2Answer, step3Answer });
    }
    return await generateQuestion({ step2Answer, step3Answer, step4Feelings });
  }

  // 감정 분석
  async analyzeEmotion(
    allAnswers: { [stage: string]: string },
    analyzeFunction: (answers: { [stage: string]: string }) => Promise<AnalysisResult>
  ): Promise<AnalysisResult> {
    return await analyzeFunction(allAnswers);
  }

  // 최종 텍스트 생성
  async generateFinalText(
    allAnswers: { [stage: string]: string },
    category: Category,
    emotion: EmotionType,
    generateText: (answers: { [stage: string]: string }, category: Category, emotion: EmotionType) => Promise<TextResult>
  ): Promise<TextResult> {
    return await generateText(allAnswers, category, emotion);
  }
} 