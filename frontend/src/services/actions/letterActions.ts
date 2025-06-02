'use server';

interface MockLetterResponse {
  mockLetter: string;
  letterTitle: string;
  letterContent: string;
  realLetterId: string;
  success: boolean;
  error?: string;
}

interface FeedbackResponse {
  feedback: string;
  highlightedParts: string[];
  success: boolean;
  error?: string;
}

interface StructuredFeedbackResponse {
  feedbackSections: {
    emotionConnection?: string;
    empathyReflection?: string[];
    improvementSuggestion?: string[];
    overallComment?: string;
  };
  success: boolean;
  error?: string;
}

/**
 * 감정 데이터를 기반으로 모의 편지 생성
 */
export async function generateMockLetter(emotionContext: {
  category: string;
  emotion: string;
  answers: { [stage: string]: string };
}): Promise<MockLetterResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    // 감정 컨텍스트를 기반으로 시나리오 구성
    const answersText = Object.entries(emotionContext.answers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `당신은 감정에 섬세하게 공감하고 글을 잘 쓰는 편지 작가입니다.
            아래 사용자가 경험한 감정, 상황, 속마음을 바탕으로 비슷한 상황에 놓인 사람의 고민을 담은 편지를 생성해주세요.

            [작성 지침]
            - 편지는 누군가가 무지님에게 보내는 형식입니다.
            - 사용자의 경험 중 긍정적인 요소(예: 기쁨, 성취감 등)가 있더라도, 그 경험과 연관된 고민(예: 불안, 진로 고민, 관계 고민 등)을 포함한 새로운 사연 편지를 작성해주세요.
            - 예를 들어: "멘토와의 대화 속 뿌듯함" → "진로 방향에 대한 불안과 고민"으로 연결
            - 편지 제목과 본문을 반드시 JSON 배열 형식으로 출력하세요.
              - 배열의 첫 번째 요소(인덱스 0)는 제목이어야 하며, “제목: ”이라는 접두어 없이 제목만 작성해주세요.
              - 배열의 두 번째 요소(인덱스 1)는 편지 본문이어야 하며, “내용: ”이라는 접두어 없이 작성해주세요.
            - 본문은 5~6문장 정도의 길이로 자연스럽고 공감 가는 흐름을 가지도록 작성하고, 1인칭 시점(저는 ~해요)으로 작성합니다.
            - 사용자의 경험에서 완전히 벗어나지 않되, 직접적인 복붙이 아닌 비슷한 맥락의 다른 고민처럼 보이도록 변형해서 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시1]
            [
              "자기 계발과 끝없는 업무 속에서, 버텨내는 매일이 너무 힘겹게 느껴져요",
              "무지님, 안녕하세요. 저는 요즘 정말 힘든 시간을 보내고 있습니다. 직장에서는 업무가 끊임없이 늘어나고, 퇴근 후에도 자기 계발을 위한 공부를 해야 하는데 시간이 턱없이 부족해 매일 스트레스로 가득한 나날을 보내고 있어요. 이런 상황에서 어떻게 하면 좋을까요? 무지님은 제 마음을 헤아려주실 수 있을 것 같아요."
            ]
              
            [예시2]
            [
              "진로 고민과 앞이 보이지 않는 불안함",
              "무지님, 안녕하세요. 저는 요즘 진로에 대한 고민으로 마음이 무거워요. 멘토와의 대화에서 잠시 뿌듯함을 느꼈지만, 여전히 제 길이 맞는지, 잘하고 있는지 걱정이 되곤 해요. 노력하고 있지만 계속 불안함이 가시지 않아 마음이 복잡해요. 이런 마음, 무지님이라면 어떻게 풀어가실까요?"
            ]`,
          },
          {
            role: 'user',
            content: `누군가가 오늘 가장 인상깊었던 일에 대해 설명했어요.
아래는 사용자가 자기 감정을 탐색하면서 작성한 입력이에요:

사용자의 감정 정보:
카테고리: ${emotionContext.category}
감정: ${emotionContext.emotion}

사용자의 답변들:
${answersText}

사용자가 경험한 감정, 상황, 속마음을 바탕으로 **비슷한 상황에 놓인 사람의 고민을 담은 편지**를 생성해주세요.
`,
          },
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    // JSON 배열 형식으로 파싱 (제목과 본문)
    let mockLetter = '';
    let letterTitle = '';
    let letterContent = '';
    
    try {
      const result = JSON.parse(content);
      if (Array.isArray(result) && result.length >= 2) {
        letterTitle = result[0];
        letterContent = result[1];
        // 제목과 본문을 합쳐서 하나의 편지로 구성 (기존 호환성 유지)
        mockLetter = `제목: ${result[0]}\n${result[1]}`;
      } else {
        mockLetter = content; // 파싱 실패 시 원본 내용 사용
        letterTitle = '익명의 편지';
        letterContent = content;
      }
    } catch {
      mockLetter = content; // 파싱 실패 시 원본 내용 사용
      letterTitle = '익명의 편지';
      letterContent = content;
    }

    // 임시 realLetterId 생성 (추후 실제 편지 매칭 시스템으로 교체)
    const realLetterId = `letter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      mockLetter,
      letterTitle,
      letterContent,
      realLetterId,
      success: true,
    };
  } catch (error) {
    console.error('모의 편지 생성 실패:', error);
    return {
      mockLetter: '',
      letterTitle: '',
      letterContent: '',
      realLetterId: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 사용자 답장에 대한 AI 피드백 생성
 */
export async function generateFeedback(
  mockLetter: string,
  userResponse: string,
  emotionContext: {
    category: string;
    emotion: string;
    answers: { [stage: string]: string };
  }
): Promise<FeedbackResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 공감적 소통 전문가입니다. 사용자가 작성한 편지 답장을 분석하고, 건설적인 피드백을 제공해주세요.

피드백 가이드라인:
1. 긍정적인 부분을 먼저 인정하고 격려
2. 개선할 수 있는 부분을 부드럽게 제안
3. 구체적인 예시나 대안 제시
4. 공감적 소통의 원칙에 따른 조언
5. 따뜻하고 격려하는 톤 유지

피드백 구조:
- 잘한 점 인정 (2-3문장)
- 개선점 제안 (2-3문장)  
- 구체적 대안이나 예시 (2-3문장)
- 격려와 마무리 (1-2문장)

공감적 소통 원칙:
- 감정 인정하기
- 판단보다는 이해하기
- 경청의 자세
- 진솔한 공유
- 희망과 격려 전하기

응답은 반드시 다음 JSON 형식으로 작성해주세요:
{
  "feedback": "피드백 내용",
  "highlightedParts": ["강조할 부분1", "강조할 부분2"]
}`,
          },
          {
            role: 'user',
            content: `원본 편지:
"${mockLetter}"

사용자의 답장:
"${userResponse}"

사용자의 감정 컨텍스트:
- 카테고리: ${emotionContext.category}
- 감정: ${emotionContext.emotion}

이 답장에 대한 건설적이고 따뜻한 피드백을 JSON 형식으로 제공해주세요.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    try {
      // 마크다운 코드 블록 제거 (```json ... ``` 형태)
      const cleanContent = content
        .replace(/^```json\s*/, '') // 시작 부분의 ```json 제거
        .replace(/\s*```$/, '') // 끝 부분의 ``` 제거
        .trim();

      const result = JSON.parse(cleanContent);

      if (!result.feedback || !Array.isArray(result.highlightedParts)) {
        throw new Error('응답 형식이 올바르지 않습니다.');
      }

      return {
        feedback: result.feedback,
        highlightedParts: result.highlightedParts,
        success: true,
      };
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      throw new Error('응답 파싱 실패: ' + content);
    }
  } catch (error) {
    console.error('피드백 생성 실패:', error);
    return {
      feedback:
        '피드백을 생성하는 중 오류가 발생했습니다. 따뜻한 마음으로 작성해주신 편지 감사합니다.',
      highlightedParts: [],
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 4개 영역의 구조화된 피드백 생성
 */
export async function generateStructuredFeedback(
  mockLetter: string,
  userResponse: string,
  emotionContext: {
    category: string;
    emotion: string;
    answers: { [stage: string]: string };
  }
): Promise<StructuredFeedbackResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    // 감정 답변들을 문자열로 변환
    const answersText = Object.entries(emotionContext.answers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

    // 4개 영역의 피드백을 병렬로 생성
    const [
      emotionConnectionResult,
      empathyReflectionResult,
      improvementSuggestionResult,
      overallCommentResult,
    ] = await Promise.all([
      // 1. 감정 연결 피드백
      generateEmotionConnection(apiKey, mockLetter, userResponse, emotionContext, answersText),
      // 2. 공감 문장 반영
      generateEmpathyReflection(apiKey, mockLetter, userResponse, emotionContext, answersText),
      // 3. 개선 제안
      generateImprovementSuggestion(apiKey, mockLetter, userResponse, emotionContext, answersText),
      // 4. 전체 코멘트
      generateOverallComment(apiKey, mockLetter, userResponse, emotionContext, answersText),
    ]);

    return {
      feedbackSections: {
        emotionConnection: emotionConnectionResult,
        empathyReflection: empathyReflectionResult,
        improvementSuggestion: improvementSuggestionResult,
        overallComment: overallCommentResult,
      },
      success: true,
    };
  } catch (error) {
    console.error('구조화된 피드백 생성 실패:', error);
    return {
      feedbackSections: {},
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

// 1. 감정 연결 피드백 생성
async function generateEmotionConnection(
  apiKey: string,
  mockLetter: string,
  userResponse: string,
  emotionContext: { category: string; emotion: string; answers: { [stage: string]: string } },
  answersText: string
): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 사람들의 감정을 섬세하게 연결하는 감정 코멘터입니다.           
아래 사용자의 자기공감 기록과, 사연자에게 보낸 편지를 바탕으로 두 사람의 감정이 어떻게 연결되는지를 설명해주세요.
    
[작성 지침]
- 무지님이 자기공감에서 어떤 감정을 느꼈는지를 언급해주세요.
- 사연자와 무지님의 감정이나 경험이 어떤 공통점이 있는지를 자연스럽게 서술해주세요.
- 마지막 문장은 두 사람이 가진 공통된 정서나 마음을 한 문장으로 따뜻하게 정리해주세요.
- 총 2~3문장, 너무 길지 않고 부드럽고 섬세한 말투로 작성해주세요.    

[예시 1]
무지님이 자기공감에서 "시간에 쫓겨서 짜증이 났다"고 말해주셨어요. 사연자도 해야할 일을 버텨내며 스스로 계속 몰아세우고 있었는지 몰라요. 그 짜증과 지침의 바닥엔, 무지님이 너무 열심히 버텨왔다는 흔적이 있었을지도요    

[예시 2]
무지님이 자기공감에서 친한 친구에게 가장 편한 존재라는 생각이 들었을 때 뿌듯함을 느꼈다고 말해주셨죠. 사연자도 이전에는 좋지 않았던 교우관계가 점점 더 발전해나가며 스스로 뿌듯함을 느낌과 동시에 진짜 잘하고 있는게 맞나 의심이 들고 있는 것 같아요. 그 뿌듯함과 혹은 의심 이면에는, 두 분 모두 더 좋은 사람이 되고싶은 예쁜 마음이 있었을지도 몰라요.`,
          },
          {
            role: 'user',
            content: `[자기공감 답변들]
${answersText}

[사연편지]
${mockLetter}

[사용자가 사연편지에 대해 작성한 답변 편지]
${userResponse}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('감정 연결 피드백 생성 실패:', error);
    return undefined;
  }
}

// 2. 공감 문장 반영 생성
async function generateEmpathyReflection(
  apiKey: string,
  mockLetter: string,
  userResponse: string,
  emotionContext: { category: string; emotion: string; answers: { [stage: string]: string } },
  answersText: string
): Promise<string[] | undefined> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 사람들의 따뜻한 말을 기억하고 되돌려주는 공감의 메신저입니다.
무지님이 다른 사람에게 써준 편지 속에서 진심이 담긴 공감의 문장을 찾아, 이번에는 그 말을 무지님에게도 다시 들려주세요.
            
[작성 지침]
- 사용자가 사연자에게 써준 편지 중, 진심이 담긴 따뜻한 공감 문장을 한 줄 추출하세요.
- 해당 문장을 JSON 배열의 첫 번째 요소로 출력합니다. 반드시 큰따옴표 없이 문장만 작성하세요.
- 두 번째 요소에는, 그 말을 이번에는 사용자 자신에게 들려주는 따뜻한 위로 문장을 작성하세요. 이때, "이번에는 그 말을 자신에게도 들려주세요"라는 말을 꼭 넣어주세요.
- 말투는 부드럽고 다정하게, 길이는 2~3문장 정도로 해주세요.
- 전체 응답은 JSON 배열 형식으로 출력합니다. 예시는 다음과 같아요:
   
[예시 1]
[
    "조금 쉬어도 괜찮아요",
    "무지님과 비슷한 마음을 지닌 누군가에게 무지님이 조심스레 건넨 이 한마디처럼, 이번엔 그 말을 자신에게도 들려주세요. "조금 쉬어도 괜찮아요." 무지님은 정말, 여기까지 열심히 잘 걸어오셨어요."
]
    
[예시 2]
[
  "당신은 참 좋은 사람이에요",
  "비슷한 마음을 지닌 누군가에게 무지님이 건넨 따듯한 한마디처럼, 이번에는 그 말을 자신에게도 들려주세요. "당신은 참 좋은 사람이에요." 언제나 타인에게 의지가 되는 사람으로 올바르게 서 가는 당신은, 그 자체로도 충분하고 가치있는 사람이에요."
]`,
          },
          {
            role: 'user',
            content: `아래는 사용자의 자기공감 기록과, 사연자에게 써준 답장 편지입니다.
이 중에서 사연자에게 해준 따뜻한 공감 문장을 하나 골라주세요. 그리고 그 말을 무지님 자신에게도 건네주세요.

[자기공감 답변들]
${answersText}

[사연편지]
${mockLetter}

[사용자가 사연편지에 대해 작성한 답변 편지]
${userResponse}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    try {
      const result = JSON.parse(content);
      if (Array.isArray(result) && result.length >= 2) {
        return result;
      }
    } catch (error) {
      console.error('공감 문장 반영 JSON 파싱 실패:', error);
    }

    return undefined;
  } catch (error) {
    console.error('공감 문장 반영 생성 실패:', error);
    return undefined;
  }
}

