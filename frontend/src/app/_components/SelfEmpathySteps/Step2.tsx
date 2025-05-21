'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';

export default function Step2() {
  const router = useRouter();
  const [firstanswer, setFirstAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이전에 저장된 답변이 있다면 불러오기
    const savedAnswer = localStorage.getItem('step2Answer');
    if (savedAnswer) {
      setFirstAnswer(savedAnswer);
    }
  }, []);

  const handleNext = async () => {
    if (!firstanswer.trim()) return;
    
    setIsLoading(true);
    try {
      // 답변을 로컬 스토리지에 저장
      localStorage.setItem('step2Answer', firstanswer);
      
      const response = await fetch('http://localhost:8080/api/step2-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: firstanswer }),
      });

      const data = await response.json();
      
      // 생성된 질문을 localStorage에 저장
      localStorage.setItem('step3Question', data.question);
      
      router.push(`/self-empathy/3?question=${encodeURIComponent(data.question)}`);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SelfEmpathyLayout 
      currentStep={1}
      totalStep={6}
      onBack={() => router.push('/self-empathy/1')}
    >
      <SelfEmpathyQuestion
        numbering={1}
        smallText="무지님의 하루가 궁금해요."
        largeText="오늘, 가장 귀찮게 느껴졌던 건 무엇이었나요?"
      >
        <textarea 
          className="answer-input step2"
          placeholder="한 단어 혹은 한 문장으로 표현해보세요"
          value={firstanswer}
          onChange={e => setFirstAnswer(e.target.value)}
          disabled={isLoading}
        />
        <button 
          className="next-button"
          onClick={handleNext}
          disabled={isLoading || !firstanswer.trim()}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 