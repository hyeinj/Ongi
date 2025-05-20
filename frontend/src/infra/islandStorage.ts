import { Islands, EmotionType, LOCAL_STORAGE_KEYS } from '../entity';
import { getFromLocalStorage, saveToLocalStorage } from './localStorage';

/**
 * 기본 Islands 데이터
 */
const DEFAULT_ISLANDS: Islands = {
  joy: [],
  sadness: [],
  anger: [],
  anxiety: [],
  peace: [],
};

/**
 * 섬 카운트 인터페이스
 */
export interface IslandCounts {
  self: number;
  growth: number;
  routine: number;
  relate: number;
}

/**
 * Islands 데이터를 로컬 스토리지에서 가져옵니다.
 * @returns Islands 데이터 또는 기본값
 */
export const getIslandsFromStorage = (): Islands => {
  const islands = getFromLocalStorage<Islands>(LOCAL_STORAGE_KEYS.ISLANDS);
  return islands || DEFAULT_ISLANDS;
};

/**
 * Islands 데이터를 로컬 스토리지에 저장합니다.
 * @param islands 저장할 Islands 데이터
 */
export const saveIslandsToStorage = (islands: Islands): void => {
  saveToLocalStorage(LOCAL_STORAGE_KEYS.ISLANDS, islands);
};

/**
 * 특정 감정의 섬에 있는 날짜 수를 반환합니다.
 * @param emotionType 감정 타입
 * @returns 날짜 수
 */
export const getIslandCount = (emotionType: EmotionType): number => {
  const islands = getIslandsFromStorage();
  return islands[emotionType]?.length || 0;
};

/**
 * 모든 섬의 날짜 수를 반환합니다.
 * @returns 각 감정별 날짜 수 객체
 */
export const getAllIslandCounts = (): IslandCounts => {
  const islands = getIslandsFromStorage();

  return {
    self: islands.peace.length, // 자아 = 평온
    growth: islands.joy.length, // 성장 = 기쁨
    routine: islands.anxiety.length, // 루틴 = 불안
    relate: islands.sadness.length + islands.anger.length, // 관계 = 슬픔 + 분노
  };
};
