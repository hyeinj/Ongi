import { DIContainer, QuestionServiceType } from '../container/DIContainer';

/**
 * DI 컨테이너 설정 유틸리티
 */
export class DIConfig {
  /**
   * 질문 생성 서비스 타입을 HTTP로 변경
   */
  static setHttpQuestionService(): void {
    const container = DIContainer.getInstance();
    container.setQuestionServiceType('http');
  }

  /**
   * 질문 생성 서비스 타입을 서버 액션으로 변경
   */
  static setServerActionQuestionService(): void {
    const container = DIContainer.getInstance();
    container.setQuestionServiceType('server-action');
  }

  /**
   * 현재 설정된 질문 생성 서비스 타입 조회
   */
  static getCurrentQuestionServiceType(): QuestionServiceType {
    const container = DIContainer.getInstance();
    return container.getQuestionServiceType();
  }

  /**
   * 개발 환경에서 설정 정보 출력
   */
  static logCurrentConfig(): void {
    if (process.env.NODE_ENV === 'development') {
      const currentType = DIConfig.getCurrentQuestionServiceType();
      console.log('🔧 DI Container Configuration:');
      console.log(`   Question Service Type: ${currentType}`);
      console.log(
        `   Environment Variable: ${process.env.NEXT_PUBLIC_QUESTION_SERVICE_TYPE || 'not set'}`
      );
    }
  }

  /**
   * 환경에 따른 자동 설정
   */
  static configureByEnvironment(): void {
    const envType = process.env.NEXT_PUBLIC_QUESTION_SERVICE_TYPE;

    if (!envType) {
      // 환경 변수가 설정되지 않은 경우 기본값은 서버액션 사용
      DIConfig.setServerActionQuestionService();
    }

    // 개발 환경에서는 설정 정보 출력
    DIConfig.logCurrentConfig();
  }
}
