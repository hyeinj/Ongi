'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import sendButton from '@/assets/icons/sendbutton.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '../../../presentation/hooks/useEmotion';

export default function Step7() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer } = useEmotion();

  useEffect(() => {
    // 이전에 저장된 답변이 있다면 불러오기
    const loadPreviousAnswer = async () => {
      const savedAnswer = await getStageAnswer('step7');
      if (savedAnswer) {
        setAnswer(savedAnswer);
      }
    };

    loadPreviousAnswer();
  }, [getStageAnswer]);

  const handleNext = async () => {
    if (!answer.trim()) return;

    try {
      await saveStageAnswer('step7', '어떤 하루로 기억될까요?', answer);
      router.push('/self-empathy/8');
    } catch (err) {
      console.error('Step7 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={6}
        totalStep={6}
        onBack={() => router.push('/self-empathy/6')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={6} totalStep={6} onBack={() => router.push('/self-empathy/6')}>
      <SelfEmpathyQuestion
        numbering={6}
        largeText="충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?"
      >
        <textarea
          className="answer-input step7"
          placeholder="답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button className="send-button" onClick={handleNext} disabled={isLoading || !answer.trim()}>
          {isLoading ? <span>저장 중...</span> : <Image src={sendButton} alt="완료" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
