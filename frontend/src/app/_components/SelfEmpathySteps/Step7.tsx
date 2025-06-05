'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import bottomButton from '@/assets/icons/bottombutton.png';
import { useState, useEffect } from 'react';
import { useEmotion } from '@/ui/hooks/useEmotion';
import paperPlane from '@/assets/icons/paper-plane.png';
import LoadingSpinner from '../common/LoadingSpinner';
import LoadingState from './LoadingState';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';

export default function Step7() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, getStageAnswer, generateStep7Question } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading || isGenerating);

  useEffect(() => {
    let isMounted = true;

    const loadPreviousData = async () => {
      try {
        // 이전에 저장된 답변이 있다면 불러오기
        const savedAnswer = await getStageAnswer('step7');
        if (isMounted && savedAnswer) {
          setAnswer(savedAnswer);
        }

        // GPT로 질문 생성
        const questionResult = await generateStep7Question();
        if (isMounted && questionResult.success) {
          setGeneratedQuestion(questionResult.question);
        } else if (isMounted) {
          // 실패 시 기본 질문 사용
          setGeneratedQuestion('충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?');
        }
        if (isMounted) {
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Step7 데이터 로딩 실패:', err);
        if (isMounted) {
          // 에러 시 기본 질문 사용
          setGeneratedQuestion('충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?');
          setIsGenerating(false);
        }
      }
    };

    loadPreviousData();

    return () => {
      isMounted = false;
    };
  }, [getStageAnswer, generateStep7Question]);

  const handleNext = async () => {
    if (!answer.trim()) return;

    try {
      await saveStageAnswer('step7', generatedQuestion || '어떤 하루로 기억될까요?', answer);
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

  // 로딩 상태 표시
  if (shouldShowLoading) {
    return (
      <SelfEmpathyLayout
        currentStep={6}
        totalStep={6}
        onBack={() => router.push('/self-empathy/6')}
      >
        <LoadingState type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={6} totalStep={6} onBack={() => router.push('/self-empathy/6')}>
      <SelfEmpathyQuestion
        numbering={6}
        largeText={generatedQuestion}
      >
        <textarea
          className="answer-input step7"
          placeholder="답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button 
          className="bottom-button" 
          onClick={handleNext} 
          disabled={isLoading || !answer.trim()}
        >
          {isLoading ? <LoadingSpinner size="large" color="white" /> : <Image src={bottomButton} alt="완료" />}
          <span className="button-text">
            <Image src={paperPlane} alt="전송" className="paper-plane"/>전송하기
          </span>
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
