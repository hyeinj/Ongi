'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';

export default function Step3() {
  const router = useRouter();

  return (
    <SelfEmpathyLayout 
      currentStep={3}
      onBack={() => router.push('/self-empathy/2')}
    >
      <SelfEmpathyQuestion
        numbering={2}
        smallText={`솔직하게 나눠주셔서 감사해요
아침에 옷을 고르는 일에 귀찮음을 느끼셨군요.`}
        largeText="그럼 조금 더 자세하게, 그 순간 어떤 상황이었는지 들려주실 수 있을까요?"
      >
          <textarea 
            className="answer-input step3"
            placeholder="답변을 입력해주세요"
          />
        <button 
            className="next-button"
            onClick={() => router.push('/self-empathy/4')}
          >
            <Image src={nextArrow} alt="다음" />
          </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 