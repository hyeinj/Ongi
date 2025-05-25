import { RealLetter } from '../entities/realLetters';

export interface LetterParagraph {
  id: string;
  text: string;
}

export interface ProcessedLetter {
  worry: LetterParagraph[];
  answer: LetterParagraph[];
}

/**
 * 편지 텍스트를 문장 단위로 분할하는 함수
 * 마침표, 느낌표, 물음표를 기준으로 분할하되, 줄바꿈도 고려
 */
export const splitIntoSentences = (text: string): string[] => {
  // 먼저 줄바꿈을 기준으로 분할
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

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
};

/**
 * RealLetter를 LetterParagraph 배열로 변환하는 함수
 */
export const convertToLetterParagraphs = (
  text: string,
  type: 'worry' | 'answer'
): LetterParagraph[] => {
  const sentences = splitIntoSentences(text);

  return sentences.map((sentence, index) => ({
    id: `${type === 'worry' ? 'w' : 'a'}${index + 1}`,
    text: sentence,
  }));
};

/**
 * RealLetter를 ProcessedLetter로 변환하는 함수
 */
export const processRealLetter = (realLetter: RealLetter): ProcessedLetter => {
  return {
    worry: convertToLetterParagraphs(realLetter.letter, 'worry'),
    answer: convertToLetterParagraphs(realLetter.reply, 'answer'),
  };
};

/**
 * 감정별 편지 목록에서 랜덤하게 하나를 선택하는 함수
 * 향후 카테고리 필터링 등 확장 가능
 */
export const selectRandomLetter = (letters: RealLetter[]): RealLetter | null => {
  if (!letters || letters.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

/**
 * 감정과 카테고리를 기반으로 편지를 필터링하고 선택하는 함수 (향후 확장용)
 * 현재는 감정만 사용하지만, 나중에 카테고리 필터링 추가 가능
 */
export const selectLetterByEmotionAndCategory = (
  letters: RealLetter[],
  emotion: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  category?: string // eslint-disable-line @typescript-eslint/no-unused-vars
): RealLetter | null => {
  // 현재는 단순히 랜덤 선택하지만, 향후 카테고리 기반 필터링 로직 추가 가능
  // 예: letters.filter(letter => letter.category === category)

  return selectRandomLetter(letters);
};

/**
 * 편지 제목을 생성하는 함수 (첫 번째 문장을 기반으로)
 */
export const generateLetterTitle = (
  worryText: string,
  answerText: string
): { worry: string; answer: string } => {
  const worryFirstSentence = splitIntoSentences(worryText)[0] || '';
  const answerFirstSentence = splitIntoSentences(answerText)[0] || '';

  // 제목은 첫 번째 문장을 줄여서 사용하거나 기본값 사용
  const worryTitle =
    worryFirstSentence.length > 50
      ? worryFirstSentence.substring(0, 47) + '...'
      : worryFirstSentence;

  const answerTitle =
    answerFirstSentence.length > 50
      ? answerFirstSentence.substring(0, 47) + '...'
      : answerFirstSentence;

  return {
    worry: worryTitle || '고민을 나누어 주셔서 감사합니다.',
    answer: answerTitle || '따뜻한 마음을 전해드립니다.',
  };
};
