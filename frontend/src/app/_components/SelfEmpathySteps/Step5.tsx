'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import SkeletonUI from './SkeletonUI';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '../../../presentation/hooks/useEmotion';
import { useDelayedLoading } from '../../../presentation/hooks/useDelayedLoading';

export default function Step5() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터의 질문
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || '질문을 불러올 수 없습니다.');
  const [answer, setAnswer] = useState('');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowSkeleton = useDelayedLoading(isLoading);

  useEffect(() => {
    // 이전에 저장된 답변이 있다면 불러오기
    const loadPreviousAnswer = async () => {
      const savedAnswer = await getStageAnswer('step5');
      if (savedAnswer) {
        setAnswer(savedAnswer);
      }
    };

    loadPreviousAnswer();

    // URL 파라미터로 전달된 질문이 있다면 설정
    if (urlQuestion) {
      setQuestion(urlQuestion);
    }
  }, [urlQuestion, getStageAnswer]);

  const handleNext = async () => {
    if (!answer.trim()) return;

    try {
      // 도메인 레이어를 통한 비즈니스 로직 처리
      await saveStageAnswer('step5', question, answer);
      router.push('/self-empathy/6');
    } catch (err) {
      console.error('Step5 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={4}
        totalStep={6}
        onBack={() => router.push('/self-empathy/4')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  // 로딩 상태 또는 지연 시간 동안 스켈레톤 UI 표시
  if (shouldShowSkeleton) {
    return (
      <SelfEmpathyLayout
        currentStep={4}
        totalStep={6}
        onBack={() => router.push('/self-empathy/4')}
      >
        <SkeletonUI type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={4} totalStep={6} onBack={() => router.push('/self-empathy/4')}>
      <SelfEmpathyQuestion
        numbering={4}
        smallText={question}
        largeText="짜증남의 느낌이 들었던 무지님의 속마음을 조금 더 말해주실 수 있나요?"
      >
        <textarea
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button className="next-button" onClick={handleNext} disabled={isLoading || !answer.trim()}>
          {isLoading ? <span>저장 중...</span> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
