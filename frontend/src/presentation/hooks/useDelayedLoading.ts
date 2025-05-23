import { useState, useEffect } from 'react';

interface UseDelayedLoadingOptions {
  delay?: number; // 지연 시간 (밀리초), 기본값 300ms
}

/**
 * 로딩 완료 후 지정된 시간만큼 지연시켜서 스켈레톤 UI 표시를 관리하는 훅
 */
export function useDelayedLoading(
  isLoading: boolean,
  options: UseDelayedLoadingOptions = {}
): boolean {
  const { delay = 200 } = options;
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [isLoading, delay]);

  return isLoading || showSkeleton;
}
