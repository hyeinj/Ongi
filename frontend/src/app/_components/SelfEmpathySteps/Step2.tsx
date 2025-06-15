'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import LoadingState from './LoadingState';
import LoadingSpinner from '../common/LoadingSpinner';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';

export default function Step2() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  const { isLoading, error, getStageAnswer, setIsLoading, saveStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading);


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
      setIsLoading(true);
      
      // 백엔드 API 호출
      const response = await fetch('/api/step2-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step1_answer: answer
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      // 답변과 질문 모두 로컬스토리지에 저장
      await saveStageAnswer('step2', '오늘, 조용히 마음이 무거워졌던 때가 있다면 어떤 순간이었을까요?', answer);
      await saveStageAnswer('step3', data.question, '');
      
      // Step3로 질문을 URL 파라미터로 전달
      router.push(`/self-empathy/3?question=${encodeURIComponent(data.question)}`);
    } catch (err) {
      console.error('Step2 처리 실패:', err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
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

  // 로딩 상태 표시
  if (shouldShowLoading) {
    return (
      <SelfEmpathyLayout
        currentStep={1}
        totalStep={5}
        onBack={() => router.push('/self-empathy')}
      >
        <LoadingState 
          type="question"
        />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={1} totalStep={5} onBack={() => router.push('/self-empathy/1')}>
      <SelfEmpathyQuestion
        numbering={1}
        smallText="무지님의 하루가 궁금해요."
        largeText="오늘, 조용히 마음이 무거워졌던 때가 있다면 어떤 순간이었을까요?"
      >
        <textarea
          className="answer-input step2"
          placeholder="한 단어 혹은 한 문장으로 표현해보세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button className="next-button" onClick={handleNext} disabled={isLoading || !answer.trim()}>
          {isLoading ? <LoadingSpinner size="large" color="white" /> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
