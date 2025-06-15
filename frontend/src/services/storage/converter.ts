export interface RawRealLetterData {
  success: boolean;
  message: string;
  data: {
    letterTitle: string;
    worryContent: string;
    answerContent: string;
  };
}

// 텍스트를 문장 단위로 분할하는 헬퍼 메서드
export function splitIntoSentences(text: string): string[] {
  // 먼저 줄바꿈을 기준으로 분할
  const lines = text.split('/n').filter((line) => line.trim().length > 0);

  const sentences: string[] = [];

  lines.forEach((line) => {
    // 각 줄을 문장 부호를 기준으로 분할
    const lineSentences = line
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.trim().length > 0)
      .map((sentence) => sentence.trim());

    sentences.push(...lineSentences);
  });

  return sentences;
}

export function convertRawRealLetterDataContent(content: string): {
  convertedContent: { id: string; text: string }[];
} {
  return {
    convertedContent: splitIntoSentences(content).map((sentence, index) => ({
      id: index.toString(),
      text: sentence,
    })),
  };
}
