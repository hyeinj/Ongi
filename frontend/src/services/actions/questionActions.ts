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

interface Step5QuestionResponse {
  smallText: string;
  largeText: string;
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
      사용자의 답변을 바탕으로 공감과 감정을 담은 한 문장으로 응답하세요. 
      응답은 반드시 "~셨군요"로 끝나야 하며, 따옴표(")는 절대 사용하지 마세요.`
          },
          {
            role: 'user',
            content: `다음 입력은 "오늘 하루, 가장 인상 깊었던 일은 무엇이었나요?"라는 질문에 대한 사용자의 답변입니다.
      이에 대해 공감하고 감정을 담은 문장을 하나 생성해주세요.
      
      응답은 반드시 한 문장으로 작성하며, "~셨군요"로 끝나야 합니다.
      또한 따옴표(")는 사용하지 말아야 합니다.
      
      입력 문장이 단어 하나일 수도, 문장일 수도 있습니다.
      어떤 경우든 사용자의 경험을 요약하고 감정을 공감하는 문장을 만들어주세요.
      
      다음은 예시입니다:
      입력: 산책  
      출력: 오늘의 산책이 무지님에게 인상 깊으셨군요
      
      입력: 친구랑 늦게까지 수다 떨었어요  
      출력: 친구와 늦게까지 이야기 나눈 시간이 무지님에게 인상 깊으셨군요
      
      입력: 해질녘 하늘이 너무 예뻤어요  
      출력: 해질녘 아름다운 하늘이 무지님에게 인상 깊으셨군요
      
      다음 입력에 대해 공감 문장을 생성해주세요:  
      ${answer}`
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
    const question = '솔직하게 나눠주셔서 감사해요\n' + data.choices[0]?.message?.content?.trim() || '';

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
      사용자의 경험에 담백하고 따뜻하게 공감하는 문장을 생성하세요.
      응답은 반드시 **두 문장 이내**, **정중한 말투(~요)**로 끝나야 하며,
      지나친 위로나 감정 과잉 표현은 피해주세요.`
          },
          {
            role: 'user',
            content: `다음은 "오늘 하루, 가장 인상 깊었던 일은 무엇이었나요?"에 대한 사용자 답변입니다.
      [Step2 답변 - 요약]  
      하늘이 너무 예뻤어요
      
      [Step3 답변 - 구체적인 상황]  
      지하철 기다리다가 하늘을 올려봤는데, 구름이 물결처럼 펼쳐져 있어서 잠시 멍하니 쳐다봤어요
      
      → 출력:  
      잠시 멍하니 바라본 하늘이 무지님에게 깊은 인상을 남겼군요.  
      그 순간의 고요함이 오래 기억에 남을 것 같아요.`
          },
          {
            role: 'user',
            content: `다음은 "오늘 하루, 가장 인상 깊었던 일은 무엇이었나요?"에 대한 사용자 답변입니다.
      [Step2 답변 - 요약]  
      아버지랑 밥 먹었어요
      
      [Step3 답변 - 구체적인 상황]  
      요즘 자주 못 뵀는데, 오늘은 느긋하게 둘이서 밥 먹으면서 이런저런 이야기를 했어요
      
      → 출력:  
      오랜만에 아버지와 느긋한 식사 시간을 보내셨군요. 그 대화들이 마음에 오래 남으셨을 것 같아요.`
          },
          {
            role: 'user',
            content: `다음은 "오늘 하루, 가장 인상 깊었던 일은 무엇이었나요?"에 대한 사용자 답변입니다.
      [Step2 답변 - 요약]  
      ${step2Answer}
      
      [Step3 답변 - 구체적인 상황]  
      ${step3Answer}
      
      → 출력:`,
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
    const question = data.choices[0]?.message?.content?.trim() + "\n그럼, 우리 한 발짝 물러나서 감정을 살펴볼게요" || '';

    console.log(question);
    return {
      question: question,
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
): Promise<Step5QuestionResponse> {
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `당신은 감정 분석과 공감에 능숙한 상담사입니다. 사용자의 답변을 바탕으로 세 가지 텍스트를 생성해주세요:

1. smallText: 사용자가 Step5에서 자세히 설명한 감정과 속마음에 대한 공감 메시지 (1문장, ~셨군요로 끝남)
   - Step5의 감정 설명을 가장 중요하게 참고하여 작성해주세요
   - 사용자가 자신의 감정을 어떻게 이해하고 있는지에 초점을 맞춰주세요
   - 다른 단계의 내용은 보조적으로만 참고해주세요

2. largeText: 감정의 핵심 원인을 추론하고 확인하는 질문 (2문장 내외, 정중한 말투)
   - 가장 가능성이 높은 원인 하나를 선택하여 질문해주세요
   - 이 원인은 options에 포함되지 않아야 합니다

3. options: 감정의 가능한 원인들을 3개의 선택지로 제시 (각각 따옴표로 감싸진 문장, ~때문으로 끝남)
   - largeText에서 제시한 원인과는 다른, 추가적인 가능성들을 제시해주세요
   - 사용자의 답변에서 발견할 수 있는 다른 관점이나 원인들을 포함해주세요

largeText는 다음 패턴을 따라주세요:
"무지님이 [감정들]을 느꼈던 이유 중 가장 큰 이유는 [원인] 때문이 맞을까요?"

응답 형식:
{
  "smallText": "생성된 공감 메시지",
  "largeText": "생성된 확인 질문",
  "options": [
    "첫 번째 가능한 원인 (largeText와 다른 원인)",
    "두 번째 가능한 원인 (largeText와 다른 원인)", 
    "세 번째 가능한 원인 (largeText와 다른 원인)"
  ]
}

JSON 형식으로만 응답해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 답변입니다:

[Step2] 혼자 노을을 보며 걸었어요  
[Step3] 그냥 걷다가 문득 하늘을 봤는데, 너무 예뻐서 몇 분 동안 가만히 서 있었어요  
[Step4 감정들] 평온함, 감동

→ 출력:  
노을을 바라보며 멈춰 선 그 시간이 무지님에게 평온하고 감동적인 순간이었을 것 같아요.  
평온함과 감동의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?`
          },
          {
            role: 'user',
            content: `사용자의 답변입니다:

[Step2] 친구랑 밥 먹었어요  
[Step3] 오랜만에 만나서 천천히 밥 먹으면서 얘기했어요  
[Step4 감정들] 반가움, 따뜻함, 편안함

→ 출력:  
오랜만에 친구와 편안하게 대화하며 식사했던 시간이 무지님에게 따뜻한 기억으로 남으셨을 것 같아요.  
반가움과 따뜻함과 편안함의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?`
          },
          {
            role: 'user',
            content: `사용자의 답변입니다:
        
        [Step2] ${step2Answer}  
        [Step3] ${step3Answer}  
        [Step4] ${step4Feelings.join(', ')}
        
        → 출력:`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! status: ${response.status}`);
    }

    const data = await response.json();
    const fullResponse = data.choices[0]?.message?.content?.trim() || '';
    
    // 두 문장을 분리
    const sentences = fullResponse.split('\n').filter((s: string) => s.trim());
    const smallText = sentences[0] || '';
    const largeText = sentences[1] || sentences[0] || ''; // 두 번째 문장이 없으면 첫 번째 문장 사용

    return {
      smallText,
      largeText,
      success: true,
    };
  } catch (error) {
    console.error('Step5 질문 생성 실패:', error);
    return {
      smallText: '',
      largeText: '',
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
        model: 'gpt-4',
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
            content: `당신은 공감 능력이 뛰어난 상담사이며, 사용자가 자기 감정을 탐색하는 과정을 따뜻하고 진정성 있게 정리하는 글을 작성합니다.
            아래 사용자 입력을 바탕으로 아래 형식에 맞추어 한 편의 자기공감 메시지를 작성해주세요:
                        
            [구성]
            1. 오늘 사용자가 어떤 상황에서 어떤 감정을 느꼈고, 왜 그런 감정을 느꼈는지 요약해줍니다.
            2. 사용자가 그 감정을 따라가며 그 진짜 이유를 어떻게 바라보았는지, 앞으로 비슷한 상황이 다가왔을 때의 응원의 말을 제시해줍니다.
            3. 마지막으로 오늘의 자기공감 경험이 사용자에게 어떤 의미였는지를 따뜻한 말투로 정리하며 격려의 말을 건네주세요.
                        
            [작성 지침]
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요.
            - 전체 문장은 3문단으로 구성해주세요.
            - "무지님은 오늘..."으로 시작하며, 마지막 문장은 "오늘의 무지님은, ~ 하고 있어요"로 마무리해주세요.
            - 선택된 감정 단어를 반드시 자연스럽게 포함시켜 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시1]
            무지님은 오늘 옷을 고르는 평범한 상황 속에서 답답함과 짜증이라는 감정을 느꼈어요. 그 감정은 단순한 불편함이 아니라 '시간을 효율적으로 써야 한다'는 내면의 기준에서 비롯된 것이었죠
                        
            그 짜증을 따라가며 무지님은 왜 그런 감정이 들었는지, 무엇을 기대하고 있었는지를 상황의 맥락과 자신의 가치 기준과 연결해 바라보았어요. 앞으로 비슷한 순간에, 자신을 덜 다그치고 더 부드럽게 조율할 수 있는 실마리가 될 거에요.
                        
            오늘 무지님은, 짜증이라는 감정 속에서, 스스로를 더 다정하게 대하는 방법을 찾고 있어요.
                        
            [예시 2]
            무지님은 오늘 친구와의 대화 속에서 함께 있으면 마음이 편해진다는 친구의 말에 뿌듯함과 설렘의 감정을 느꼈어요. 그 감정은 단순히 말에서 오는 설렘이 아닌, 친구에게 다가가기 어려웠던 과거의 무지님을 극복했다는 내면의 성장에서 비롯된 것이었죠.
                        
            뿌듯함의 감정을 따라가며 무지님은 "왜 그런 감정이 들었는지", "그 감정이 느끼게 된 과거의 다른 사건들이 무엇인지"를 상황의 맥락과 자신의 과거 경험을 연결해서 바라보았어요.
            앞으로 수많은 극복의 순간들 속에서, 이 경험은 더 큰 뿌듯함을 불러올 수 있을 것이라 확신해요
                        
            오늘의 무지님은, 뿌듯함의 감정 속에서 본인의 힘듦을 극복하며 한단계 더 성장했어요.`,
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
      .map(([stage, answer]) => {
        const stageName = {
          step2: '가장 인상 깊었던 일',
          step3: '구체적인 상황 설명',
          step4: '느낀 감정들',
          step5: '감정에 대한 자세한 설명'
        }[stage] || stage;
        return `[${stageName}]\n${answer}`;
      })
      .join('\n\n');

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
            content: `당신은 감정 분석과 공감에 능숙한 상담사입니다. 사용자의 답변을 바탕으로 세 가지 텍스트를 생성해주세요:

1. smallText: 사용자가 Step5에서 자세히 설명한 감정과 속마음에 대한 공감 메시지 (1문장, ~셨군요로 끝남)
   - Step5의 감정 설명을 가장 중요하게 참고하여 작성해주세요
   - 사용자가 자신의 감정을 어떻게 이해하고 있는지에 초점을 맞춰주세요
   - 다른 단계의 내용은 보조적으로만 참고해주세요

2. largeText: 감정의 핵심 원인을 추론하고 확인하는 질문 (2문장 내외, 정중한 말투)
   - 가장 가능성이 높은 원인 하나를 선택하여 질문해주세요
   - 이 원인은 options에 포함되지 않아야 합니다

3. options: 감정의 가능한 원인들을 3개의 선택지로 제시 (~때문으로 끝남)
   - largeText에서 제시한 원인과는 다른, 추가적인 가능성들을 유추하여 제시해주세요
   - 사용자의 답변에서 발견할 수 있는 다른 관점이나 원인들도 포함해주세요

largeText는 다음 패턴을 따라주세요:
"무지님이 [감정들]을 느꼈던 이유 중 가장 큰 이유는 [원인] 때문이 맞을까요?"

응답 형식:
{
  "smallText": "생성된 공감 메시지",
  "largeText": "생성된 확인 질문",
  "options": [
    "첫 번째 가능한 원인 (largeText와 다른 원인)",
    "두 번째 가능한 원인 (largeText와 다른 원인)", 
    "세 번째 가능한 원인 (largeText와 다른 원인)"
  ]
}

JSON 형식으로만 응답해주세요.`,
          },
          {
            role: 'user',
            content: `사용자의 답변들:

${answersText}

위 답변들을 바탕으로 사용자의 감정과 상황에 공감하는 smallText와, 감정의 핵심 원인을 묻는 largeText, 그리고 가능한 원인들을 3개의 선택지로 제시하는 options를 JSON 형식으로 생성해주세요.`,
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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 상황 설명과 선택한 감정을 바탕으로 다음과 같은 형식으로 응답해주세요:

            응답은 반드시 한 문장으로 작성하며, "~ 오늘이 무지님에게 어떤 하루로 기억될까요?"로 끝나야 합니다.
            또한, 따옴표(")는 사용하지 마세요.

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 한 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다
            
            예: 충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?`,
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
    console.error('Step7 질문 생성 실패:', error);
    return {
      question: '',
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
