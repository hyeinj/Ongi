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
        model: 'gpt-4',
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
        model: 'gpt-4',
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
            content: `당신은 공감 능력이 뛰어난 상담사입니다.  
사용자의 상황 설명과 감정 단어들을 바탕으로 따뜻하고 담백한 공감을 표현해주세요.  

형식은 다음과 같습니다:  
1. **첫 번째 문장**: Step2, Step3 내용을 요약하며, 감정 단어 중 대표적인 것 1~2개를 자연스럽게 녹여 공감해주세요.  
2. **두 번째 문장**: 전체 감정 단어들을 바탕으로 아래 형식을 그대로 사용해주세요:  
"[선택한 감정 표현]의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?"

제한 조건:  
- 응답은 **두 문장으로만**, 반드시 줄바꿈으로 구분해 작성해야 합니다.  
- 모든 문장은 **정중한 말투(~요)**로 끝나야 합니다.  
- **감정 단어는 쉼표로 나열하지 말고 자연스럽게 연결**해주세요.  
- 두 번째 문장은 감정 단어 전체를 반영하지만, 문법적으로 부드럽게 연결된 표현이어야 합니다.  
- 과장된 위로나 감정적 과잉 표현은 피해주세요.`,
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
친구와 오랜만에 마주 앉아 편안하게 나눈 대화가 무지님에게 따뜻하게 다가왔을 것 같아요.  
반가움과 따뜻함, 그리고 편안함의 감정이 어우러졌던 무지님의 속 마음을 조금 더 들려주실 수 있나요?`
          },
          {
            role: 'user',
            content: `사용자의 답변입니다:
[Step2] 발표를 했어요  
[Step3] 발표를 앞두고 엄청 긴장했는데, 막상 하다보니 잘 끝냈고 칭찬도 들었어요  
[Step4 감정들] 긴장됨, 뿌듯함, 안도감

→ 출력:  
준비한 발표를 무사히 마치고 칭찬까지 받았던 경험이 무지님에게 뿌듯하면서도 안도되는 순간이었을 것 같아요.  
긴장됨과 뿌듯함, 그리고 안도감의 감정이 섞여 있었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?`
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
        model: 'gpt-4',
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `당신은 공감 능력이 뛰어난 상담사이며, 사용자가 자기 감정을 탐색하는 과정을 진정성 있고 따뜻하게 정리하는 글을 작성합니다.  
아래 사용자 입력을 바탕으로, 자기공감 메시지를 다음 구성에 맞추어 작성해주세요.

[구성]

1. 오늘 사용자가 어떤 상황에서 어떤 감정을 느꼈고, 왜 그런 감정을 느꼈는지를 요약해주세요.  
2. 사용자가 그 감정을 따라가며 떠올린 내면의 말들, 그리고 그 말들을 어떻게 받아들였는지 표현해주세요.  
   - 내면의 말이 조심스럽거나 익숙하지 않은 말이라면, 그 말에 다가가는 태도나 질문을 표현해주세요.  
   - 내면의 말이 힘이 되었거나 나를 지지해주는 말이라면, 그 말을 받아들이거나 따뜻하게 확인하는 마음을 표현해주세요.  
3. 자기공감의 여정을 마무리하며, 오늘의 자신을 다정하게 바라보는 문장으로 끝내주세요.

[작성 지침]

- "무지님"이라는 호칭은 사용하지 않고, 사용자가 스스로에게 이야기하듯 1인칭 시점으로 작성해주세요.
- 전체 문장은 3문단으로 구성해주세요.
- 450자 이내로 작성해주세요.
- 감정 단어는 자연스럽게 문장에 녹여서 포함해주세요.
- 감정이나 내면의 말에 따라 자연스럽게 조화를 이루는 태도를 표현해주세요:
   - 조심스러운 말일 땐, 유보하거나 질문하는 마음
   - 나를 지지하는 말일 땐, 받아들이거나 다정하게 강화하는 마음
- 마무리 문장은 다음 중 어울리는 톤으로 1~2줄로 구성해주세요:
   - 오늘의 나는, 불안한 마음 속에서도 나를 이해하려고 애쓰고 있었어요.
   - 오늘의 나는, 내 안에서 반복되던 말들을 조용히 바라보며, 그 말들 너머의 나를 이해하려고 애쓰고 있었어요.
   - 오늘의 나는, 나에게 힘이 되는 말을 기꺼이 받아들이며 하루를 살아냈어요.
   - 오늘의 나는, 내 안에서 올라온 건강한 목소리를 조용히 따라가며 나를 지지하고 있었어요.


[예시]
- 예시1:
오늘 나는 친구와 만나 오랜만에 따뜻하고 편안한 시간을 보냈지만, 그 안에서도 어딘가 모를 긴장감이 함께 있었어요. 그 감정은 ‘이 순간을 잘 보내야 한다’는 마음에서 비롯된 걸지도 모르겠어요.
그러다 문득, 내가 자주 하는 마음속 말을 떠올렸어요. “나는 항상 잘해야 해.” 이 말이 지금도 나를 붙잡고 있는 걸까, 조용히 스스로에게 물어보게 됐어요.
오늘의 나는, 불안한 마음 속에서도 나를 이해하려고 애쓰고 있었어요. 그런 나를, 조금 더 믿어주고 싶어요.

