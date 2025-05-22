# Emotion 도메인 클린 아키텍처 구현

이 문서는 Emotion 도메인에 적용된 클린 아키텍처/헥사고날 아키텍처 구현에 대해 설명합니다.

## 🏗️ 아키텍처 구조

```
src/
├── domain/                          # 도메인 레이어
│   ├── entities/
│   │   └── Emotion.ts              # 감정 엔티티 정의
│   ├── repositories/
│   │   └── EmotionRepository.ts    # 감정 저장소 인터페이스
│   └── services/
│       └── QuestionGenerationService.ts # 질문 생성 서비스 인터페이스
├── application/                     # 애플리케이션 레이어
│   └── usecases/
│       ├── SaveEmotionEntryUseCase.ts    # 감정 저장 유즈케이스
│       ├── GenerateQuestionUseCase.ts    # 질문 생성 유즈케이스
│       └── GetEmotionDataUseCase.ts      # 감정 조회 유즈케이스
├── infrastructure/                  # 인프라 레이어
│   ├── adapters/
│   │   ├── storage/
│   │   │   └── LocalStorageAdapter.ts    # 로컬스토리지 어댑터
│   │   └── api/
│   │       └── HttpApiAdapter.ts         # HTTP API 어댑터
│   ├── repositories/
│   │   └── LocalStorageEmotionRepository.ts # 로컬스토리지 구현체
│   ├── services/
│   │   ├── HttpQuestionGenerationService.ts     # HTTP 기반 질문 생성
│   │   └── ServerActionQuestionGenerationService.ts # 서버액션 기반 질문 생성
│   ├── container/
│   │   └── DIContainer.ts           # 의존성 주입 컨테이너
│   └── config/
│       └── DIConfig.ts              # DI 설정 유틸리티
├── presentation/                    # 프레젠테이션 레이어
│   ├── facades/
│   │   └── EmotionFacade.ts        # 컴포넌트용 파사드
│   └── hooks/
│       └── useEmotion.ts           # React Hook
├── app/
│   └── actions/
│       └── questionActions.ts       # 서버 액션 (OpenAI API 직접 호출)
└── examples/
    └── Step2WithCleanArchitecture.tsx # 리팩토링 예제
```

## 🎯 핵심 특징

### 1. 의존성 역전 (Dependency Inversion)

- 도메인 레이어가 인프라 레이어에 의존하지 않음
- 인터페이스를 통한 추상화로 구현체 교체 가능

### 2. 유연한 구현체 교체

```typescript
// HTTP 기반 질문 생성 사용
DIConfig.setHttpQuestionService();

// 서버액션 기반 질문 생성 사용 (기본값)
DIConfig.setServerActionQuestionService();
```

### 3. 환경 변수를 통한 설정

```bash
# .env.local
NEXT_PUBLIC_QUESTION_SERVICE_TYPE=server-action  # 또는 'http'
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 사용법

### 1. 기본 사용 (React Hook)

```typescript
import { useEmotion } from '@/presentation/hooks/useEmotion';

function MyComponent() {
  const {
    emotionData,
    isLoading,
    error,
    saveStep2AndGenerateStep3,
    saveStageAnswer,
    getStageAnswer,
  } = useEmotion();

  const handleSave = async () => {
    const nextQuestion = await saveStep2AndGenerateStep3('오늘은 회의가 너무 많았어요');
    console.log('다음 질문:', nextQuestion);
  };

  return (
    <div>
      {isLoading && <p>처리 중...</p>}
      {error && <p>오류: {error}</p>}
      <button onClick={handleSave}>저장하고 질문 생성</button>
    </div>
  );
}
```

### 2. 직접 Facade 사용

```typescript
import { EmotionFacade } from '@/presentation/facades/EmotionFacade';

const emotionFacade = new EmotionFacade();

// 답변 저장 및 질문 생성
const nextQuestion = await emotionFacade.saveStep2AndGenerateStep3('답변 내용');

// 감정 데이터 조회
const emotionData = await emotionFacade.getEmotionData();
```

### 3. 설정 변경

```typescript
import { DIConfig } from '@/infrastructure/config/DIConfig';

// 개발 시작 시 환경 설정
DIConfig.configureByEnvironment();

// 런타임에 설정 변경
DIConfig.setHttpQuestionService(); // HTTP API 사용
DIConfig.setServerActionQuestionService(); // 서버액션 사용 (기본값)
```

## 📊 데이터 구조

### DailyEmotion

```typescript
interface DailyEmotion {
  entries: StageEntries; // 각 단계별 질문-답변
  category: Category; // 카테고리 ('self' | 'growth' | 'routine' | 'relationship')
  emotion: EmotionType; // 감정 타입 ('joy' | 'sadness' | 'anger' | 'anxiety' | 'peace')
}
```

### 저장 형태

- **로컬스토리지**: `emotion_YYYY-MM-DD` 키로 저장
- **구조**: JSON 형태로 직렬화하여 저장

## 🔄 질문 생성 플로우

1. **Step2**: 기본 질문 → 사용자 답변 → GPT가 Step3 질문 생성
2. **Step3**: 생성된 질문 → 사용자 답변 → GPT가 Step4 질문 생성
3. **Step4**: 생성된 질문 → 감정 선택 → GPT가 Step5 질문 생성
4. **Step5+**: 이전 모든 답변 기반으로 다음 질문 생성

## 🧪 테스트 및 개발

### 의존성 교체 (테스트용)

```typescript
import { DIContainer } from '@/infrastructure/container/DIContainer';
import { MockEmotionRepository } from './mocks/MockEmotionRepository';

const container = DIContainer.getInstance();
container.setEmotionRepository(new MockEmotionRepository());
```

### 디버그 정보

개발 환경에서는 자동으로 설정 정보가 콘솔에 출력됩니다:

```
🔧 DI Container Configuration:
   Question Service Type: server-action
   Environment Variable: not set
```

## 🔧 환경 설정

### 필수 환경 변수

```bash
# OpenAI API 키 (서버액션 사용 시 필수)
OPENAI_API_KEY=sk-...

# 질문 생성 서비스 타입 (선택적)
NEXT_PUBLIC_QUESTION_SERVICE_TYPE=server-action
```

### 백엔드 API 사용 시 (HTTP 모드)

```bash
# 백엔드 서버 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 🚀 마이그레이션 가이드

### 기존 컴포넌트 마이그레이션

**Before (기존 방식):**

```typescript
// localStorage 직접 조작
localStorage.setItem('step2Answer', answer);

// HTTP 직접 호출
const response = await fetch('/api/question', { ... });
```

**After (클린 아키텍처):**

```typescript
// Hook을 통한 도메인 레이어 접근
const { saveStep2AndGenerateStep3 } = useEmotion();
const nextQuestion = await saveStep2AndGenerateStep3(answer);
```

### 기존 데이터 마이그레이션

```typescript
const { migrateFromLegacyStorage } = useEmotion();
await migrateFromLegacyStorage(); // 기존 localStorage 데이터를 새 구조로 이전
```

## 📈 확장 가능성

- **새로운 저장소**: DatabaseEmotionRepository 추가 가능
- **새로운 질문 생성 방식**: 다른 AI 서비스 연동 가능
- **새로운 도메인 엔티티**: Letter, Diary 등 확장 가능
- **새로운 유즈케이스**: 감정 분석, 통계 등 추가 가능

이 아키텍처를 통해 비즈니스 로직과 인프라 로직이 완전히 분리되어 테스트하기 쉽고 확장 가능한 구조를 구현했습니다.
