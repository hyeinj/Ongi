import { DIContainer, QuestionServiceType } from './DIContainer';

/**
 * DI 컨테이너 설정 유틸리티
 * 
 * 의존성 주입 컨테이너의 설정과 관리를 담당하는 유틸리티 클래스입니다.
 * 클린 아키텍처에서 Composition Layer의 일부로, 
 * 의존성 조립과 설정을 중앙에서 관리합니다.
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

  /**
   * 테스트 환경용 초기화
   */
  static resetForTesting(): void {
    const container = DIContainer.getInstance();
    container.reset();
  }

  /**
   * 프로덕션 환경용 최적화된 설정
   */
  static configureForProduction(): void {
    // 프로덕션에서는 서버 액션을 기본으로 사용
    DIConfig.setServerActionQuestionService();
  }

  /**
   * 개발 환경용 설정 (HTTP API 사용)
   */
  static configureForDevelopment(): void {
    // 개발 환경에서는 HTTP API를 사용할 수도 있음
    const useHttp = process.env.NEXT_PUBLIC_USE_HTTP_API === 'true';
    
    if (useHttp) {
      DIConfig.setHttpQuestionService();
    } else {
      DIConfig.setServerActionQuestionService();
    }
    
    DIConfig.logCurrentConfig();
  }
} 