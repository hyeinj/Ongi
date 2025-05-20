import {
  EmotionEntry,
  DailyEmotion,
  Emotions,
  EmotionType,
  Category,
  LOCAL_STORAGE_KEYS,
} from '../entity';
import { getFromLocalStorage, saveToLocalStorage } from './localStorage';

/**
 * 기본 빈 Emotions 객체
 */
const DEFAULT_EMOTIONS: Emotions = {};

/**
 * 날짜 형식을 YYYY-MM-DD 형태로 반환
 */
export const formatDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Emotions 데이터를 로컬 스토리지에서 가져옵니다.
 * @returns Emotions 데이터 또는 기본값
 */
export const getEmotionsFromStorage = (): Emotions => {
  const emotions = getFromLocalStorage<Emotions>(LOCAL_STORAGE_KEYS.EMOTIONS);
  return emotions || DEFAULT_EMOTIONS;
};

/**
 * Emotions 데이터를 로컬 스토리지에 저장합니다.
 * @param emotions 저장할 Emotions 데이터
 */
export const saveEmotionsToStorage = (emotions: Emotions): void => {
  saveToLocalStorage(LOCAL_STORAGE_KEYS.EMOTIONS, emotions);
};

/**
 * 특정 날짜의 감정 기록을 가져옵니다.
 * @param date 날짜 (기본값: 오늘)
 * @returns 해당 날짜의 감정 기록 또는 null
 */
export const getDailyEmotion = (date: string = formatDate()): DailyEmotion | null => {
  const emotions = getEmotionsFromStorage();
  return emotions[date] || null;
};

/**
 * 감정 입력(질문-답변)을 추가합니다.
 * @param entry 추가할 감정 입력
 * @param date 날짜 (기본값: 오늘)
 */
export const addEmotionEntry = (entry: EmotionEntry, date: string = formatDate()): void => {
  const emotions = getEmotionsFromStorage();

  // 해당 날짜의 기존 데이터 가져오기 또는 새로 생성
  const dailyEmotion = emotions[date] || {
    entries: [],
    category: 'self' as Category, // 초기 기본값
    emotion: 'peace' as EmotionType, // 초기 기본값
  };

  // 새 항목 추가
  dailyEmotion.entries.push(entry);

  // 전체 데이터에 업데이트된 일일 데이터 저장
  emotions[date] = dailyEmotion;

  // 로컬 스토리지에 저장
  saveEmotionsToStorage(emotions);
};

/**
 * 특정 날짜의 카테고리와 감정을 설정합니다.
 * @param category 설정할 카테고리
 * @param emotion 설정할 감정
 * @param date 날짜 (기본값: 오늘)
 */
export const setCategoryAndEmotion = (
  category: Category,
  emotion: EmotionType,
  date: string = formatDate()
): void => {
  const emotions = getEmotionsFromStorage();

  // 해당 날짜의 기존 데이터 가져오기 또는 새로 생성
  const dailyEmotion = emotions[date] || {
    entries: [],
    category: 'self' as Category,
    emotion: 'peace' as EmotionType,
  };

  // 카테고리와 감정 업데이트
  dailyEmotion.category = category;
  dailyEmotion.emotion = emotion;

  // 전체 데이터에 업데이트된 일일 데이터 저장
  emotions[date] = dailyEmotion;

  // 로컬 스토리지에 저장
  saveEmotionsToStorage(emotions);
};
