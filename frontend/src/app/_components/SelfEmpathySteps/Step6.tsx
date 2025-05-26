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
import LoadingSpinner from '../common/LoadingSpinner';

export default function Step6() {
  const router = useRouter();
  const [answer, setAnswer] = useState<'yes' | 'no' | string | null>(null);
  const [smallText, setSmallText] = useState('');
  const [largeText, setLargeText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [textsLoading, setTextsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'skip' | 'think' | null>(null);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer, generateStep6Texts } = useEmotion();

  useEffect(() => {
    // 이전에 저장된 답변과 텍스트 불러오기
    const loadPreviousData = async () => {
      try {
        setTextsLoading(true);
        
        // 이전에 저장된 답변이 있다면 불러오기
        const savedAnswer = await getStageAnswer('step6');
        if (savedAnswer) {
          setAnswer(savedAnswer);
        }

        // GPT로 텍스트와 선택지 생성
        const textsResult = await generateStep6Texts();
        if (textsResult.success) {
          setSmallText(textsResult.smallText);
          setLargeText(textsResult.largeText);
          setOptions(textsResult.options || []);
        } else {
          // 실패 시 기본 텍스트 사용
          setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
          setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
          setOptions([
            '상황이 예상과 달랐기 때문',
            '준비가 부족했다고 느꼈기 때문',
            '다른 사람의 반응이 걱정되었기 때문'
          ]);
        }
      } catch (err) {
        console.error('Step6 데이터 로딩 실패:', err);
        // 에러 시 기본 텍스트 사용
        setSmallText('힘든 상황에서 여러 감정을 느끼셨군요.');
        setLargeText('그 감정을 느낀 가장 큰 이유가 무엇인지 생각해보실까요?');
        setOptions([
          '상황이 예상과 달랐기 때문',
          '준비가 부족했다고 느꼈기 때문',
          '다른 사람의 반응이 걱정되었기 때문'
        ]);
      } finally {
        setTextsLoading(false);
      }
    };

    loadPreviousData();
  }, [getStageAnswer, generateStep6Texts]);

  const handleAnswerClick = (selectedAnswer: string) => {
    // 모든 버튼은 바로 답변 설정
    setAnswer(selectedAnswer);
  };

  const handleConfirm = (buttonType: 'skip' | 'think') => {
    setSelectedButton(buttonType);
    setShowModal(false);
    // 모달에서 선택 후 다음 단계로 이동
    setTimeout(() => {
      router.push('/self-empathy/7');
    }, 300);
  };

  const handleNext = async () => {
    if (!answer) return;

    try {
      await saveStageAnswer('step6', largeText || '감정의 원인에 대한 질문', answer);
      
      // "다른 이유인 것 같아요" 선택 시만 모달 표시
      if (answer === 'no') {
        setShowModal(true);
        setSelectedButton(null);
      } else {
        // "네 맞아요" 및 GPT 생성 선택지들은 바로 다음 단계로
        router.push('/self-empathy/7');
      }
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
        <div className="yesno-btn-group2">
          {/* 네 맞아요 버튼 */}
          <button
            className={`yesno-btn2 ${answer === 'yes' ? ' selected' : ''}`}
            onClick={() => handleAnswerClick('yes')}
            type="button"
            disabled={isLoading}
          >
            네 맞아요!
          </button>
          
          {/* GPT 생성 선택지들 */}
          {options.map((option, index) => (
            <button
              key={index}
              className={`yesno-btn2${answer === option ? ' selected' : ''}`}
              onClick={() => handleAnswerClick(option)}
              type="button"
              disabled={isLoading}
            >
              {option}
            </button>
          ))}
          
          {/* 다른 이유 버튼 */}
          <button
            className={`yesno-btn2${answer === 'no' ? ' selected' : ''}`}
            onClick={() => handleAnswerClick('no')}
            type="button"
            disabled={isLoading}
          >
            다른 이유인 것 같아요.
          </button>
        </div>

        {/* 확인 모달 */}
        {showModal && (
          <div className="confirm-modal">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowModal(false)}>
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
        
        <button className="next-button" onClick={handleNext} disabled={isLoading || !answer}>
          {isLoading ? <LoadingSpinner size="large" color="white" /> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