- 예시2:
오늘 나는 친구와 오랜만에 마주 앉아 여유롭게 대화를 나누었어요. 따뜻하고 편안한 기분이 들어서, 그 순간만큼은 시간을 천천히 흘려보낼 수 있었어요.
생각해보면, "나는 이렇게 있어도 괜찮아", "이런 시간이 참 좋다" 같은 말들이 마음 깊은 곳에서 올라왔던 것 같아요. 내가 나에게 오랜만에 허락해준 안정감이었을지도 모르겠어요.
오늘의 나는, 익숙하지 않았던 다정한 말들을 조용히 받아들이며 하루를 보냈어요.

- 예시3:
오늘 나는 발표를 마치고 나서 뿌듯하면서도 약간의 허탈함, 안도감이 함께 뒤섞인 기분이 들었어요. 아마 “끝냈으니 됐어”라는 내면의 말과 “더 잘했어야 하는 거 아냐?”라는 또 다른 말이 동시에 내 마음에 있었기 때문일 거예요.
그 말들을 곧장 밀어내거나 따라가지 않고, 그냥 거기에 있는 말들로 받아들이려고 했어요.
오늘의 나는, 내 안에서 반복되던 말들을 조용히 바라보며, 그 말들 너머의 나를 이해하려고 애쓰고 있었어요.

- 예시4:
오늘 나는 무기력한 마음으로 하루를 보냈어요. 뭘 해야 할지 몰라 멍하니 시간을 보내기도 했고, 그 속에서 스스로에게 수없이 말을 걸고 있었던 것 같아요.
그 중에서도 "이래도 괜찮은 걸까?", "나는 지금 뭘 놓치고 있는 건 아닐까?" 같은 말들이 마음 한켠을 계속 맴돌았어요. 아무것도 하지 못한 나에게 쏟아지는 말들 속에서, 나는 내가 진짜 하고 싶었던 이야기를 찾고 있었는지도 몰라요.
오늘의 나는, 그런 말들 사이에서 조용히 내 마음의 소리를 들어보려 애쓰고 있었어요.

- 예시5:
오늘 나는 뭔가를 하려고 했지만, 자꾸만 흐름이 끊겨서 집중하지 못했어요. 초조함과 답답함이 계속 쌓이면서도, 내내 '왜 이렇게 안 되지?'라는 생각을 떨칠 수 없었어요.
마음속 어딘가에서는 “오늘은 무언가 해내야 하는 날이었어” 같은 말이 맴돌고 있었어요. 하지만 그 말에 너무 끌려가지 않으려 조심스레 한 발 물러서 보려고 했어요.
오늘의 나는, 스스로에게 조용히 질문을 던지며 그 말의 무게를 바라보고 있었어요.

- 예시6:
오늘 나는 더운 날씨에 몸을 움직이며 작업하러 나갔어요. 지치는 순간이었지만, 햇볕 아래서 작은 활력이 느껴졌고, 그 순간이 의외로 힘이 되었어요. ‘이런 생기라면 다시 찾고 싶다’는 마음이 자연스럽게 올라왔어요.
그 말은 낯설지 않았고, 오히려 내가 오래 잊고 있었던 감각처럼 느껴졌어요. “나는 이렇게 살아 있는 느낌을 느낄 수 있는 사람이야.” 그 말이 오늘 하루를 지탱해주는 말이 되었어요.
오늘의 나는, 내 안에서 올라온 건강한 목소리를 조용히 따라가며 나를 지지하고 있었어요.
`,
          },
          {
            role: 'user',
            content: `사용자의 답변들:
${answersText}

분석된 카테고리: ${category} (${categoryContext[category]})
분석된 감정: ${emotion} (${emotionContext[emotion]})

