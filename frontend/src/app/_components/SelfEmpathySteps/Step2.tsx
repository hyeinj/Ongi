'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import StepContainer from './StepContainer';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step2() {
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
    router.push('/self-empathy/3');
  };

  return (
    <SelfEmpathyLayout currentStep={1} totalStep={6} onBack={() => router.push('/self-empathy/1')}>
      <StepContainer>
        <SelfEmpathyQuestion numbering={1} smallText={smallText} largeText={largeText}>
          <textarea
            className="answer-input step2"
            placeholder="한 단어 혹은 한 문장으로 표현해보세요"
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
      </StepContainer>
    </SelfEmpathyLayout>
  );
}
