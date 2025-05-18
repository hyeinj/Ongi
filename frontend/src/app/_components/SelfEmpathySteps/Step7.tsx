'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import sendButton from '@/assets/icons/sendbutton.png';

export default function Step7() {
  const router = useRouter();

  return (
    <SelfEmpathyLayout 
      currentStep={7}
      onBack={() => router.push('/self-empathy/6')}
    >
      <SelfEmpathyQuestion
        numbering={6}
        // smallText={`여기까지 오신 것만으로도 정말 대단해요!`}
        largeText="충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?"
      >
        <textarea 
          className="answer-input step7"
          placeholder="답변을 입력해주세요"
        />
        <button 
          className="send-button"
          onClick={() => router.push('/self-empathy/7')}
        >
          <Image src={sendButton} alt="완료" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
