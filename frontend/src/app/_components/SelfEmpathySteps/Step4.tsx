'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';

export default function Step4() {
  const router = useRouter();

  return (
    <SelfEmpathyLayout 
      currentStep={4}
      onBack={() => router.push('/self-empathy/3')}
    >
      <SelfEmpathyQuestion
        numbering={3}
        smallText={`정리되지 않은 옷더미를 마주하는 상황이 참 번거로우셨겠어요. \n 그럼 우리 한 발짝 물러나서 감정을 살펴볼게요.`}
        largeText="그때의 상황을 떠올렸을 때, 무지님이 느꼈던 감정을 모두 골라주세요"
      >
        <button 
          className="next-button"
          onClick={() => router.push('/self-empathy/5')}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 