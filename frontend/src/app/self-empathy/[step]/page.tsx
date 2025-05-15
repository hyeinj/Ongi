"use client"

import { useParams } from 'next/navigation';
import SelfEmpathyPage from '@/app/_components/SelfEmpathyPage';
import Step2 from '@/app/_components/SelfEmpathySteps/Step2';
import Step3 from '@/app/_components/SelfEmpathySteps/Step3';
import Step4 from '@/app/_components/SelfEmpathySteps/Step4';
// 컴포넌트 import 
export default function SelfEmpathyStepPage() {
  const params = useParams();
  const step = params.step as string;

  // step에 따라 다른 컴포넌트를 렌더링
  switch (step) {
    case '1':
      return <SelfEmpathyPage />;
    case '2':
      return <Step2 />;
    case '3':
      return <Step3 />;
    case '4':
      return <Step4 />;
    default:
      return null;
  }
}