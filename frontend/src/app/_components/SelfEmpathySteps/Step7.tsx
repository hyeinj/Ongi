'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import sendButton from '@/assets/icons/sendbutton.png';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step7() {
  const router = useRouter();
  const { largeText, userAnswer, setUserAnswer, generateEmpathy, isLoading } = useSelfEmpathy();

  // 텍스트 영역 변경 핸들러
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };

  // 완료 버튼 클릭 핸들러
  const handleCompleteClick = async () => {
    if (!userAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    // 마지막 질문에 대한 답변을 저장하고 공감 메시지 생성
    await generateEmpathy();
    router.push('/self-empathy/8');
  };

  return (
    <SelfEmpathyLayout currentStep={6} totalStep={6} onBack={() => router.push('/self-empathy/6')}>
      <SelfEmpathyQuestion
        numbering={6}
        // smallText={`여기까지 오신 것만으로도 정말 대단해요!`}
        largeText={largeText}
      >
        <textarea
          className="answer-input step7"
          placeholder="답변을 입력해주세요"
          value={userAnswer}
          onChange={handleTextAreaChange}
          disabled={isLoading}
        />
        <button
          className="send-button"
          onClick={handleCompleteClick}
          disabled={isLoading || !userAnswer.trim()}
        >
          <Image src={sendButton} alt="완료" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
