'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import SkeletonUI from './SkeletonUI';
import nextArrow from '@/assets/icons/next-arrow.png';
import '@/styles/SelfEmpathyModal.css';
import { useState, useEffect } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';

export default function Step6() {
  const router = useRouter();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [smallText, setSmallText] = useState('');
  const [largeText, setLargeText] = useState('');
  const [textsLoading, setTextsLoading] = useState(true);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer, generateStep6Texts } = useEmotion();

  useEffect(() => {
    const loadDataAndGenerateTexts = async () => {
      try {
        setTextsLoading(true);

        // Step6 텍스트 생성
        const textsResult = await generateStep6Texts();
        if (textsResult && textsResult.success) {
          setSmallText(textsResult.smallText);
          setLargeText(textsResult.largeText);
        } else {
          // 실패 시 기본 텍스트 사용
          setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
          setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
        }

        // 이전에 저장된 답변이 있다면 불러오기
        const savedAnswer = await getStageAnswer('step6');
        if (savedAnswer === '네 맞아요!' || savedAnswer === '다른 이유인 것 같아요.') {
          setAnswer(savedAnswer === '네 맞아요!' ? 'yes' : 'no');
        }
      } catch (err) {
        console.error('Step6 데이터 로드 실패:', err);
        setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
        setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
      } finally {
        setTextsLoading(false);
      }
    };

    loadDataAndGenerateTexts();
  }, [getStageAnswer, generateStep6Texts]);

  const handleNext = async () => {
    if (!answer) return;

    try {
      const answerText = answer === 'yes' ? '네 맞아요!' : '다른 이유인 것 같아요.';
      await saveStageAnswer('step6', largeText, answerText);

      if (answer === 'yes') {
        router.push('/self-empathy/7');
      } else if (answer === 'no') {
        setShowConfirm(true);
      }
    } catch (err) {
      console.error('Step6 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleConfirm = (buttonType: string) => {
    setSelectedButton(buttonType);
    setTimeout(() => {
      setShowConfirm(false);
      router.push('/self-empathy/7');
    }, 700);
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={5}
        totalStep={6}
        onBack={() => router.push('/self-empathy/5')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  // 텍스트 로딩 중일 때
  if (textsLoading) {
    return (
      <SelfEmpathyLayout
        currentStep={5}
        totalStep={6}
        onBack={() => router.push('/self-empathy/5')}
      >
        <SkeletonUI type="card" />
      </SelfEmpathyLayout>
    );
  }

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
        <button className="next-button" onClick={handleNext} disabled={isLoading || !answer}>
          {isLoading ? <span>저장 중...</span> : <Image src={nextArrow} alt="다음" />}
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
                >
                  넘어갈래요
                </button>
                <button
                  className={`modal-btn${selectedButton === 'think' ? ' active' : ''}`}
                  onClick={() => handleConfirm('think')}
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
