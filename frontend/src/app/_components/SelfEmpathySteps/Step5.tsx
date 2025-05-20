'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step5() {
  const router = useRouter();
  const { smallText, largeText, userAnswer, setUserAnswer, generateNextQuestion, isLoading } =
    useSelfEmpathy();

  // 텍스트 영역 변경 핸들러
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };

  // 다음 버튼 클릭 핸들러
  const handleNextClick = async () => {
    if (!userAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    await generateNextQuestion();
    router.push('/self-empathy/6');
  };

  return (
    <SelfEmpathyLayout currentStep={4} totalStep={6} onBack={() => router.push('/self-empathy/4')}>
      <SelfEmpathyQuestion numbering={4} smallText={smallText} largeText={largeText}>
        <textarea
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
          value={userAnswer}
          onChange={handleTextAreaChange}
          disabled={isLoading}
        />
        <button
          className="next-button"
          onClick={handleNextClick}
          disabled={isLoading || !userAnswer.trim()}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