// 3. 개선 제안 생성
async function generateImprovementSuggestion(
  apiKey: string,
  mockLetter: string,
  userResponse: string,
  emotionContext: { category: string; emotion: string; answers: { [stage: string]: string } },
  answersText: string
): Promise<string[] | undefined> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 감정 중심 피드백을 도와주는 따뜻한 조언자입니다.
            
아래 사용자의 자기공감 기록과, 사연자에게 보낸 답변 편지를 읽고,
혹시 공감이 충분하지 않았더라도, 더 감정 중심의 문장으로 바꿀 수 있도록 무조건 피드백을 생성해주세요.
            
[작성 지침]
- 피드백은 반드시 JSON 배열 형식으로 출력합니다.
- 배열 [0]번에는 요약 피드백 제목을 1문장으로 담아주세요. 예: "칭찬의 공감도 공감이에요!"
- 배열 [1]번에는 상세 피드백을 담되, 사용자의 문장을 감정 중심으로 어떻게 바꾸면 좋을지 구체적인 조언을 주세요.
- 해결책, 조언, 분석 중심의 문장을 '감정 공감형 표현'으로 바꿔주는 방향의 제안을 포함해주세요.
- 사용자의 표현이 이미 공감 중심이어도, 그 표현을 더 살릴 수 있는 조언을 추가해주세요.
- 문장은 부드럽고 친절한 말투로, 책임을 묻거나 강요하지 않게 써주세요.
- 출력은 반드시 아래 JSON 배열 형식이어야 합니다.
    
