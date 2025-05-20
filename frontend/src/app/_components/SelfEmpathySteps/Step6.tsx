'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import StepContainer from './StepContainer';
import nextArrow from '@/assets/icons/next-arrow.png';
import '@/styles/SelfEmpathyModal.css';
import { useState } from 'react';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step6() {
  const router = useRouter();
  const { smallText, largeText, userAnswer, setUserAnswer, generateNextQuestion, isLoading } =
    useSelfEmpathy();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

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
    router.push('/self-empathy/7');
  };

  const handleConfirm = async (buttonType: string) => {
    setSelectedButton(buttonType);

    // 모달에서의 선택도 답변에 추가
    const currentAnswer = userAnswer;
    const modalAnswer = buttonType === 'skip' ? '넘어갈래요.' : '충분히 생각해 본 것 같아요.';
    setUserAnswer(`${currentAnswer} ${modalAnswer}`);

    // 다음 질문 생성
    await generateNextQuestion();

    setTimeout(() => {
      setShowConfirm(false);
      router.push('/self-empathy/7');
    }, 700);
  };

  return (
    <SelfEmpathyLayout currentStep={5} totalStep={6} onBack={() => router.push('/self-empathy/5')}>
      <StepContainer>
        <SelfEmpathyQuestion numbering={5} smallText={smallText} largeText={largeText}>
          <textarea
            className="answer-input"
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

      {showConfirm && (
        <div className="confirm-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowConfirm(false)}>
              ×
            </button>
            <div className="modal-title">내 마음의 이유 찾아보기</div>
            <div className="modal-desc">
              표면적으로 느꼈던 감정과 진짜 이유가 다를군요.
              <br />
              짜증을 느낀 그 순간으로 돌아가
              <br />
              앞뒤 상황을 생각해볼까요?
            </div>
            <div className="modal-btn-group">
              <button
                className={`modal-btn${selectedButton === 'skip' ? ' active' : ''}`}
                onClick={() => handleConfirm('skip')}
                disabled={isLoading}
              >
                넘어갈래요
              </button>
              <button
                className={`modal-btn${selectedButton === 'think' ? ' active' : ''}`}
                onClick={() => handleConfirm('think')}
                disabled={isLoading}
              >
                충분히 생각해 본 것 같아요
              </button>
            </div>
          </div>
        </div>
      )}
    </SelfEmpathyLayout>
  );
}
