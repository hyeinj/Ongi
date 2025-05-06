import React from 'react';
import { notFound } from 'next/navigation';

// [step]으로 다이나믹 세그먼트
// 그거 받아서 1 이면 _components/SelfEmpathyPage 폴더에 있는 파일 렌더링
// 2 이면 _components/SelfEmpathyStep2Page 폴더에 있는 파일 렌더링

// 컴포넌트 import 
import SelfEmpathyPage from '@/app/_components/SelfEmpathyPage';
import SelfEmpathyStep2Page from '@/app/_components/SelfEmpathyStep2Page';

interface PageProps {
  params: {
    step: string;
  };
}

export default function Page({ params }: PageProps) {
  const step = params.step;

  // step에 따라 다른 컴포넌트 렌더링
  switch (step) {
    case '1':
      return <SelfEmpathyPage />;
    case '2':
      return <SelfEmpathyStep2Page />;
    default:
      notFound(); // 유효하지 않은 step인 경우 404 페이지로 리다이렉트
  }
}