[예시 1]
[
  "사연자의 감정을 먼저 헤아려 보아요",
  ""누구나 겪는 일이에요"처럼 들릴 수 있는 말보다는 "그 상황, 정말 버거우셨겠어요"처럼 사연자의 감정을 먼저 인정하는 말이 더 오래 기억에 남을 거에요."
]

[예시 2]
[
    "칭찬의 공감도 공감이에요!",    
    ""더 고민하려면~해보세요"처럼 더 발전시킬 수 있는 방법을 제시하는 것도 너무 좋지만, 사연자의 모습을 있는 그대로 칭찬하며 공감한다면, 사연자는 무지님의 말에 더 큰 용기를 얻을 것 같아요."
]

[예시 3]
[
  "이미 좋은 말이에요, 더 따뜻하게 확장해보면 어때요?",
  ""지금도 충분히 잘하고 있어요"라는 말에 공감이 담겨 있었어요. 여기에 사연자의 감정을 더 구체적으로 짚어주면, 위로가 더 잘 전달될 거예요. 예를 들어, '그만큼 애써온 시간이 있었기에 흔들릴 수도 있죠' 같은 말이요."
]`,
          },
          {
            role: 'user',
            content: `[자기공감 답변들]
${answersText}

[사연편지]
${mockLetter}

