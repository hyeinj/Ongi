'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import SkeletonQuestion from './SkeletonQuestion';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

interface StepContainerProps {
  children: ReactNode;
  // 스텝 변경 시에만 스켈레톤을 보여줄지 여부
  onlyInitialLoading?: boolean;
}

export default function StepContainer({ children }: StepContainerProps) {
  const { isLoading } = useSelfEmpathy();
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldShowSkeleton(true);
    } else {
      // isLoading이 false가 되면 0.3초 후에 스켈레톤을 숨깁니다
      const timer = setTimeout(() => {
        setShouldShowSkeleton(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return shouldShowSkeleton ? <SkeletonQuestion /> : <>{children}</>;
}
