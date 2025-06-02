import { useState, useEffect } from 'react';

// 로딩 상태에 지연을 추가하는 훅
export const useDelayedLoading = (isLoading: boolean, delay: number = 0) => {
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // 로딩이 시작되면 즉시 로딩 상태 표시 (delay = 0)
      timeoutId = setTimeout(() => {
        setShouldShowLoading(true);
      }, delay);
    } else {
      // 로딩이 끝나면 즉시 로딩 상태 숨김
      setShouldShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return shouldShowLoading;
}; 