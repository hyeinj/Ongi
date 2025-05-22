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
            content:
              '당신은 감정 공감 상담사입니다. 사용자의 답변을 바탕으로 더 깊이 있는 질문을 생성해주세요. 질문은 한국어로 하고, 따뜻하고 공감적인 톤을 사용해주세요.',
          },
          {
            role: 'user',
            content: `사용자가 "오늘 가장 귀찮게 느껴진 것"에 대해 "${answer}"라고 답했습니다. 이에 대해 더 자세한 상황을 알아볼 수 있는 후속 질문을 하나 생성해주세요.`,
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
            content:
              '당신은 감정 공감 상담사입니다. 사용자의 이전 답변들을 종합해서 감정 탐색을 위한 질문을 생성해주세요. 질문은 한국어로 하고, 따뜻하고 공감적인 톤을 사용해주세요.',
          },
          {
            role: 'user',
            content: `사용자가 다음과 같이 답변했습니다:\n1) 귀찮게 느껴진 것: "${step2Answer}"\n2) 상세 상황: "${step3Answer}"\n\n이제 사용자가 그 상황에서 느꼈던 감정을 탐색할 수 있는 질문을 하나 생성해주세요.`,
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
            content:
              '당신은 감정 공감 상담사입니다. 사용자의 상황과 감정을 종합해서 더 깊은 탐색을 위한 질문을 생성해주세요. 질문은 한국어로 하고, 따뜻하고 공감적인 톤을 사용해주세요.',
          },
          {
            role: 'user',
            content: `사용자가 다음과 같이 답변했습니다:\n1) 귀찮게 느껴진 것: "${step2Answer}"\n2) 상세 상황: "${step3Answer}"\n3) 그때 느꼈던 감정: ${step4Feelings.join(
              ', '
            )}\n\n이제 사용자의 감정을 더 깊이 탐색하고 이해할 수 있는 후속 질문을 하나 생성해주세요.`,
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
            content:
              '당신은 감정 공감 상담사입니다. 사용자의 모든 이전 답변과 감정을 종합해서 다음 단계의 질문을 생성해주세요. 질문은 한국어로 하고, 따뜻하고 공감적인 톤을 사용해주세요.',
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
