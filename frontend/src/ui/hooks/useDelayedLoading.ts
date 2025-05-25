import { useState, useEffect } from 'react';

// 로딩 상태에 지연을 추가하는 훅
export const useDelayedLoading = (isLoading: boolean, delay: number = 500) => {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // 로딩이 시작되면 지연 후 스켈레톤 표시
      timeoutId = setTimeout(() => {
        setShouldShowSkeleton(true);
      }, delay);
    } else {
      // 로딩이 끝나면 즉시 스켈레톤 숨김
      setShouldShowSkeleton(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return shouldShowSkeleton;
}; 