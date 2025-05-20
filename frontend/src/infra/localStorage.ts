/**
 * 로컬 스토리지 관련 유틸리티 함수
 */

/**
 * 로컬 스토리지에서 데이터를 가져옵니다.
 * @param key 로컬 스토리지 키
 * @returns 파싱된 데이터 또는 null
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`로컬 스토리지에서 데이터를 가져오는 중 오류 발생: ${error}`);
    return null;
  }
};

/**
 * 로컬 스토리지에 데이터를 저장합니다.
 * @param key 로컬 스토리지 키
 * @param value 저장할 데이터
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`로컬 스토리지에 데이터를 저장하는 중 오류 발생: ${error}`);
  }
};
