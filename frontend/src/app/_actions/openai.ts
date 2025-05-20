'use server';

import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * 랜덤 첫 질문 생성을 위한 프롬프트
 */
const FIRST_QUESTION_PROMPT = `
당신은 사용자에게 그들의 감정과 경험에 대해 물어보는 공감적인 상담사입니다. 
사용자의 하루와 감정에 대해 알아보기 위한 첫 번째 질문을 생성해주세요.
질문은 따뜻하고 개방적이어야 하며, 사용자가 자신의 경험과 감정을 자유롭게 표현할 수 있도록 해야 합니다.

응답은 다음 형식으로 JSON으로 제공해주세요:
{
  "smallText": "짧은 인사말 또는 도입부 (30자 이내)",
  "largeText": "메인 질문 (100자 이내)"
}
`;

/**
 * 이어지는 질문 생성을 위한 프롬프트 템플릿
 */
const FOLLOW_UP_PROMPT_TEMPLATE = `
당신은 사용자에게 그들의 감정과 경험에 대해 물어보는 공감적인 상담사입니다.
사용자와의 이전 대화를 바탕으로 다음 질문을 생성해주세요.

이전 대화:
{previousContext}

새로운 질문은 사용자의 이전 답변을 반영하고, 더 깊은 감정이나 경험을 탐색할 수 있도록 해야 합니다.
질문은 따뜻하고 개방적이어야 하며, 사용자가 자신의 경험과 감정을 더 자세히 표현할 수 있도록 해야 합니다.

응답은 다음 형식으로 JSON으로 제공해주세요:
{
  "smallText": "짧은 인사말 또는 도입부 (30자 이내)",
  "largeText": "메인 질문 (100자 이내)"
}
`;

/**
 * 최종 공감 메시지 생성을 위한 프롬프트 템플릿
 */
const FINAL_EMPATHY_PROMPT_TEMPLATE = `
당신은 사용자에게 깊은 공감과 이해를 제공하는 공감적인 상담사입니다.
사용자와의 대화 내용을 바탕으로 따뜻하고 공감적인 최종 메시지를 생성해주세요.

대화 내용:
{conversationContext}

사용자의 감정과 경험을 요약하고, 그들의 이야기에 대한 깊은 이해와 공감을 표현해주세요.
응답은 사용자가 자신의 감정을 더 잘 이해하고 받아들일 수 있도록 도와주는 내용이어야 합니다.

또한, 사용자의 대화 내용을 바탕으로 다음 정보도 분석해주세요:
1. 사용자의 주요 카테고리 (자아/self, 성장/growth, 루틴/routine, 관계/relationship 중 하나)
2. 사용자의 주요 감정 (기쁨/joy, 슬픔/sadness, 분노/anger, 불안/anxiety, 평온/peace 중 하나)

응답은 다음 형식으로 JSON으로 제공해주세요:
{
  "empathyMessage": "공감 메시지 (300자 이내)",
  "category": "카테고리 분석 결과 (영어로: self, growth, routine, relationship 중 하나)",
  "emotion": "감정 분석 결과 (영어로: joy, sadness, anger, anxiety, peace 중 하나)"
}
`;

/**
 * 대화 컨텍스트를 포맷팅하는 함수
 */
function formatConversationContext(conversations: { question: string; answer: string }[]): string {
  return conversations
    .map((conv, index) => `질문 ${index + 1}: ${conv.question}\n답변 ${index + 1}: ${conv.answer}`)
    .join('\n\n');
}

/**
 * 첫 번째 질문 생성 함수
 */
export async function generateFirstQuestion(): Promise<{ smallText: string; largeText: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: FIRST_QUESTION_PROMPT,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('응답이 비어있습니다.');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('첫 번째 질문 생성 중 오류:', error);
    // 기본 질문으로 폴백
    return {
      smallText: '안녕하세요.',
      largeText: '오늘 하루는 어떠셨나요? 기억에 남는 순간이 있었나요?',
    };
  }
}

/**
 * 이어지는 질문 생성 함수
 */
export async function generateFollowUpQuestion(
  conversations: { question: string; answer: string }[]
): Promise<{ smallText: string; largeText: string }> {
  try {
    const formattedContext = formatConversationContext(conversations);
    const promptWithContext = FOLLOW_UP_PROMPT_TEMPLATE.replace(
      '{previousContext}',
      formattedContext
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: promptWithContext,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('응답이 비어있습니다.');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('이어지는 질문 생성 중 오류:', error);
    // 기본 질문으로 폴백
    return {
      smallText: '조금 더 알고 싶어요.',
      largeText: '그 경험에서 어떤 감정을 느끼셨나요? 더 자세히 말씀해주실 수 있을까요?',
    };
  }
}

/**
 * 최종 공감 메시지 생성 함수
 */
export async function generateFinalEmpathy(
  conversations: { question: string; answer: string }[]
): Promise<{ empathyMessage: string; category: string; emotion: string }> {
  try {
    const formattedContext = formatConversationContext(conversations);
    const promptWithContext = FINAL_EMPATHY_PROMPT_TEMPLATE.replace(
      '{conversationContext}',
      formattedContext
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: promptWithContext,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('응답이 비어있습니다.');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('최종 공감 메시지 생성 중 오류:', error);
    // 기본 응답으로 폴백
    return {
      empathyMessage:
        '당신의 이야기를 들어볼 수 있어 감사했습니다. 감정을 나누는 것은 때로는 어려울 수 있지만, 그 과정을 통해 우리는 더 나은 이해와 성장을 할 수 있습니다.',
      category: 'self',
      emotion: 'peace',
    };
  }
}
