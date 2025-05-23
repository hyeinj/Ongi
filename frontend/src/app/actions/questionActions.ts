'use server';

interface QuestionResponse {
  question: string;
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

            1. 첫 문장: 사용자가 선택한 감정들 중 하나 이상을 반영하여 담백하게 공감하는 문장
            2. 두 번째 문장: 선택한 감정들 중 하나를 기반으로, 그 감정이 왜 들었는지를 자연스럽게 탐색하는 질문

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 두 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다`,
          },
          {
            role: 'user',
            content: `누군가가 오늘 가장 귀찮았던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step2 답변 - 귀찮았던 일]  
            ${step2Answer}

            [Step3 답변 - 상황 설명]  
            ${step3Answer}

            [Step4 선택한 감정들]  
            ${step4Feelings.join(', ')}

            위의 내용을 바탕으로, 공감을 표현하고 감정의 이유를 탐색하는 질문을 두 문장 이내로 생성해주세요.`,
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
            content: `사용자의 이전 답변들:\n${answersText}${feelingsText}\n\n이를 바탕으로 사용자의 감정과 상황을 더 깊이 이해할 수 있는 다음 질문을 하나 생성해주세요.`,
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
      const result = JSON.parse(content);

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
