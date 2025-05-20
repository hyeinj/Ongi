'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import SkeletonQuestion from './SkeletonQuestion';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

interface StepContainerProps {
  children: ReactNode;
  // 스텝 변경 시에만 스켈레톤을 보여줄지 여부
  onlyInitialLoading?: boolean;
}

export default function StepContainer({
  children,
  onlyInitialLoading = false,
}: StepContainerProps) {
  const { smallText, largeText, isLoading } = useSelfEmpathy();
  const [showSkeleton, setShowSkeleton] = useState(true);

  // smallText와 largeText가 로드되면 스켈레톤 UI를 숨깁니다
  useEffect(() => {
    if (smallText && largeText) {
      setShowSkeleton(false);
    }
  }, [smallText, largeText]);

  // onlyInitialLoading이 true인 경우 초기 로딩에만 스켈레톤을 보여주고
  // 이후 로딩 상태에서는 스켈레톤 대신 기존 UI를 표시합니다
  const shouldShowSkeleton = onlyInitialLoading ? showSkeleton : showSkeleton || isLoading;

  return shouldShowSkeleton ? <SkeletonQuestion /> : <>{children}</>;
}
