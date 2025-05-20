import { useEffect, useState } from 'react';
import { User } from '../entity';
import { checkUserFirstVisit } from './userStorage';

/**
 * 사용자의 첫 방문 여부를 확인하는 훅
 * @returns {Object} 사용자 정보, 첫 방문 여부, 로딩 상태
 */
export const useUserCheck = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      try {
        const { user: checkedUser, isFirstVisit: isFirstTime } = checkUserFirstVisit();
        setUser(checkedUser);
        setIsFirstVisit(isFirstTime);
      } catch (error) {
        console.error('사용자 확인 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  return { user, isFirstVisit, isLoading };
};
