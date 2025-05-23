import { DIContainer } from './DIContainer';
import { SaveEmotionEntryUseCase } from '../application/usecases/SaveEmotionEntryUseCase';
import { GenerateQuestionUseCase } from '../application/usecases/GenerateQuestionUseCase';
import { GetEmotionDataUseCase } from '../application/usecases/GetEmotionDataUseCase';
import { GenerateLetterUseCase } from '../application/usecases/GenerateLetterUseCase';
import { SaveLetterResponseUseCase } from '../application/usecases/SaveLetterResponseUseCase';
import { GenerateFeedbackUseCase } from '../application/usecases/GenerateFeedbackUseCase';
import { GetLetterDataUseCase } from '../application/usecases/GetLetterDataUseCase';
import { SaveHighlightUseCase } from '../application/usecases/SaveHighlightUseCase';

/**
 * EmotionFacade에 필요한 Use Cases를 주입하기 위한 인터페이스
 */
export interface EmotionUseCases {
  saveEmotionEntryUseCase: SaveEmotionEntryUseCase;
  generateQuestionUseCase: GenerateQuestionUseCase;
  getEmotionDataUseCase: GetEmotionDataUseCase;
}

/**
 * LetterFacade에 필요한 Use Cases를 주입하기 위한 인터페이스
 */
export interface LetterUseCases {
  generateLetterUseCase: GenerateLetterUseCase;
  saveLetterResponseUseCase: SaveLetterResponseUseCase;
  generateFeedbackUseCase: GenerateFeedbackUseCase;
  getLetterDataUseCase: GetLetterDataUseCase;
  saveHighlightUseCase: SaveHighlightUseCase;
}

/**
 * Composition Root에서 Facade 객체들을 생성하고 의존성을 주입하는 Factory
 */
export class ContainerFactory {
  private static container: DIContainer;

  static getContainer(): DIContainer {
    if (!ContainerFactory.container) {
      ContainerFactory.container = DIContainer.getInstance();
    }
    return ContainerFactory.container;
  }

  /**
   * EmotionFacade에 필요한 Use Cases를 조립해서 반환
   */
  static createEmotionUseCases(): EmotionUseCases {
    const container = ContainerFactory.getContainer();
    
    return {
      saveEmotionEntryUseCase: container.saveEmotionEntryUseCase,
      generateQuestionUseCase: container.generateQuestionUseCase,
      getEmotionDataUseCase: container.getEmotionDataUseCase,
    };
  }

  /**
   * LetterFacade에 필요한 Use Cases를 조립해서 반환
   */
  static createLetterUseCases(): LetterUseCases {
    const container = ContainerFactory.getContainer();
    
    return {
      generateLetterUseCase: container.generateLetterUseCase,
      saveLetterResponseUseCase: container.saveLetterResponseUseCase,
      generateFeedbackUseCase: container.generateFeedbackUseCase,
      getLetterDataUseCase: container.getLetterDataUseCase,
      saveHighlightUseCase: container.saveHighlightUseCase,
    };
  }

  /**
   * 테스트용 컨테이너 초기화
   */
  static resetForTesting(): void {
    if (ContainerFactory.container) {
      ContainerFactory.container.reset();
    }
    ContainerFactory.container = DIContainer.getInstance();
  }
} 