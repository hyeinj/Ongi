'use server';

interface MockLetterResponse {
  mockLetter: string;
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 감정 공감 상담 전문가입니다. 사용자의 감정 상태와 답변을 바탕으로 비슷한 경험을 가진 가상의 인물이 보내는 짧은 편지를 작성해주세요.

편지 작성 가이드라인:
- 길이: 200-300자 내외의 짧은 편지
- 톤: 따뜻하고 공감적이며 진솔한 어조
- 내용: 사용자와 비슷한 감정을 경험한 가상 인물의 이야기
- 구조: 인사 -> 공감 -> 격려/조언 -> 마무리
- 언어: 한국어, 자연스럽고 친근한 말투

카테고리별 접근:
- self: 자아 정체성, 자존감과 관련된 고민
- growth: 성장, 도전, 학습과 관련된 이야기  
- routine: 일상, 습관, 생활패턴과 관련된 경험
- relationship: 인간관계, 소통과 관련된 상황

감정별 접근:
- joy: 기쁨, 성취감을 공유하는 내용
- sadness: 슬픔, 상실감에 대한 위로
- anger: 분노, 짜증에 대한 이해와 해소법
- anxiety: 불안, 걱정에 대한 공감과 안정감
- peace: 평온, 차분함에 대한 공유

응답 형식: 편지 내용만 반환해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 감정 정보:
카테고리: ${emotionContext.category}
감정: ${emotionContext.emotion}

사용자의 답변들:
${answersText}

이 정보를 바탕으로 사용자와 비슷한 경험을 한 가상 인물이 보내는 짧은 편지를 작성해주세요.`,
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
    const mockLetter = data.choices[0]?.message?.content?.trim() || '';

    // 임시 realLetterId 생성 (추후 실제 편지 매칭 시스템으로 교체)
    const realLetterId = `letter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      mockLetter,
      realLetterId,
      success: true,
    };
  } catch (error) {
    console.error('모의 편지 생성 실패:', error);
    return {
      mockLetter: '',
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
      const result = JSON.parse(content);

      if (!result.feedback || !Array.isArray(result.highlightedParts)) {
        throw new Error('응답 형식이 올바르지 않습니다.');
      }

      return {
        feedback: result.feedback,
        highlightedParts: result.highlightedParts,
        success: true,
      };
    } catch {
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
