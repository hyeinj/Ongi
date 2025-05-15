'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState } from 'react';

export default function Step6() {
  const router = useRouter();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  return (
    <SelfEmpathyLayout 
      currentStep={6}
      onBack={() => router.push('/self-empathy/5')}
    >
      <SelfEmpathyQuestion
        numbering={5}
        smallText={`스스로 준비를 미리 해두지 않은 자신에게 답답하고 화가나셨군요.`}
        largeText={
            <>
              무지님이 답답함과 짜증, 초조함을 느꼈던 이유 중 가장 큰 이유는
              <b> "시간이 촉박했기 때문" </b>
              이 맞을까요?
            </>
          }
      >
        <div className="yesno-btn-group">
          <button
            className={`yesno-btn${answer === 'yes' ? ' selected' : ''}`}
            onClick={() => setAnswer('yes')}
            type="button"
          >
            네 맞아요!
          </button>
          <button
            className={`yesno-btn${answer === 'no' ? ' selected' : ''}`}
            onClick={() => setAnswer('no')}
            type="button"
          >
            다른 이유인 것 같아요.
          </button>
        </div>
        <button 
          className="next-button"
          onClick={() => router.push('/self-empathy/7')}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 