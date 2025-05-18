'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';

export default function Step2() {
  const router = useRouter();

  return (
    <SelfEmpathyLayout 
      currentStep={2}
      onBack={() => router.push('/self-empathy/1')}
    >
      <SelfEmpathyQuestion
        numbering={1}
        smallText="무지님의 하루가 궁금해요."
        largeText="오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?"
      >
        <textarea 
          className="answer-input step2"
          placeholder="한 단어 혹은 한 문장으로 표현해보세요"
        />
        <button 
            className="next-button"
            onClick={() => router.push('/self-empathy/3')}
          >
            <Image src={nextArrow} alt="다음" />
          </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 