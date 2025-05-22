import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
import { QuestionGenerationService } from '../../domain/services/QuestionGenerationService';
import { SaveEmotionEntryUseCase } from '../../application/usecases/SaveEmotionEntryUseCase';
import { GenerateQuestionUseCase } from '../../application/usecases/GenerateQuestionUseCase';
import { GetEmotionDataUseCase } from '../../application/usecases/GetEmotionDataUseCase';

import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter';
import { HttpApiAdapter } from '../adapters/api/HttpApiAdapter';
import { LocalStorageEmotionRepository } from '../repositories/LocalStorageEmotionRepository';
import { HttpQuestionGenerationService } from '../services/HttpQuestionGenerationService';
import { ServerActionQuestionGenerationService } from '../services/ServerActionQuestionGenerationService';

export type QuestionServiceType = 'http' | 'server-action';

export class DIContainer {
  private static instance: DIContainer;
  private _localStorageAdapter?: LocalStorageAdapter;
  private _httpApiAdapter?: HttpApiAdapter;
  private _emotionRepository?: EmotionRepository;
  private _questionGenerationService?: QuestionGenerationService;
  private _saveEmotionEntryUseCase?: SaveEmotionEntryUseCase;
  private _generateQuestionUseCase?: GenerateQuestionUseCase;
  private _getEmotionDataUseCase?: GetEmotionDataUseCase;
  private _questionServiceType: QuestionServiceType;

  private constructor() {
    // 환경 변수를 통한 자동 설정 (기본값: server-action)
    const envType = process.env.NEXT_PUBLIC_QUESTION_SERVICE_TYPE as QuestionServiceType;
    this._questionServiceType = envType || 'server-action';
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Adapters
  get localStorageAdapter(): LocalStorageAdapter {
    if (!this._localStorageAdapter) {
      this._localStorageAdapter = new LocalStorageAdapter();
    }
    return this._localStorageAdapter;
  }

  get httpApiAdapter(): HttpApiAdapter {
    if (!this._httpApiAdapter) {
      this._httpApiAdapter = new HttpApiAdapter();
    }
    return this._httpApiAdapter;
  }

  // Repositories
  get emotionRepository(): EmotionRepository {
    if (!this._emotionRepository) {
      this._emotionRepository = new LocalStorageEmotionRepository(this.localStorageAdapter);
    }
    return this._emotionRepository;
  }

  // Services
  get questionGenerationService(): QuestionGenerationService {
    if (!this._questionGenerationService) {
      if (this._questionServiceType === 'server-action') {
        this._questionGenerationService = new ServerActionQuestionGenerationService();
      } else {
        this._questionGenerationService = new HttpQuestionGenerationService(this.httpApiAdapter);
      }
    }
    return this._questionGenerationService;
  }

  // Use Cases
  get saveEmotionEntryUseCase(): SaveEmotionEntryUseCase {
    if (!this._saveEmotionEntryUseCase) {
      this._saveEmotionEntryUseCase = new SaveEmotionEntryUseCase(this.emotionRepository);
    }
    return this._saveEmotionEntryUseCase;
  }

  get generateQuestionUseCase(): GenerateQuestionUseCase {
    if (!this._generateQuestionUseCase) {
      this._generateQuestionUseCase = new GenerateQuestionUseCase(
        this.questionGenerationService,
        this.emotionRepository
      );
    }
    return this._generateQuestionUseCase;
  }

  get getEmotionDataUseCase(): GetEmotionDataUseCase {
    if (!this._getEmotionDataUseCase) {
      this._getEmotionDataUseCase = new GetEmotionDataUseCase(this.emotionRepository);
    }
    return this._getEmotionDataUseCase;
  }

  // 설정 메서드들
  setQuestionServiceType(type: QuestionServiceType): void {
    this._questionServiceType = type;
    // 기존 인스턴스를 초기화하여 새로운 타입으로 재생성되도록 함
    this._questionGenerationService = undefined;
    this._generateQuestionUseCase = undefined;
  }

  getQuestionServiceType(): QuestionServiceType {
    return this._questionServiceType;
  }

  // 테스트용 의존성 교체 메서드들
  setEmotionRepository(repository: EmotionRepository): void {
    this._emotionRepository = repository;
  }

  setQuestionGenerationService(service: QuestionGenerationService): void {
    this._questionGenerationService = service;
  }

  // 컨테이너 초기화 (테스트용)
  reset(): void {
    this._localStorageAdapter = undefined;
    this._httpApiAdapter = undefined;
    this._emotionRepository = undefined;
    this._questionGenerationService = undefined;
    this._saveEmotionEntryUseCase = undefined;
    this._generateQuestionUseCase = undefined;
    this._getEmotionDataUseCase = undefined;
    this._questionServiceType = 'server-action'; // 기본값으로 초기화
  }
}
