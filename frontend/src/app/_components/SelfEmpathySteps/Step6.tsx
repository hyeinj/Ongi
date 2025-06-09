'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import LoadingState from './LoadingState';
import nextArrow from '@/assets/icons/next-arrow.png';
import '@/styles/SelfEmpathyModal.css';
import { useState, useEffect } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';
import LoadingSpinner from '../common/LoadingSpinner';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';

export default function Step6() {
  const router = useRouter();
  const [answer, setAnswer] = useState<string[]>([]);
  const [smallText, setSmallText] = useState('');
  const [largeText, setLargeText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer, generateStep6Texts } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading || isGenerating);

  useEffect(() => {
    let isMounted = true;

    const loadPreviousData = async () => {
      if (isDataLoaded) return; // 이미 데이터가 로드되었다면 실행하지 않음

      try {
        // Step5에서 저장한 Step6 데이터 불러오기
        const step6Data = await getStageAnswer('step6');
        if (isMounted && step6Data) {
          try {
            const parsed = JSON.parse(step6Data);
            setSmallText(parsed.smallText || '');
            setLargeText(parsed.largeText || '');
            setOptions(parsed.options || []);
            setIsGenerating(false);
            setIsDataLoaded(true);
            return;
          } catch {
            // 파싱 실패 시 아래 로직으로 진행
          }
        }

        // 이전에 저장된 답변이 있다면 불러오기
        const savedAnswer = await getStageAnswer('step6');
        if (isMounted && savedAnswer) {
          setAnswer(Array.isArray(savedAnswer) ? savedAnswer : [savedAnswer]);
        }

        // GPT로 텍스트와 선택지 생성
        const textsResult = await generateStep6Texts();
        if (isMounted && textsResult.success) {
          setSmallText(textsResult.smallText);
          setLargeText(textsResult.largeText);
          setOptions(textsResult.options || []);
        } else if (isMounted) {
          // 실패 시 기본 텍스트 사용
          setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
          setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
          setOptions([
            '상황이 예상과 달랐기 때문',
            '준비가 부족했다고 느꼈기 때문',
            '다른 사람의 반응이 걱정되었기 때문'
          ]);
        }
        if (isMounted) {
          setIsGenerating(false);
          setIsDataLoaded(true); // 데이터 로드 완료 표시
        }
      } catch (err) {
        console.error('Step6 데이터 로딩 실패:', err);
        if (isMounted) {
          // 에러 시 기본 텍스트 사용
          setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
          setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
          setOptions([
            '상황이 예상과 달랐기 때문',
            '준비가 부족했다고 느꼈기 때문',
            '다른 사람의 반응이 걱정되었기 때문'
          ]);
          setIsGenerating(false);
          setIsDataLoaded(true); // 에러 시에도 데이터 로드 완료 표시
        }
      }
    };

    loadPreviousData();

    return () => {
      isMounted = false;
    };
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시 한 번만 실행

  const handleAnswerClick = (selectedAnswer: string) => {
    setAnswer(prev => {
      if (prev.includes(selectedAnswer)) {
        // 이미 선택된 답변이면 제거
        return prev.filter(item => item !== selectedAnswer);
      } else {
        // 새로운 답변이면 추가
        return [...prev, selectedAnswer];
      }
    });
  };

  const handleConfirm = () => {
    setShowModal(false);
    // 모달에서 선택 후 다음 단계로 이동
    setTimeout(() => {
      router.push('/self-empathy/8');
    }, 300);
  };

  const handleNext = async () => {
    if (answer.length === 0) return;

    try {
      // 배열을 문자열로 변환하여 저장
      await saveStageAnswer('step6', largeText || '감정의 원인에 대한 질문', answer.join(', '));
      
      // 모든 버튼 클릭 시 모달 표시
      setShowModal(true);
    } catch (err) {
      console.error('Step6 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

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
          {/* 네 맞아요 버튼 */}
          {/* <button
            className={`yesno-btn2 ${answer === 'yes' ? ' selected' : ''}`}
            onClick={() => handleAnswerClick('yes')}
            type="button"
            disabled={isLoading}
          >
            네 맞아요!
          </button> */}
          
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
              {/* <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button> */}
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
                <button
                  className="modal-btn"
                  onClick={handleConfirm}
                >
                  충분히 생각해보았어요
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button className="next-button" onClick={handleNext} disabled={isLoading || answer.length === 0}>
          {isLoading ? <LoadingSpinner size="large" color="white" /> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