[사용자가 사연편지에 대해 작성한 답변 편지]
${userResponse}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    try {
      const result = JSON.parse(content);
      if (Array.isArray(result) && result.length >= 2) {
        return result;
      }
    } catch (error) {
      console.error('개선 제안 JSON 파싱 실패:', error);
    }

    return undefined;
  } catch (error) {
    console.error('개선 제안 생성 실패:', error);
    return undefined;
  }
}

// 4. 전체 코멘트 생성
async function generateOverallComment(
  apiKey: string,
  mockLetter: string,
  userResponse: string,
  emotionContext: { category: string; emotion: string; answers: { [stage: string]: string } },
  answersText: string
): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 누군가의 다정한 편지에 섬세하고 따뜻한 피드백을 건네는 공감 코멘터입니다.
            
아래 사용자의 자기공감 기록과, 사연자에게 쓴 답장 편지를 보고, 그 편지가 전반적으로 어떤 느낌이었는지 따뜻한 말 한 문장으로 정리해 주세요.
            
[작성 지침]
- 말투는 다정하고 섬세하게, 칭찬 혹은 감정 공감이 담기도록 작성해주세요.
- 문장은 반드시 1문장으로만 작성해주세요.
- 지나친 분석 없이 느낌 위주로, 따뜻하고 감성적인 표현을 사용해주세요.
- 문장 끝을 "말이었어요"처럼 부드럽게 마무리해주세요.
- 사람 이름이나 호칭 등 지칭어(예: 무지님, 당신 등)는 사용하지 마세요.
- 아래 예시와 같은 형식을 따라주세요.
    
[예시 1]
따뜻했고, 다정했고, 무엇보다 스스로에게도 다시 돌아올 수 있는 말이었어요.

[예시 2]    
따뜻했고, 평안했으며, 스스로의 경험을 투영해서 더 진심어렸어요.`,
          },
          {
            role: 'user',
            content: `[자기공감 답변들]
${answersText}

[사연편지]
${mockLetter}

[사용자가 사연편지에 대해 작성한 답변 편지]
${userResponse}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('전체 코멘트 생성 실패:', error);
    return undefined;
  }
}