이 정보를 바탕으로 사용자의 하루 감정 여정을 되돌아보는 메시지를 작성해주세요.`,
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

2. largeText: 무지님의 감정을 이끈 마음 속 말들을 골라보세요. 를 그대로 출력

3. options: 무지님의 감정을 이끈 마음 속 말(내면의 언어)을 4개 제시

사용자가 앞선 질문(Step2~Step5)에서 긍정적인 답변을 했을 수도 있고,  
부정적이거나 중립적, 혼합적인 감정을 표현했을 수도 있습니다.  
정확한 감정의 방향을 단정할 수 없으므로, 4개의 선택지가 다양한 감정 흐름에 자연스럽게 대응할 수 있도록 구성되어야 합니다.  

예를 들어:
- "나는 잘 해냈어" (긍정적 확신)  
- "나는 항상 잘해야 해" (부정적 압박)  
- "이번엔 그냥 받아들이자" (중립적 수용)  
- "아쉽지만 이게 지금의 최선이었어" (복합 감정 수용)

모든 선택지는 무지님이 스스로에게 반복적으로 건네고 있었을 법한  
'1인칭 내면의 말투'로 자연스럽게 작성해주세요.

응답 형식:
{
  "smallText": "생성된 공감 메시지",
  "largeText": "생성된 질문",
  "options": [
    "첫 번째 가능한 내면의 말",
    "두 번째 가능한 내면의 말", 
    "세 번째 가능한 내면의 말",
    "네 번째 가능한 내면의 말"
  ]
}

JSON 형식으로만 응답해주세요

예시는 다음과 같습니다.

예시1:
사용자 답변:
[Step2] 친구랑 밥 먹었어요  
[Step3] 오랜만에 만나서 천천히 밥 먹으면서 얘기했어요  
[Step4 감정들] 반가움, 따뜻함, 편안함  
[Step5] 오랜만에 여유 있는 시간이 필요했구나 싶었어요

-> 출력:
{
  "smallText": "오랜만에 친구와 함께한 따뜻한 시간이 무지님께 꼭 필요했던 여유였군요.",
  "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
  "options": [
    "이렇게 여유를 느끼는 것도 내가 누릴 수 있는 권리야",
    "이런 순간이 자주 찾아오진 않으니까 더 소중히 느껴졌어",
    "나는 항상 잘해내야 해, 그래서 이런 시간이 미안하게 느껴지기도 했어",
    "편안함이 익숙하지 않아서 어색했지만, 마음 한켠에선 원하고 있었어"
  ]
}
  
예시2:
사용자 답변: 
[Step2] 오늘 시험을 포기했어요  
[Step3] 너무 피곤해서 아침에 일어날 수가 없었고, 그냥 더 자버렸어요  
[Step4 감정들] 속시원함, 죄책감  
[Step5] 사실 몸이 너무 지쳐 있었고, 더 자는 게 필요했어요. 그래도 마음 한편으로는 시험을 포기한 게 자꾸 걸려요

-> 출력:
{
  "smallText": "무지님은 몸의 피로를 돌보는 동시에, 놓아버린 선택에 마음이 걸리셨군요.",
  "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
  "options": [
    "이 정도로 지친 내가 시험을 본다고 잘 볼 수 있었을까?",
    "쉬는 게 필요하긴 했지만, 그래도 책임을 다하지 못한 것 같아 미안했어",
    "나는 원래 느슨하면 쉽게 무너지는 사람이야",
    "이번엔 어쩔 수 없었고, 다음을 준비하면 돼"
  ]
}


예시3:
사용자 답변:
[Step2] 아무것도 하지 못했어요  
[Step3] 해야 할 게 있었는데 침대에서 하루 종일 누워만 있었어요  
[Step4 감정들] 무기력, 후회, 자책  
[Step5] 이러면 안 되는 걸 알면서도 몸이 안 움직였어요. 결국 아무것도 못 하고 하루를 보냈어요

-> 출력:
{
  "smallText": "몸과 마음이 모두 무거운 하루를 보내며, 스스로를 다그치고 계셨군요.",
  "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
  "options": [
    "나는 왜 이렇게 의지가 약할까",
    "이 상태를 어떻게든 벗어나야 해",
    "쉬고 싶었지만, 쉬는 것조차 죄책감이 들었어",
    "나 스스로도 이해할 수 없는 감정들이 계속 겹쳤어"
  ]
}


예시4:
사용자 답변:
[Step2] 드디어 프로젝트를 끝냈어요  
[Step3] 몇 주 동안 신경을 곤두세우며 준비했던 결과물을 오늘 제출했어요  
[Step4 감정들] 뿌듯함, 안도감, 피곤함  
[Step5] 긴장이 확 풀리면서 이제야 쉴 수 있겠다는 생각이 들었어요. 열심히 해낸 나 자신이 대견했어요

-> 출력:
{
  "smallText": "긴 여정을 마무리하고 자신에게 따뜻한 인정을 건네신 하루셨군요.",
  "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
  "options": [
    "나는 이만큼 해낸 사람이라는 걸 잊지 말자",
    "다음엔 더 잘해야 해. 이걸로 만족하면 안 돼",
    "아직도 뭔가 빠뜨린 게 있는 건 아닐까?",
    "쉬어도 괜찮아, 이건 충분히 의미 있는 성취였어"
  ]
}
`,
          },
          {
            role: 'user',
            content: `사용자의 답변들:

${answersText}

위 답변들을 바탕으로 사용자의 감정과 상황에 공감하는 smallText와, 내면의 말을 묻는 largeText, 그리고 가능한 내면의 말들을 4개의 선택지로 제시하는 options를 JSON 형식으로 생성해주세요.`,
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
        model: 'gpt-4',
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
            content: `누군가가 오늘 가장 인상깊었던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step1 답변 - 인상깊었던 일]
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
