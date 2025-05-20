import { v4 as uuidv4 } from 'uuid';
import { User, LOCAL_STORAGE_KEYS } from '../entity';
import { getFromLocalStorage, saveToLocalStorage } from './localStorage';

/**
 * 사용자 정보를 로컬 스토리지에서 가져옵니다.
 * @returns 사용자 정보 또는 null
 */
export const getUserFromStorage = (): User | null => {
  return getFromLocalStorage<User>(LOCAL_STORAGE_KEYS.USER);
};

/**
 * 사용자 정보를 로컬 스토리지에 저장합니다.
 * @param user 저장할 사용자 정보
 */
export const saveUserToStorage = (user: User): void => {
  saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, user);
};

/**
 * 새로운 사용자 정보를 생성합니다.
 * @returns 새로운 사용자 정보
 */
export const createNewUser = (): User => {
  return {
    id: uuidv4(),
  };
};

/**
 * 사용자가 처음 방문했는지 확인하고, 필요한 경우 새 사용자를 생성합니다.
 * @returns 사용자 정보와 첫 방문 여부
 */
export const checkUserFirstVisit = (): { user: User; isFirstVisit: boolean } => {
  // 로컬 스토리지에서 사용자 정보 가져오기
  const existingUser = getUserFromStorage();

  // 사용자 정보가 있으면 기존 사용자로 간주
  if (existingUser) {
    return { user: existingUser, isFirstVisit: false };
  }

  // 사용자 정보가 없으면 새 사용자 생성 및 저장
  const newUser = createNewUser();
  saveUserToStorage(newUser);

  return { user: newUser, isFirstVisit: true };
};
