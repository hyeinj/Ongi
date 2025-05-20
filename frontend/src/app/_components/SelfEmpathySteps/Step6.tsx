'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import '@/styles/SelfEmpathyModal.css';
import { useState } from 'react';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step6() {
  const router = useRouter();
  const { smallText, largeText, setUserAnswer, generateNextQuestion, isLoading } = useSelfEmpathy();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleNext = async () => {
    if (!answer) {
      alert('예/아니오 중 하나를 선택해주세요.');
      return;
    }

    // 사용자 선택을 답변으로 저장
    setUserAnswer(answer === 'yes' ? '네 맞아요!' : '다른 이유인 것 같아요.');

    if (answer === 'yes') {
      await generateNextQuestion();
      router.push('/self-empathy/7');
    } else if (answer === 'no') {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async (buttonType: string) => {
    setSelectedButton(buttonType);

    // 모달에서의 선택도 답변에 추가
    const currentAnswer = answer === 'yes' ? '네 맞아요!' : '다른 이유인 것 같아요.';
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
      <SelfEmpathyQuestion numbering={5} smallText={smallText} largeText={largeText}>
        <div className="yesno-btn-group">
          <button
            className={`yesno-btn${answer === 'yes' ? ' selected' : ''}`}
            onClick={() => setAnswer('yes')}
            type="button"
            disabled={isLoading}
          >
            네 맞아요!
          </button>
          <button
            className={`yesno-btn${answer === 'no' ? ' selected' : ''}`}
            onClick={() => setAnswer('no')}
            type="button"
            disabled={isLoading}
          >
            다른 이유인 것 같아요.
          </button>
        </div>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={isLoading || answer === null}
        >
          <Image src={nextArrow} alt="다음" />
        </button>

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
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
