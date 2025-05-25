'use server';

interface QuestionResponse {
  question: string;
  success: boolean;
  error?: string;
}

interface FinalTextResponse {
  finalText: string;
  success: boolean;
  error?: string;
}

interface Step6TextResponse {
  smallText: string;
  largeText: string;
  options: string[];
  success: boolean;
  error?: string;
}

/**
 * Step2 답변을 기반으로 Step3 질문 생성
 */
export async function generateStep3Question(answer: string): Promise<QuestionResponse> {
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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 답변에 대해 공감하고 감정을 이해하는 응답을 생성해주세요.
            응답은 반드시 한 문장으로 작성하며, "~셨군요"로 끝나야 합니다.
            또한, 따옴표(")는 사용하지 마세요.`,
          },
          {
            role: 'user',
            content: `다음 입력은 "오늘 가장 귀찮게 느껴졌던 건 무엇이었나요?"라는 질문에 대한 사용자의 답변입니다.
            이에 대해 공감하고 감정을 이해하는 응답 문장을 생성해주세요.

            응답은 반드시 **한 문장**으로 작성하고, "기호(따옴표)"는 사용하지 마세요.
            응답 문장은 아래의 패턴을 따르세요:

            - 입력 내용을 요약한 후, 감정에 공감하는 문장을 만들어주세요.
            - 문장은 "~셨군요"로 끝나야 합니다.

            예시:
            입력: 논문작성  
            출력: 논문 작성할 때 귀찮음을 느끼셨군요

            입력: 아침에 옷 고르는게 힘들었어요  
            출력: 아침에 옷을 고르는 일이 힘드셨군요

            입력: 회의가 너무 길어서 지쳤어요  
            출력: 긴 회의로 인해 지치셨군요

            아래 입력에 대해 응답 문장 하나를 생성해주세요:
            ${answer}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices[0]?.message?.content?.trim() || '';

    return {
      question,
      success: true,
    };
  } catch (error) {
    console.error('Step3 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * Step2, Step3 답변을 기반으로 Step4 질문 생성
 */
export async function generateStep4Question(
  step2Answer: string,
  step3Answer: string
): Promise<QuestionResponse> {
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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 답변을 바탕으로 과장되지 않고 담백하게 공감을 표현하는 문장을 **두 문장 이내로** 생성해주세요.
            모든 문장은 반드시 정중한 말투(~요)로 끝나야 합니다.
            감정에 적절히 따뜻하게 공감하되, 지나치게 위로나 감정적 표현은 피해주세요.`,
          },
          {
            role: 'user',
            content: `누군가가 오늘 가장 귀찮았던 일에 대해 설명했습니다.
            아래는 사용자가 자신의 상황을 설명한 내용입니다:

            [Step2 답변 - 상황]  
            ${step2Answer}

            [Step3 답변 - 구체적인 상황]  
            ${step3Answer}

            예시:
            귀찮은 것을 마주했을때, 무지님의 마음이 많이 복잡했을 것 같아요.
            짜증남의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?

            위의 내용을 바탕으로, 담백하게 공감하는 문장을 두 문장 이내로 생성해주세요.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices[0]?.message?.content?.trim() || '';

    return {
      question,
      success: true,
    };
  } catch (error) {
    console.error('Step4 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * Step2-Step4 답변과 감정을 기반으로 Step5 질문 생성
 */
export async function generateStep5Question(
  step2Answer: string,
  step3Answer: string,
  step4Feelings: string[]
): Promise<QuestionResponse> {
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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 상황 설명과 선택한 감정을 바탕으로 다음과 같은 형식으로 응답해주세요:

            1. 첫 문장: 사용자가 선택한 감정들 중 하나 이상을 반영하여 사용자의 상황과 감정을 부드럽게 공감하는 문장
            2. 두 번째 문장: 선택한 감정들 중 하나를 기반으로, 그 감정에 대해 더 깊이 탐색해볼 수 있는 질문

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하고 공감 어린 말투로 작성해주세요
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 두 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다
            
            [예시 1]
            귀찮은 것을 마주했을때, 무지님의 마음이 많이 복잡했을 것 같아요.
            짜증남의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?
            
            [예시 2]
            친구와 더 깊은 이야기를 나누고싶은 상황들 속에서, 무지님의 마음이 많이 설렜을 것 같아요.
            설레고, 뿌듯함을 느꼈던 무지님의 속 마음이 궁금해요. 그 말과 상황속의 어떤 것이 가장 설레고, 뿌듯함을 느끼게 했나요?
            
            [예시 3]
            누군가에게 평가를 받는다는 것은, 굉장히 긴장되고 떨리는 일인 것 같아요.
            무서운 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?`,
          },
          {
            role: 'user',
            content: `누군가가 오늘 가장 귀찮았던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step2 답변 - 귀찮았던 일]  
            ${step2Answer}

            [Step3 답변 - 상황 설명]  
            ${step3Answer}

            [Step4 - 선택했던 감정이 들었던 자세한 속 마음]  
            ${step4Feelings.join(', ')}

            예시:
            스스로 준비를 미리 해두지 않은 자신에게 답답하고 화가 나셨군요.
            무지님이 답답함과 짜증, 초조함을 느꼈던 이유 중 가장 큰 이유는 무엇인가요?
            "나 스스로 준비되지 않았다는 생각이 많이 들었기 때문"
            "팀장님이 나의 실력을 제대로 믿어주시지 않는다는 생각이 들었기 때문"
            "프로젝트가 중요한데 망치기 싫다는 생각이 많이 들었기 때문"

            위의 내용을 바탕으로, 공감을 표현하고 거기서 짜증남이 있었는지 탐색하는 질문을 두 문장 이내로 생성해주세요.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices[0]?.message?.content?.trim() || '';

    return {
      question,
      success: true,
    };
  } catch (error) {
    console.error('Step5 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 모든 이전 답변을 기반으로 다음 질문 생성
 */
export async function generateNextQuestion(
  previousAnswers: { [stage: string]: string },
  feelings?: string[]
): Promise<QuestionResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const answersText = Object.entries(previousAnswers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

    const feelingsText = feelings && feelings.length > 0 ? `\n감정: ${feelings.join(', ')}` : '';

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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 답변을 바탕으로 과장되지 않고 담백하게 공감을 표현하는 문장을 **두 문장 이내로** 생성해주세요.
            모든 문장은 반드시 정중한 말투(~요)로 끝나야 합니다.
            감정에 적절히 따뜻하게 공감하되, 지나치게 위로나 감정적 표현은 피해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 이전 답변들:\n${answersText}${feelingsText}

            예시:
            충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?

            위의 내용을 바탕으로,
            사용자가 느낀 감정에 공감하고,
            그 감정의 진짜 이유나 의미를 되짚어보게 하는 질문을 한 문장으로 생성해주세요.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices[0]?.message?.content?.trim() || '';

    return {
      question,
      success: true,
    };
  } catch (error) {
    console.error('다음 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

interface EmotionAnalysisResponse {
  category: 'self' | 'growth' | 'routine' | 'relationship';
  emotion: 'joy' | 'sadness' | 'anger' | 'anxiety' | 'peace';
  success: boolean;
  error?: string;
}

/**
 * 모든 답변을 분석하여 사용자의 오늘 기분을 가장 잘 나타내는 category와 emotion을 결정
 */
export async function analyzeEmotionAndCategory(allAnswers: {
  [stage: string]: string;
}): Promise<EmotionAnalysisResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const answersText = Object.entries(allAnswers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

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
            content: `당신은 감정 분석 전문가입니다. 사용자의 모든 답변을 종합 분석하여 오늘 하루의 주요 감정과 카테고리를 결정해주세요.

카테고리 옵션:
- self: 자기 자신과 관련된 감정 (자아, 자존감, 개인적 고민)
- growth: 성장과 발전과 관련된 감정 (학습, 도전, 개선)
- routine: 일상과 루틴과 관련된 감정 (습관, 반복, 생활패턴)
- relationship: 인간관계와 관련된 감정 (가족, 친구, 동료, 연인)

감정 옵션:
- joy: 기쁨, 행복, 만족감
- sadness: 슬픔, 우울, 허무함
- anger: 분노, 짜증, 불만
- anxiety: 불안, 걱정, 초조함
- peace: 평온, 차분함, 안정감

응답 형식: {"category": "선택한카테고리", "emotion": "선택한감정"}
JSON 형식으로만 응답해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 모든 답변을 분석해주세요:\n\n${answersText}\n\n이 답변들을 종합해서 사용자의 오늘 하루를 가장 잘 나타내는 카테고리와 감정을 JSON 형식으로 응답해주세요.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    try {
      // 마크다운 코드블록 제거
      let cleanContent = content;
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      const result = JSON.parse(cleanContent.trim());

      // 유효성 검사
      const validCategories = ['self', 'growth', 'routine', 'relationship'];
      const validEmotions = ['joy', 'sadness', 'anger', 'anxiety', 'peace'];

      if (!validCategories.includes(result.category) || !validEmotions.includes(result.emotion)) {
        throw new Error('유효하지 않은 카테고리 또는 감정입니다.');
      }

      return {
        category: result.category,
        emotion: result.emotion,
        success: true,
      };
    } catch {
      throw new Error('응답 파싱 실패: ' + content);
    }
  } catch (error) {
    console.error('감정 분석 실패:', error);
    return {
      category: 'self', // 기본값
      emotion: 'peace', // 기본값
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 모든 답변과 분석된 감정을 기반으로 최종 카드 텍스트 생성
 */
export async function generateFinalCardText(
  allAnswers: { [stage: string]: string },
  category: 'self' | 'growth' | 'routine' | 'relationship',
  emotion: 'joy' | 'sadness' | 'anger' | 'anxiety' | 'peace'
): Promise<FinalTextResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const answersText = Object.entries(allAnswers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

    // 카테고리와 감정에 따른 맥락 정보
    const categoryContext = {
      self: '자기 자신과의 관계',
      growth: '성장과 발전',
      routine: '일상과 루틴',
      relationship: '인간관계',
    };

    const emotionContext = {
      joy: '기쁨과 만족감',
      sadness: '슬픔과 아쉬움',
      anger: '분노와 불만',
      anxiety: '불안과 걱정',
      peace: '평온과 안정감',
    };

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
            content: `당신은 공감적이고 따뜻한 감정 코치입니다. 사용자의 하루 감정 여정을 되돌아보며, 그들의 감정 속에 담긴 의미와 가치를 발견하도록 도와주세요.

다음과 같은 구조로 텍스트를 작성해주세요:
1. 사용자가 오늘 어떤 상황에서 어떤 감정을 느꼈는지 요약 (2문장)
2. 그 감정이 어떤 내면의 기준이나 가치에서 비롯되었는지 해석 (1-2문장)
3. 이 과정을 통해 사용자가 자신을 더 이해하게 되었다는 격려 (2문장)

전체적으로 7-8문장 내외로 작성하고, 정중한 말투(~요)로 끝내주세요.
과도한 감정적 표현보다는 차분하고 따뜻한 공감을 표현해주세요.
사용자의 실제 답변 내용을 구체적으로 반영해서 작성해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 답변들:
${answersText}

분석된 카테고리: ${category} (${categoryContext[category]})
분석된 감정: ${emotion} (${emotionContext[emotion]})

이 정보를 바탕으로 사용자의 하루 감정 여정을 되돌아보는 따뜻한 메시지를 작성해주세요.`,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const finalText = data.choices[0]?.message?.content?.trim() || '';

    return {
      finalText,
      success: true,
    };
  } catch (error) {
    console.error('최종 카드 텍스트 생성 실패:', error);
    return {
      finalText: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * Step2-Step5 답변을 기반으로 Step6의 smallText와 largeText, 그리고 선택지들 생성
 */
export async function generateStep6Texts(allAnswers: {
  [stage: string]: string;
}): Promise<Step6TextResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const answersText = Object.entries(allAnswers)
      .map(([stage, answer]) => `${stage}: ${answer}`)
      .join('\n');

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
            content: `당신은 감정 분석과 공감에 능숙한 상담사입니다. 사용자의 답변을 바탕으로 세 가지 텍스트를 생성해주세요:

1. smallText: 사용자의 상황과 감정에 대한 담백한 공감 메시지 (1문장, ~셨군요로 끝남)
2. largeText: 감정의 핵심 원인을 추론하고 확인하는 질문 (2문장 내외, 정중한 말투)
3. options: 감정의 가능한 원인들을 3개의 선택지로 제시 (각각 따옴표로 감싸진 문장, ~때문으로 끝남)

largeText는 다음 패턴을 따라주세요:
"무지님이 [감정들]을 느꼈던 이유 중 가장 큰 이유는 무엇인가요?"

options는 사용자의 답변을 분석하여 감정의 가능한 원인 3가지를 제시해주세요.

응답 형식:
{
  "smallText": "생성된 공감 메시지",
  "largeText": "생성된 확인 질문",
  "options": [
    "첫 번째 가능한 원인",
    "두 번째 가능한 원인", 
    "세 번째 가능한 원인"
  ]
}

JSON 형식으로만 응답해주세요.`,
          },
          {
            role: 'user',
            content: `

${answersText}

위 답변들을 바탕으로 사용자의 감정과 상황에 공감하는 smallText와, 감정의 핵심 원인을 묻는 largeText, 그리고 가능한 원인들을 3개의 선택지로 제시하는 options를 JSON 형식으로 생성해주세요.

예시:
smallText: 스스로 준비를 미리 해두지 않은 자신에게 답답하고 화가 나셨군요.
largeText: 무지님이 답답함과 짜증, 초조함을 느꼈던 이유 중 가장 큰 이유는 무엇인가요?
options: [
  "나 스스로 준비되지 않았다는 생각이 많이 들었기 때문",
  "팀장님이 나의 실력을 제대로 믿어주시지 않는다는 생각이 들었기 때문",
  "프로젝트가 중요한데 망치기 싫다는 생각이 많이 들었기 때문"
]`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    try {
      // 마크다운 코드블록 제거
      let cleanContent = content;
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      const result = JSON.parse(cleanContent.trim());

      if (
        !result.smallText ||
        !result.largeText ||
        !result.options ||
        !Array.isArray(result.options)
      ) {
        throw new Error('필수 텍스트가 생성되지 않았습니다.');
      }

      return {
        smallText: result.smallText,
        largeText: result.largeText,
        options: result.options,
        success: true,
      };
    } catch {
      throw new Error('응답 파싱 실패: ' + content);
    }
  } catch (error) {
    console.error('Step6 텍스트 생성 실패:', error);
    return {
      smallText: '힘든 상황에서 여러 감정을 느끼셨군요.',
      largeText: '그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?',
      options: [
        '상황이 예상과 달랐기 때문',
        '준비가 부족했다고 느꼈기 때문',
        '다른 사람의 반응이 걱정되었기 때문',
      ],
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * Step1-Step4 답변을 기반으로 Step7 질문 생성
 */
export async function generateStep7Question(allAnswers: {
  [stage: string]: string;
}): Promise<QuestionResponse> {
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
            content: `당신은 공감 능력이 뛰어난 상담사이며, 사용자가 자기 감정을 탐색하는 과정을 따뜻하고 진정성 있게 정리하는 글을 작성합니다.
            아래 사용자 입력을 바탕으로 아래 형식에 맞추어 한 편의 자기공감 메시지를 작성해주세요:
                        
            [구성]
            1. 오늘 사용자가 어떤 상황에서 어떤 감정을 느꼈고, 왜 그런 감정을 느꼈는지 요약해줍니다.
            2. 사용자가 그 감정을 따라가며 그 진짜 이유를 어떻게 바라보았는지, 앞으로 비슷한 상황이 다가왔을 때의 응원의 말을 제시해줍니다.
            3. 마지막으로 오늘의 자기공감 경험이 사용자에게 어떤 의미였는지를 따뜻한 말투로 정리하며 격려의 말을 건네주세요.
                        
            [작성 지침]
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요.
            - 전체 문장은 3문단으로 구성해주세요.
            - "무지님은 오늘..."으로 시작하며, 마지막 문장은 "오늘 무지님은, ~ 하고 있어요"로 마무리해주세요.
            - 선택된 감정 단어를 반드시 자연스럽게 포함시켜 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시1]
            무지님은 오늘 옷을 고르는 평범한 상황 속에서 답답함과 짜증이라는 감정을 느꼈어요. 그 감정은 단순한 불편함이 아니라 ‘시간을 효율적으로 써야 한다’는 내면의 기준에서 비롯된 것이었죠
                        
            그 짜증을 따라가며 무지님은 왜 그런 감정이 들었는지, 무엇을 기대하고 있었는지를 상황의 맥락과 자신의 가치 기준과 연결해 바라보았어요. 앞으로 비슷한 순간에, 자신을 덜 다그치고 더 부드럽게 조율할 수 있는 실마리가 될 거에요.
                        
            오늘 무지님은, 짜증이라는 감정 속에서, 스스로를 더 다정하게 대하는 방법을 찾고 있어요.
                        
            [예시 2]
            무지님은 오늘 친구와의 대화 속에서 함께 있으면 마음이 편해진다는 친구의 말에 뿌듯함과 설렘의 감정을 느꼈어요. 그 감정은 단순히 말에서 오는 설렘이 아닌, 친구에게 다가가기 어려웠던 과거의 무지님을 극복했다는 내면의 성장에서 비롯된 것이었죠.
                        
            뿌듯함의 감정을 따라가며 무지님은 “왜 그런 감정이 들었는지”, “그 감정이 느끼게 된 과거의 다른 사건들이 무엇인지”를 상황의 맥락과 자신의 과거 경험을 연결해서 바라보았어요.
            앞으로 수많은 극복의 순간들 속에서, 이 경험은 더 큰 뿌듯함을 불러올 수 있을 것이라 확신해요
                        
            오늘의 무지님은, 뿌듯함의 감정 속에서 본인의 힘듦을 극복하며 한단계 더 성장했어요.`,
          },
          {
            role: 'user',
            content: `누군가가 오늘 가장 귀찮았던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step1 답변 - 귀찮았던 일]
            ${allAnswers.step2 || ''}

            [Step2 답변 - 구체적인 상황 설명]  
            ${allAnswers.step3 || ''}

            [Step3 선택한 감정들]  
            ${allAnswers.step4 || ''}
            
            [Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            ${allAnswers.step5 || ''}

            이 내용을 바탕으로, 위 지침에 맞는 따뜻한 자기공감 메시지를 생성해주세요.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices[0]?.message?.content?.trim() || '';

    return {
      question,
      success: true,
    };
  } catch (error) {
    console.error('Step7 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
