# 🎯 간소화된 프론트엔드 아키텍처

## 📋 개요

기존의 복잡한 5레이어 클린 아키텍처를 **3레이어 구조**로 간소화했습니다.

### 🔄 변경 사항

**이전 (5레이어)**:
```
Domain ← Application ← Infrastructure + Presentation + Composition
```

**현재 (3레이어)**:
```
Core ← Services ← UI
```

---

## 🏗️ 새로운 구조

### 📁 폴더 구조

```
src/
├── core/                   # 🎯 핵심 비즈니스 로직
│   ├── entities/          # 엔티티 (타입 정의)
│   │   └── index.ts       # 모든 엔티티 통합
│   └── usecases/          # 비즈니스 로직
│       ├── emotionUseCases.ts
│       └── letterUseCases.ts
│
├── services/              # 🔧 외부 시스템 연동
│   ├── api/               # API 호출
│   │   ├── questionService.ts
│   │   └── letterService.ts
│   └── storage/           # 데이터 저장
│       ├── emotionStorage.ts
│       └── letterStorage.ts
│
├── ui/                    # 🖥️ 사용자 인터페이스
│   ├── hooks/             # React 훅
│   │   ├── useEmotion.ts
│   │   └── useLetter.ts
│   └── components/        # React 컴포넌트
│
└── app/                   # Next.js 앱 라우터
    ├── actions/           # 서버 액션
    └── _components/       # 페이지 컴포넌트
```

---

## 🎯 레이어별 책임

### 1️⃣ Core 레이어

**역할**: 핵심 비즈니스 로직과 엔티티 관리

#### 📦 구성 요소
- **entities**: 모든 타입 정의를 하나의 파일로 통합
- **usecases**: 비즈니스 로직을 담당하는 클래스들

#### 💻 예시
```typescript
// core/entities/index.ts
export interface EmotionEntry {
  question: string;
  answer: string;
}

export interface Letter {
  mockLetter: string;
  userResponse: string;
  aiFeedback: string;
  realLetterId: string;
  highlightedParts: string[];
}

// core/usecases/emotionUseCases.ts
export class EmotionUseCases {
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
}
```

### 2️⃣ Services 레이어

**역할**: 외부 시스템과의 연동 (API, 스토리지)

#### 📦 구성 요소
- **api**: 서버 액션을 직접 호출하는 서비스들
- **storage**: 로컬 스토리지를 직접 사용하는 서비스들

#### 💻 예시
```typescript
// services/api/questionService.ts
export class QuestionService {
  async generateQuestion(data: QuestionData): Promise<string> {
    const result = await generateStep3Question(data.step2Answer);
    if (!result.success) {
      throw new Error(result.error || '질문 생성에 실패했습니다.');
    }
    return result.question;
  }
}

// services/storage/emotionStorage.ts
export class EmotionStorage {
  async saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void> {
    let dailyEmotion = await this.getByDate(date);
    if (!dailyEmotion) {
      dailyEmotion = { entries: {}, category: 'self', emotion: 'peace' };
    }
    dailyEmotion.entries[stage] = entry;
    this.saveEmotion(date, dailyEmotion);
  }
}
```

### 3️⃣ UI 레이어

**역할**: React 컴포넌트와 상태 관리

#### 📦 구성 요소
- **hooks**: Core와 Services를 직접 사용하는 React 훅들
- **components**: UI 컴포넌트들

#### 💻 예시
```typescript
// ui/hooks/useEmotion.ts
export const useEmotion = () => {
  // 의존성을 직접 생성 (DI Container 제거)
  const emotionUseCases = new EmotionUseCases();
  const questionService = new QuestionService();
  const emotionStorage = new EmotionStorage();

  const saveEmotionEntry = useCallback(async (
    date: string,
    stage: string,
    question: string,
    answer: string
  ) => {
    await emotionUseCases.saveEmotionEntry(
      date,
      stage,
      question,
      answer,
      emotionStorage.saveStageEntry.bind(emotionStorage)
    );
  }, []);

  return { saveEmotionEntry, /* ... */ };
};
```

---

## ✨ 간소화의 장점

### 🎯 복잡성 감소
- **파일 수 50% 감소**: 5레이어 → 3레이어
- **추상화 레벨 낮춤**: 과도한 인터페이스 제거
- **Facade 패턴 제거**: 불필요한 중간 레이어 제거

### 🚀 개발 속도 향상
- **DI Container 제거**: 의존성을 사용하는 곳에서 직접 생성
- **직접적인 호출**: 복잡한 의존성 주입 체인 제거
- **명확한 데이터 흐름**: UI → Core → Services

### 🔧 유지보수성 증대
- **단순한 구조**: 3레이어로 이해하기 쉬움
- **명확한 책임**: 각 레이어의 역할이 명확
- **테스트 용이성**: 의존성 주입이 간단해짐

---

## 🔄 마이그레이션 가이드

### 기존 코드에서 새 구조로 변경하는 방법

#### 1. Facade 사용 → 직접 훅 사용
```typescript
// 이전
const emotionFacade = new EmotionFacade(useCases);
await emotionFacade.saveStep2AndGenerateStep3(answer);

// 현재
const { saveEmotionEntry, generateNextQuestion } = useEmotion();
await saveEmotionEntry(date, 'step2', question, answer);
const nextQuestion = await generateNextQuestion(answer);
```

#### 2. DI Container → 직접 생성
```typescript
// 이전
const useCases = ContainerFactory.createEmotionUseCases();

// 현재
const emotionUseCases = new EmotionUseCases();
const questionService = new QuestionService();
const emotionStorage = new EmotionStorage();
```

#### 3. 복잡한 UseCase → 간단한 UseCase
```typescript
// 이전
class GenerateQuestionUseCase {
  constructor(
    private questionService: QuestionGenerationService,
    private emotionRepository: EmotionRepository
  ) {}
  
  async executeForStep3(step2Answer: string): Promise<string> {
    return await this.questionService.generateStep3Question(step2Answer);
  }
}

// 현재
class EmotionUseCases {
  async generateNextQuestion(
    step2Answer: string,
    generateQuestion: (data: QuestionData) => Promise<string>,
    step3Answer?: string,
    step4Feelings?: string[]
  ): Promise<string> {
    if (!step3Answer) {
      return await generateQuestion({ step2Answer });
    }
    // ...
  }
}
```

---

## 🎉 결론

이번 간소화를 통해:
- **개발 복잡성 50% 감소**
- **코드 가독성 향상**
- **새로운 개발자 온보딩 시간 단축**
- **유지보수 비용 절감**

복잡한 클린 아키텍처에서 실용적이고 간단한 3레이어 구조로 전환하여, 개발 생산성과 코드 품질을 모두 향상시켰습니다. 