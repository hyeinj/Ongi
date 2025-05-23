'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import SkeletonUI from './SkeletonUI';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '../../../presentation/hooks/useEmotion';
import { useDelayedLoading } from '../../../presentation/hooks/useDelayedLoading';

export default function Step2() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStep2AndGenerateStep3, getStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowSkeleton = useDelayedLoading(isLoading);

  useEffect(() => {
    // 이전에 저장된 답변이 있다면 불러오기
    const loadPreviousAnswer = async () => {
      const savedAnswer = await getStageAnswer('step2');
      if (savedAnswer) {
        setAnswer(savedAnswer);
      }
    };

    loadPreviousAnswer();
  }, [getStageAnswer]);

  const handleNext = async () => {
    if (!answer.trim()) return;

    try {
      // 도메인 레이어를 통한 비즈니스 로직 처리
      const nextQuestion = await saveStep2AndGenerateStep3(answer);

      if (nextQuestion) {
        // URL에 질문을 포함하여 다음 페이지로 이동
        router.push(`/self-empathy/3?question=${encodeURIComponent(nextQuestion)}`);
      } else {
        throw new Error('질문 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Step2 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={1}
        totalStep={6}
        onBack={() => router.push('/self-empathy/1')}
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
        currentStep={1}
        totalStep={6}
        onBack={() => router.push('/self-empathy/1')}
      >
        <SkeletonUI type="card" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={1} totalStep={6} onBack={() => router.push('/self-empathy/1')}>
      <SelfEmpathyQuestion
        numbering={1}
        smallText="무지님의 하루가 궁금해요."
        largeText="오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?"
      >
        <textarea
          className="answer-input step2"
          placeholder="한 단어 혹은 한 문장으로 표현해보세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button className="next-button" onClick={handleNext} disabled={isLoading || !answer.trim()}>
          {isLoading ? <span>질문 생성 중...</span> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
