'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';

export default function Step3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step3Answer, setStep3Answer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step2Answer, setStep2Answer] = useState('');

  // URL 파라미터의 질문 또는 localStorage에 저장된 질문을 사용
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || localStorage.getItem('step3Question') || '질문을 불러올 수 없습니다.');

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터 불러오기
    const storedStep2Answer = localStorage.getItem('step2Answer');
    const storedStep3Answer = localStorage.getItem('step3Answer');
    
    if (storedStep2Answer) {
      setStep2Answer(storedStep2Answer);
    }
    
    if (storedStep3Answer) {
      setStep3Answer(storedStep3Answer);
    }

    // URL 파라미터로 전달된 질문이 있다면 localStorage에 저장
    if (urlQuestion) {
      localStorage.setItem('step3Question', urlQuestion);
      setQuestion(urlQuestion);
    }
  }, [urlQuestion]);

  const handleNext = async () => {
    if (!step3Answer.trim()) return;
    
    setIsLoading(true);
    try {
      // 답변을 로컬 스토리지에 저장
      localStorage.setItem('step3Answer', step3Answer);

      const response = await fetch('http://localhost:8080/api/step3-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          step3Answer,
          step2Answer 
        }),
      });

      const data = await response.json();
      
      // 생성된 질문을 localStorage에 저장
      localStorage.setItem('step4Question', data.question);
      
      router.push(`/self-empathy/4?question=${encodeURIComponent(data.question)}`);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SelfEmpathyLayout 
      currentStep={2}
      totalStep={6}
      onBack={() => router.push('/self-empathy/2')}
    >
      <SelfEmpathyQuestion
        numbering={2}
        smallText={question}
        largeText="그럼 조금 더 자세하게, 그 순간 어떤 상황이었는지 들려주실 수 있을까요?"
      >
        <textarea 
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
          value={step3Answer}
          onChange={(e) => setStep3Answer(e.target.value)}
          disabled={isLoading}
        />
        <button 
          className="next-button"
          onClick={handleNext}
          disabled={isLoading || !step3Answer.trim()}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 