'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import LoadingState from './LoadingState';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Step3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answer, setAnswer] = useState('');

  // URL 파라미터의 질문
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || '질문을 불러올 수 없습니다.');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, getStageAnswer, setIsLoading, saveStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading);

  useEffect(() => {
    // 이전에 저장된 답변이 있다면 불러오기
    const loadPreviousAnswer = async () => {
      const savedAnswer = await getStageAnswer('step3');
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
      setIsLoading(true);
      
      // localStorage에서 step2의 답변 가져오기
      const step2Answer = await getStageAnswer('step2');
      
      // 백엔드 API 호출
      const response = await fetch('/api/step3-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step1_answer: step2Answer || '',
          step2_answer: answer
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      // 답변과 질문 모두 로컬스토리지에 저장
      await saveStageAnswer('step3', question, answer);
      await saveStageAnswer('step4', data.question, '');
      
      // Step4로 질문을 URL 파라미터로 전달
      router.push(`/self-empathy/4?question=${encodeURIComponent(data.question)}`);
    } catch (err) {
      console.error('Step3 처리 실패:', err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={2}
        totalStep={5}
        onBack={() => router.push('/self-empathy/2')}
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
        currentStep={2}
        totalStep={5}
        onBack={() => router.push('/self-empathy/2')}
      >
        <LoadingState type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={2} totalStep={6} onBack={() => router.push('/self-empathy/2')}>
      <SelfEmpathyQuestion
        numbering={2}
        smallText={question}
        largeText="그럼, 그 일을 마주했을 때의 구체적인 상황이나 장면을 조금 더 들려주실 수 있을까요?"
      >
        <textarea
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
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
