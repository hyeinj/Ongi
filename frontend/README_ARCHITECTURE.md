# 🏗️ 프론트엔드 아키텍처 가이드

## 📋 목차
- [프로젝트 개요](#-프로젝트-개요)
- [아키텍처 개요](#-아키텍처-개요)
- [레이어별 상세 설명](#-레이어별-상세-설명)
- [폴더 구조](#-폴더-구조)
- [핵심 패턴](#-핵심-패턴)
- [의존성 관리](#-의존성-관리)
- [기술 스택](#-기술-스택)
- [아키텍처 장점](#-아키텍처-장점)
- [개발 가이드라인](#-개발-가이드라인)

---

## 🎯 프로젝트 개요

본 프로젝트는 **클린 아키텍처(Clean Architecture)** 원칙을 기반으로 설계된 Next.js 프론트엔드 애플리케이션입니다. 감정 분석과 편지 생성 기능을 제공하는 감정 공감 플랫폼으로, 확장 가능하고 테스트 용이한 구조를 지향합니다.

### 🎯 설계 목표
- **의존성 역전 원칙** 준수
- **레이어 간 명확한 분리**
- **높은 테스트 커버리지** 지원
- **유지보수성과 확장성** 보장
- **비즈니스 로직의 독립성** 확보

---

## 🏛️ 아키텍처 개요

### 클린 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Hooks     │  │   Facades   │  │     Contexts        │  │
│  │ (useLetter, │  │(LetterFacade│  │  (React Context)    │  │
│  │ useEmotion) │  │EmotionFacade│  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   COMPOSITION LAYER                        │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   ContainerFactory  │  │        DIContainer          │   │
│  │   (Create UseCases) │  │    (Dependency Injection)   │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Use Cases                         │    │
│  │ • GenerateQuestionUseCase                          │    │
│  │ • SaveEmotionEntryUseCase                          │    │
│  │ • GenerateLetterUseCase                            │    │
│  │ • GenerateFeedbackUseCase                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Entities   │  │ Repositories│  │      Services       │  │
│  │ (Emotion,   │  │(Interfaces) │  │   (Interfaces)      │  │
│  │  Letter)    │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Adapters   │  │ Repositories│  │      Services       │  │
│  │(ServerAction│  │(LocalStorage│  │   (Implementations) │  │
│  │ HttpApi)    │  │ Impl)       │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 레이어별 책임

| 레이어 | 책임 | 의존 방향 |
|--------|------|-----------|
| **Presentation** | UI 로직, 사용자 인터랙션 | → Application |
| **Composition** | 의존성 주입, 객체 조립 | → All Layers |
| **Application** | 비즈니스 유스케이스 | → Domain |
| **Domain** | 핵심 비즈니스 로직, 엔티티 | 독립적 |
| **Infrastructure** | 외부 시스템 연동 | → Domain |

---

## 🏗️ 레이어별 상세 설명

### 1️⃣ Domain Layer (도메인 레이어)

> 💡 **핵심 비즈니스 로직과 규칙을 담당하는 최상위 레이어**

#### 📁 구조
```
domain/
├── entities/           # 비즈니스 엔티티
│   ├── Emotion.ts     # 감정 관련 엔티티
│   ├── Letters.ts     # 편지 관련 엔티티
│   └── User.ts        # 사용자 엔티티
├── repositories/      # 리포지토리 인터페이스
│   ├── EmotionRepository.ts
│   └── LetterRepository.ts
└── services/          # 도메인 서비스 인터페이스
    ├── QuestionGenerationService.ts
    └── LetterGenerationService.ts
```

#### 🔧 주요 특징
- **외부 의존성 없음**: 순수한 TypeScript/JavaScript로만 구성
- **비즈니스 규칙 캡슐화**: 핵심 비즈니스 로직 포함
- **인터페이스 정의**: 하위 레이어에서 구현할 계약 정의

#### 💻 예시 코드
```typescript
// domain/entities/Emotion.ts
export interface DailyEmotion {
  entries: { [stage: string]: EmotionEntry };
  category: Category;
  emotion: EmotionType;
}

// domain/repositories/EmotionRepository.ts
export interface EmotionRepository {
  getByDate(date: string): Promise<DailyEmotion | null>;
  saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void>;
}
```

### 2️⃣ Application Layer (애플리케이션 레이어)

> 💡 **비즈니스 유스케이스를 구현하는 레이어**

#### 📁 구조
```
application/
└── usecases/
    ├── GenerateQuestionUseCase.ts
    ├── SaveEmotionEntryUseCase.ts
    ├── GenerateLetterUseCase.ts
    ├── GenerateFeedbackUseCase.ts
    └── GetEmotionDataUseCase.ts
```

#### 🔧 주요 특징
- **유스케이스 구현**: 특정 비즈니스 시나리오 처리
- **도메인 서비스 조합**: 여러 도메인 서비스를 조합하여 복잡한 로직 처리
- **트랜잭션 경계**: 데이터 일관성 보장

#### 💻 예시 코드
```typescript
// application/usecases/GenerateQuestionUseCase.ts
export class GenerateQuestionUseCase {
  constructor(
    private questionService: QuestionGenerationService,
    private emotionRepository: EmotionRepository
  ) {}

  async executeForStep3(step2Answer: string): Promise<string> {
    return await this.questionService.generateStep3Question(step2Answer);
  }
}
```

### 3️⃣ Infrastructure Layer (인프라스트럭처 레이어)

> 💡 **외부 시스템과의 연동을 담당하는 레이어**

#### 📁 구조
```
infrastructure/
├── adapters/
│   ├── api/
│   │   ├── ServerActionAdapter.ts    # Next.js 서버 액션 어댑터
│   │   └── HttpApiAdapter.ts         # HTTP API 어댑터
│   └── storage/
│       └── LocalStorageAdapter.ts    # 로컬 스토리지 어댑터
├── repositories/
│   ├── LocalStorageEmotionRepository.ts
│   └── LocalStorageLetterRepository.ts
└── services/
    ├── ServerActionQuestionGenerationService.ts
    ├── ServerActionLetterGenerationService.ts
    └── HttpQuestionGenerationService.ts
```

#### 🔧 주요 특징
- **어댑터 패턴**: 외부 시스템을 도메인 인터페이스에 맞게 변환
- **구현체 제공**: 도메인 인터페이스의 실제 구현
- **기술 의존성**: Next.js, localStorage, HTTP 등 구체적 기술 사용

#### 💻 예시 코드
```typescript
// infrastructure/adapters/api/ServerActionAdapter.ts
export class ServerActionAdapter {
  async generateStep3Question(step2Answer: string): Promise<QuestionResponse> {
    return await generateStep3Question(step2Answer);
  }
}

// infrastructure/services/ServerActionQuestionGenerationService.ts
export class ServerActionQuestionGenerationService implements QuestionGenerationService {
  constructor(private serverActionAdapter: ServerActionAdapter) {}
  
  async generateStep3Question(step2Answer: string): Promise<string> {
    const response = await this.serverActionAdapter.generateStep3Question(step2Answer);
    if (!response.success) {
      throw new Error(response.error || 'Step3 질문 생성에 실패했습니다.');
    }
    return response.question;
  }
}
```

### 4️⃣ Presentation Layer (프레젠테이션 레이어)

> 💡 **사용자 인터페이스와 상호작용을 담당하는 레이어**

#### 📁 구조
```
presentation/
├── hooks/              # React 커스텀 훅
│   ├── useEmotion.ts  # 감정 관련 로직
│   ├── useLetter.ts   # 편지 관련 로직
│   └── useDelayedLoading.ts
├── facades/           # 파사드 패턴
│   ├── EmotionFacade.ts
│   └── LetterFacade.ts
└── contexts/          # React 컨텍스트
```

#### 🔧 주요 특징
- **파사드 패턴**: 복잡한 비즈니스 로직을 간단한 인터페이스로 제공
- **React 통합**: React의 상태 관리와 생명주기에 맞게 설계
- **UI 로직 분리**: 비즈니스 로직과 UI 로직의 명확한 분리

#### 💻 예시 코드
```typescript
// presentation/facades/LetterFacade.ts
export class LetterFacade {
  constructor(private useCases: LetterUseCases) {}

  async generateMockLetter(date?: string): Promise<{
    success: boolean;
    error?: string;
    realLetterId?: string;
    mockLetter?: string;
  }> {
    const targetDate = date || this.getCurrentDate();
    return await this.generateLetterUseCase.generateMockLetter(targetDate);
  }
}

// presentation/hooks/useLetter.ts
export const useLetter = (): UseLetterReturn => {
  const [letterFacade] = useState(() => {
    const useCases = ContainerFactory.createLetterUseCases();
    return new LetterFacade(useCases);
  });
  
  const generateMockLetter = useCallback(async (date?: string) => {
    // 파사드를 통한 비즈니스 로직 호출
    return await letterFacade.generateMockLetter(date);
  }, [letterFacade]);
  
  return { generateMockLetter, /* ... */ };
};
```

### 5️⃣ Composition Layer (컴포지션 레이어)

> 💡 **의존성 주입과 객체 조립을 담당하는 레이어**

#### 📁 구조
```
composition/
├── DIContainer.ts       # 의존성 주입 컨테이너
└── ContainerFactory.ts  # 팩토리 패턴
```

#### 🔧 주요 특징
- **의존성 주입**: 모든 객체의 생성과 의존성 관리
- **설정 중앙화**: 환경별 설정 관리
- **테스트 지원**: 테스트용 의존성 교체 기능

#### 💻 예시 코드
```typescript
// composition/DIContainer.ts
export class DIContainer {
  get questionGenerationService(): QuestionGenerationService {
    if (!this._questionGenerationService) {
      if (this._questionServiceType === 'server-action') {
        this._questionGenerationService = new ServerActionQuestionGenerationService(
          this.serverActionAdapter
        );
      } else {
        this._questionGenerationService = new HttpQuestionGenerationService(
          this.httpApiAdapter
        );
      }
    }
    return this._questionGenerationService;
  }
}

// composition/ContainerFactory.ts
export class ContainerFactory {
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
}
```

---

## 📁 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── actions/           # 서버 액션 (Next.js 요구사항)
│   │   ├── questionActions.ts
│   │   └── letterActions.ts
│   ├── _components/       # 페이지 컴포넌트
│   ├── self-empathy/      # 자기공감 페이지
│   ├── other-empathy/     # 타인공감 페이지
│   ├── letter-exercise/   # 편지연습 페이지
│   ├── layout.tsx
│   └── page.tsx
│
├── domain/                # 🏛️ 도메인 레이어
│   ├── entities/
│   ├── repositories/
│   └── services/
│
├── application/           # 🎯 애플리케이션 레이어
│   └── usecases/
│
├── infrastructure/        # 🔧 인프라스트럭처 레이어
│   ├── adapters/
│   │   ├── api/
│   │   └── storage/
│   ├── repositories/
│   └── services/
│
├── presentation/          # 🖥️ 프레젠테이션 레이어
│   ├── hooks/
│   ├── facades/
│   └── contexts/
│
├── composition/           # 🏭 컴포지션 레이어
│   ├── DIContainer.ts
│   └── ContainerFactory.ts
│
├── types/                 # 타입 정의
├── styles/                # 스타일 파일
└── assets/                # 정적 자원
```

---

## 🎨 핵심 패턴

### 1. 🎭 Facade Pattern (파사드 패턴)

**목적**: 복잡한 유스케이스 조합을 간단한 인터페이스로 제공

```typescript
// EmotionFacade - 감정 관련 복잡한 로직을 단순화
export class EmotionFacade {
  async saveStep2AndGenerateStep3(answer: string): Promise<string> {
    // 1. Step2 답변 저장
    await this.saveEmotionEntryUseCase.execute(date, 'step2', question, answer);
    // 2. Step3 질문 생성
    return await this.generateQuestionUseCase.executeForStep3(answer);
  }
}
```

### 2. 🔌 Adapter Pattern (어댑터 패턴)

**목적**: 외부 시스템을 도메인 인터페이스에 맞게 변환

```typescript
// ServerActionAdapter - Next.js 서버 액션을 어댑터로 래핑
export class ServerActionAdapter {
  async generateStep3Question(step2Answer: string): Promise<QuestionResponse> {
    // Next.js 서버 액션을 도메인 인터페이스에 맞게 변환
    return await generateStep3Question(step2Answer);
  }
}
```

### 3. 🏪 Repository Pattern (리포지토리 패턴)

**목적**: 데이터 접근 로직을 추상화하여 비즈니스 로직과 분리

```typescript
// 도메인에서 인터페이스 정의
interface EmotionRepository {
  getByDate(date: string): Promise<DailyEmotion | null>;
  saveStageEntry(date: string, stage: string, entry: EmotionEntry): Promise<void>;
}

// 인프라스트럭처에서 구현
class LocalStorageEmotionRepository implements EmotionRepository {
  constructor(private storageAdapter: LocalStorageAdapter) {}
  // localStorage를 사용한 구체적 구현
}
```

### 4. 🎯 Use Case Pattern (유스케이스 패턴)

**목적**: 특정 비즈니스 시나리오를 캡슐화

```typescript
export class GenerateQuestionUseCase {
  constructor(
    private questionService: QuestionGenerationService,
    private emotionRepository: EmotionRepository
  ) {}

  async executeForStep3(step2Answer: string): Promise<string> {
    // 특정 비즈니스 시나리오 (Step3 질문 생성) 처리
    return await this.questionService.generateStep3Question(step2Answer);
  }
}
```

### 5. 🏭 Factory Pattern (팩토리 패턴)

**목적**: 객체 생성과 의존성 조립을 중앙화

```typescript
export class ContainerFactory {
  static createEmotionUseCases(): EmotionUseCases {
    const container = ContainerFactory.getContainer();
    return {
      saveEmotionEntryUseCase: container.saveEmotionEntryUseCase,
      generateQuestionUseCase: container.generateQuestionUseCase,
      getEmotionDataUseCase: container.getEmotionDataUseCase,
    };
  }
}
```

---

## ⚙️ 의존성 관리

### 🎯 의존성 방향 원칙

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑         ↑
Composition ──────────────────────────────┘
```

### 🔄 의존성 주입 흐름

1. **DIContainer**: 모든 객체 생성과 의존성 관리
2. **ContainerFactory**: 레이어별 의존성 조립
3. **Facade**: 비즈니스 로직 캡슐화
4. **Hook**: React 컴포넌트에서 사용

```typescript
// 의존성 주입 흐름 예시
const useLetter = () => {
  // 1. ContainerFactory에서 유스케이스 조립
  const useCases = ContainerFactory.createLetterUseCases();
  
  // 2. Facade에 유스케이스 주입
  const letterFacade = new LetterFacade(useCases);
  
  // 3. React Hook에서 Facade 사용
  return { generateMockLetter: letterFacade.generateMockLetter };
};
```

### 🧪 테스트 지원

```typescript
// 테스트 시 의존성 교체
DIContainer.getInstance().setEmotionRepository(mockEmotionRepository);
DIContainer.getInstance().setQuestionGenerationService(mockQuestionService);
```

---

## 🛠️ 기술 스택

### 🎨 Frontend Framework
- **Next.js 15**: React 기반 풀스택 프레임워크
- **React 18**: 사용자 인터페이스 라이브러리
- **TypeScript**: 정적 타입 시스템

### 🎯 상태 관리
- **React Hooks**: 지역 상태 관리
- **React Context**: 전역 상태 공유
- **Custom Hooks**: 비즈니스 로직 캡슐화

### 🎨 스타일링
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Emotion**: CSS-in-JS (일부 컴포넌트)

### 🔧 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안정성

### 🌐 API 통신
- **Next.js Server Actions**: 서버 사이드 로직
- **OpenAI API**: AI 기반 질문/편지 생성
- **Local Storage**: 클라이언트 데이터 저장

---

## ✨ 아키텍처 장점

### 🎯 1. 높은 테스트 용이성
- **의존성 주입**: 모든 의존성을 모킹 가능
- **인터페이스 기반**: 구현체 교체 용이
- **레이어 분리**: 단위 테스트와 통합 테스트 분리

### 🔄 2. 뛰어난 확장성
- **개방-폐쇄 원칙**: 기존 코드 수정 없이 기능 확장
- **인터페이스 기반 설계**: 새로운 구현체 추가 용이
- **모듈화**: 독립적인 기능 개발 가능

### 🛡️ 3. 강력한 유지보수성
- **단일 책임 원칙**: 각 클래스의 명확한 역할
- **의존성 역전**: 비즈니스 로직과 기술 구현 분리
- **명확한 경계**: 레이어 간 책임 분리

### 🧪 4. 효율적인 개발 경험
- **타입 안정성**: TypeScript를 통한 컴파일 타임 오류 방지
- **자동완성**: IDE에서 강력한 IntelliSense 지원
- **코드 재사용**: 공통 로직의 효율적 재사용

### 🔒 5. 비즈니스 로직 보호
- **도메인 중심**: 핵심 비즈니스 로직이 외부 기술에 의존하지 않음
- **변경 영향 최소화**: 외부 라이브러리 변경 시 영향 범위 제한
- **규칙 일관성**: 비즈니스 규칙의 일관된 적용

---

## 📋 개발 가이드라인

### ✅ DO (권장사항)

#### 1. **의존성 방향 준수**
```typescript
// ✅ 올바른 의존성 방향
import { EmotionRepository } from '../../domain/repositories/EmotionRepository';
```

#### 2. **인터페이스 우선 설계**
```typescript
// ✅ 도메인에서 인터페이스 정의
export interface QuestionGenerationService {
  generateStep3Question(answer: string): Promise<string>;
}
```

#### 3. **파사드를 통한 복잡성 캡슐화**
```typescript
// ✅ 복잡한 유스케이스 조합을 파사드로 단순화
const result = await emotionFacade.saveStep2AndGenerateStep3(answer);
```

#### 4. **의존성 주입 활용**
```typescript
// ✅ 생성자를 통한 의존성 주입
export class GenerateQuestionUseCase {
  constructor(
    private questionService: QuestionGenerationService,
    private emotionRepository: EmotionRepository
  ) {}
}
```

### ❌ DON'T (금지사항)

#### 1. **의존성 방향 위반**
```typescript
// ❌ 프레젠테이션에서 인프라스트럭처 직접 참조
import { DIContainer } from '../../infrastructure/container/DIContainer';
```

#### 2. **구체 클래스 직접 의존**
```typescript
// ❌ 인터페이스 대신 구체 클래스 의존
import { LocalStorageEmotionRepository } from '../../infrastructure/...';
```

#### 3. **비즈니스 로직 분산**
```typescript
// ❌ 프레젠테이션 레이어에 비즈니스 로직
const processEmotion = () => {
  // 복잡한 비즈니스 로직이 훅에 직접 구현되면 안됨
};
```

#### 4. **하드코딩된 의존성**
```typescript
// ❌ 하드코딩된 의존성 생성
const repository = new LocalStorageEmotionRepository();
```

### 🔄 리팩토링 가이드

#### 1. **새로운 기능 추가 시**
1. Domain에서 인터페이스 정의
2. Application에서 유스케이스 구현
3. Infrastructure에서 구현체 작성
4. Composition에서 의존성 등록
5. Presentation에서 Facade 통해 사용

#### 2. **외부 라이브러리 변경 시**
1. Infrastructure 레이어의 어댑터만 수정
2. 도메인 인터페이스는 변경하지 않음
3. 비즈니스 로직에 영향 없음

#### 3. **테스트 작성 시**
1. 도메인과 애플리케이션 레이어는 단위 테스트
2. 인프라스트럭처는 통합 테스트
3. 의존성 주입을 활용한 모킹

---

## 🔍 추가 리소스

- [클린 아키텍처 개선사항](./README_CLEAN_ARCHITECTURE_IMPROVEMENTS.md)
- [감정 아키텍처 가이드](./README_EMOTION_ARCHITECTURE.md)
- [개발 환경 설정](./README.md)

---

## 📞 문의사항

아키텍처 관련 질문이나 개선 제안이 있으시면 언제든 문의해 주세요.

**🎯 이 아키텍처는 확장 가능하고 유지보수가 용이한 프론트엔드 애플리케이션을 구축하기 위한 견고한 기반을 제공합니다.** 