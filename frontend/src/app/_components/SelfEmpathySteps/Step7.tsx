'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import StepContainer from './StepContainer';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step7() {
  const router = useRouter();
  const { smallText, largeText, userAnswer, setUserAnswer, generateEmpathy, isLoading } =
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

    try {
      await generateEmpathy();
      // 다음 페이지로 이동
      router.push('/self-empathy/8');
    } catch (error) {
      console.error('최종 결과 생성 중 오류:', error);
      alert('다음 단계로 넘어가는 중 오류가 발생했습니다.');
    }
  };

  return (
    <SelfEmpathyLayout currentStep={6} totalStep={6} onBack={() => router.push('/self-empathy/6')}>
      <StepContainer>
        <SelfEmpathyQuestion numbering={6} smallText={smallText} largeText={largeText}>
          <textarea
            className="answer-input step7"
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
      </StepContainer>
    </SelfEmpathyLayout>
  );
}
