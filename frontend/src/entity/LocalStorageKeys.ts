/**
 * 로컬 스토리지에 사용되는 키 상수 정의
 */

export const LOCAL_STORAGE_KEYS = {
  USER: 'ongi_user',
  EMOTIONS: 'ongi_emotions',
  LETTERS: 'ongi_letters',
  REAL_LETTERS: 'ongi_real_letters',
  ISLANDS: 'ongi_islands',
} as const;

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
