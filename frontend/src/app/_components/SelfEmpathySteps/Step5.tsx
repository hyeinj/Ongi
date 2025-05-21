'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useState, useEffect } from 'react';

export default function Step5() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터의 질문 또는 localStorage에 저장된 질문을 사용
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || localStorage.getItem('step5Question') || '질문을 불러올 수 없습니다.');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    // URL 파라미터로 전달된 질문이 있다면 localStorage에 저장
    if (urlQuestion) {
      localStorage.setItem('step5Question', urlQuestion);
      setQuestion(urlQuestion);
    }

    // 이전에 저장된 답변이 있다면 불러오기
    const savedAnswer = localStorage.getItem('step5Answer');
    if (savedAnswer) {
      setAnswer(savedAnswer);
    }
  }, [urlQuestion]);

  const handleNext = () => {
    // 답변을 로컬 스토리지에 저장
    localStorage.setItem('step5Answer', answer);
    router.push('/self-empathy/6');
  };

  return (
    <SelfEmpathyLayout 
      currentStep={4}
      totalStep={6}
      onBack={() => router.push('/self-empathy/4')}
    >
      <SelfEmpathyQuestion
        numbering={4}
        smallText={question}
        largeText="짜증남의 느낌이 들었던 무지님의 속마음을 조금 더 말해주실 수 있나요?"
      >
        <textarea 
          className="answer-input step3"
          placeholder="답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button 
          className="next-button"
          onClick={handleNext}
          disabled={!answer.trim()}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 