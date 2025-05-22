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
