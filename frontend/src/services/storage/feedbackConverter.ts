// 서버 응답 타입 정의
export interface ServerFeedbackResponse {
  generatedFeedback1: string;
  'generatedFeedback2-공감의 문구': string;
  'generatedFeedback2-위로 문장': string;
  'generatedFeedback3-피드백 요약 문장': string;
  'generatedFeedback3-피드백 내용': string;
  generatedFeedback4: string;
}

// 프론트엔드 피드백 섹션 타입 정의
export interface FeedbackSections {
  emotionConnection: string;
  empathyReflection: [string, string];
  improvementSuggestion: [string, string];
  finalMessage: string;
}

/**
 * 서버 응답을 프론트엔드 피드백 섹션으로 변환
 */
export function convertServerFeedbackToFeedbackSections(
  serverResponse: ServerFeedbackResponse
): FeedbackSections {
  return {
    // 1. 감정 연결 피드백 (generatedFeedback1)
    emotionConnection: serverResponse.generatedFeedback1,

    // 2. 공감 문장 반영 (generatedFeedback2)
    empathyReflection: [
      serverResponse['generatedFeedback2-공감의 문구'],
      serverResponse['generatedFeedback2-위로 문장'],
    ],

    // 3. 개선 제안 (generatedFeedback3)
    improvementSuggestion: [
      serverResponse['generatedFeedback3-피드백 요약 문장'],
      serverResponse['generatedFeedback3-피드백 내용'],
    ],

    // 4. 최종 메시지 (generatedFeedback4)
    finalMessage: serverResponse.generatedFeedback4,
  };
}

/**
 * 서버 응답을 단일 AI 피드백 문자열로 변환 (폴백용)
 */
export function convertServerFeedbackToAiFeedback(serverResponse: ServerFeedbackResponse): string {
  const sections = [
    serverResponse.generatedFeedback1,
    `"${serverResponse['generatedFeedback2-공감의 문구']}"`,
    serverResponse['generatedFeedback2-위로 문장'],
    serverResponse['generatedFeedback3-피드백 요약 문장'],
    serverResponse['generatedFeedback3-피드백 내용'],
    serverResponse.generatedFeedback4,
  ];

  return sections.filter((section) => section && section.trim()).join('\n\n');
}
