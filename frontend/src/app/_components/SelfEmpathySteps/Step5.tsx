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

export default function Step5() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터의 질문을 smallText와 largeText로 분리
  const urlQuestion = searchParams.get('question');
  const [smallText, setSmallText] = useState('');
  const [largeText, setLargeText] = useState("앞선 감정이 들었던 무지님의 속마음을 조금 더 말해주실 수 있나요?");
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading: emotionLoading, error, saveStageAnswer, getStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(emotionLoading);

  useEffect(() => {
    let isMounted = true;

    // 이전에 저장된 답변이 있다면 불러오기
    const loadPreviousAnswer = async () => {
      const savedAnswer = await getStageAnswer('step5');
      if (isMounted && savedAnswer) {
        setAnswer(savedAnswer);
      }
    };

    loadPreviousAnswer();

    // URL 파라미터로 전달된 질문을 smallText와 largeText로 분리
    if (urlQuestion) {
      const sentences = urlQuestion.split('\n').filter((s: string) => s.trim());
      if (isMounted) {
        if (sentences.length === 1) {
          setSmallText(sentences[0]);
          setLargeText('n무지님이 그 감정들을 느낀 데에는 어떤 이유가 있었을까요?\n 그 안에 어떤 바람이나 기대가 담겨있었을지도 몰라요');
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [urlQuestion, getStageAnswer]);

  const handleNext = async () => {
    if (!answer.trim()) return;

    try {
      setIsLoading(true);
      
      // localStorage에서 이전 단계의 답변 가져오기
      const step2Answer = await getStageAnswer('step2');
      const step3Answer = await getStageAnswer('step3');
      const step4Answer = await getStageAnswer('step4');
      
      // 백엔드 API 호출
      const response = await fetch('/api/step5-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step1_answer: step2Answer || '',
          step2_answer: step3Answer || '',
          step3Feelings: step4Answer || '',
          step4_answer: answer
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      // Step6에서 사용할 데이터 로컬스토리지에 저장
      await saveStageAnswer('step6', JSON.stringify({
        smallText: data.결과?.smallText || '',
        largeText: data.결과?.largeText || '',
        options: data.결과?.options || []
      }), '');
      
      // 도메인 레이어를 통한 비즈니스 로직 처리
      await saveStageAnswer('step5', '', answer);
      router.push('/self-empathy/6');
    } catch (err) {
      console.error('Step5 처리 실패:', err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={4}
        totalStep={5}
        onBack={() => router.push('/self-empathy/4')}
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
        currentStep={4}
        totalStep={5}
        onBack={() => router.push('/self-empathy/4')}
      >
        <LoadingState type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={4} totalStep={6} onBack={() => router.push('/self-empathy/4')}>
      <SelfEmpathyQuestion
        numbering={4}
        smallText={smallText}
        largeText={largeText}
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
