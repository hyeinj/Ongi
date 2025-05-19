'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';

export default function Step5() {
  const router = useRouter();

  return (
    <SelfEmpathyLayout 
      currentStep={4}
      totalStep={6}
      onBack={() => router.push('/self-empathy/4')}
    >
      <SelfEmpathyQuestion
        numbering={4}
        smallText={`귀찮은 것을 마주했을 때, 무지님의 마음이 많이 복잡했을 것 같아요.`}
        largeText="짜증남의 느낌이 들었던 무지님의 속마음을 조금 더 말해주실 수 있나요?"
      >
        <textarea 
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
        />
        <button 
          className="next-button"
          onClick={() => router.push('/self-empathy/6')}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 