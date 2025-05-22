'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '../../../presentation/hooks/useEmotion';

export default function Step3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answer, setAnswer] = useState('');

  // URL 파라미터의 질문
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || '질문을 불러올 수 없습니다.');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStep3AndGenerateStep4, getStageAnswer } = useEmotion();

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
      // 도메인 레이어를 통한 비즈니스 로직 처리
      const nextQuestion = await saveStep3AndGenerateStep4(question, answer);

      if (nextQuestion) {
        router.push(`/self-empathy/4?question=${encodeURIComponent(nextQuestion)}`);
      } else {
        throw new Error('질문 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Step3 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={2}
        totalStep={6}
        onBack={() => router.push('/self-empathy/2')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={2} totalStep={6} onBack={() => router.push('/self-empathy/2')}>
      <SelfEmpathyQuestion
        numbering={2}
        smallText={question}
        largeText="그럼 조금 더 자세하게, 그 순간 어떤 상황이었는지 들려주실 수 있을까요?"
      >
        <textarea
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
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
