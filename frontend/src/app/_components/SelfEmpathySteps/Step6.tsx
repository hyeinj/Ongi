'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import LoadingState from './LoadingState';
import nextArrow from '@/assets/icons/next-arrow.png';
import '@/styles/SelfEmpathyModal.css';
import { useState, useEffect, useCallback } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';
import LoadingSpinner from '../common/LoadingSpinner';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';

export default function Step6() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answer, setAnswer] = useState<string[]>([]);
  const [smallText, setSmallText] = useState('');
  const [largeText, setLargeText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading || isGenerating);

  useEffect(() => {
    const loadStep6Data = async () => {
      if (isDataLoaded) return;
      try {
        // URL 파라미터에서 데이터 가져오기
        const urlSmallText = searchParams.get('smallText');
        const urlLargeText = searchParams.get('largeText');
        const urlOptions = searchParams.get('options');

        if (urlSmallText && urlLargeText && urlOptions) {
          setSmallText(urlSmallText);
          setLargeText(urlLargeText);
          setOptions(JSON.parse(urlOptions));
        } else {
          // URL 파라미터가 없는 경우 (직접 접근 등) localStorage에서 데이터 가져오기
          const savedData = await getStageAnswer('step6');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSmallText(parsedData.smallText || '');
            setLargeText(parsedData.largeText || '');
            setOptions(parsedData.options || []);
          }
        }

        setIsGenerating(false);
        setIsDataLoaded(true);
      } catch (err) {
        console.error('Step6 데이터 로딩 실패:', err);
        setSmallText('질문을 불러오지 못했습니다.');
        setLargeText('다시 시도해 주세요.');
        setOptions([]);
        setIsGenerating(false);
        setIsDataLoaded(true);
      }
    };

    loadStep6Data();
  }, [searchParams, getStageAnswer, isDataLoaded]);

  const handleAnswerClick = useCallback((selectedAnswer: string) => {
    setAnswer(prev => {
      if (prev.includes(selectedAnswer)) {
        // 이미 선택된 답변이면 제거
        return prev.filter((item) => item !== selectedAnswer);
      } else {
        // 새로운 답변이면 추가
        return [...prev, selectedAnswer];
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setShowModal(false);
    // 모달에서 선택 후 다음 단계로 이동
    setTimeout(() => {
      router.push('/self-empathy/8');
    }, 300);
  }, [router]);

  const handleNext = useCallback(async () => {
    if (answer.length === 0) return;

    try {
      // 배열을 문자열로 변환하여 저장
      await saveStageAnswer('step6', smallText, answer.join(', '));
      // 모든 버튼 클릭 시 모달 표시
      setShowModal(true);
    } catch (err) {
      console.error('Step6 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [answer, smallText, saveStageAnswer, setShowModal]);

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={5}
        totalStep={5}
        onBack={() => router.push('/self-empathy/5')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  // 로딩 상태 표시
  if (shouldShowLoading) {
    return (
      <SelfEmpathyLayout
        currentStep={5}
        totalStep={5}
        onBack={() => router.push('/self-empathy/5')}
      >
        <LoadingState type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={5} totalStep={5} onBack={() => router.push('/self-empathy/5')}>
      <SelfEmpathyQuestion numbering={5} smallText={smallText} largeText={largeText}>
        <div className="yesno-btn-group2">
          {/* GPT 생성 선택지들 */}
          {options.map((option, index) => (
            <button
              key={index}
              className={`yesno-btn2${answer.includes(option) ? ' selected' : ''}`}
              onClick={() => handleAnswerClick(option)}
              type="button"
              disabled={isLoading}
            >
              {option}
            </button>
          ))}

          {/* 다른 이유 버튼 */}
          <button
            className={`yesno-btn2${answer.includes('no') ? ' selected' : ''}`}
            onClick={() => handleAnswerClick('no')}
            type="button"
            disabled={isLoading}
          >
            내 마음 속 말은 다른 것 같아요.
          </button>
        </div>

        {/* 확인 모달 */}
        {showModal && (
          <div className="confirm-modal">
            <div className="modal-content">
              <div className="modal-title">내 마음 속 말 들여다보기</div>
              <div className="modal-desc">
                이 말이 당신에게 어떤 의미로 다가오는지,
                <br />
                조심스레 생각해볼까요?
                <br />
                평소 자주 떠올리는 말일 수도, 나에게 힘이 되는 말일 수도,
                <br />
                아직은 어색하지만 어딘가 마음에 닿는 말일 수도 있어요.
              </div>
              <div className="modal-btn-group">
                <button className="modal-btn" onClick={handleConfirm}>
                  충분히 생각해보았어요
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="next-button"
          onClick={handleNext}
          disabled={isLoading || answer.length === 0}
        >
          {isLoading ? (
            <LoadingSpinner size="large" color="white" />
          ) : (
            <Image src={nextArrow} alt="다음" />
          )}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
