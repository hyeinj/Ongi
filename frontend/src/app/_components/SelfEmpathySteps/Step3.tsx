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
  const question = searchParams.get('question') || '질문을 불러올 수 없습니다.';
  const [step3Answer, setStep3Answer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step2Answer, setStep2Answer] = useState('');

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 Step2의 답변을 가져옴
    const storedStep2Answer = localStorage.getItem('step2Answer');
    if (storedStep2Answer) {
      setStep2Answer(storedStep2Answer);
    }
  }, []);

  const handleNext = async () => {
    if (!step3Answer.trim()) return;
    
    setIsLoading(true);
    try {
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