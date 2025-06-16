'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import LoadingState from './LoadingState';
import mailBox from '@/assets/images/mailbox.png';
import '@/styles/SelfEmpathyFinal.css';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useEmotion } from '@/ui/hooks/useEmotion';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';
import { Category, EmotionType } from '@/core/entities/emotion';

// 카테고리와 감정 변환 규칙 함수
function transformCategoryAndEmotion(
  category: Category,
  emotion: EmotionType
): { category: Category; emotion: EmotionType } {
  let newCategory = category;
  let newEmotion = emotion;

  // routine일 때 joy 이외 감정은 모두 self로 변환
  if (category === 'routine' && emotion !== 'joy') {
    newCategory = 'self';
  }

  // growth일 때 anxiety, sadness 이외 감정은 모두 self로 변환
  if (category === 'growth' && emotion !== 'anxiety' && emotion !== 'sadness') {
    newCategory = 'relate';
  }

  // self일 때 joy이면 routine으로 변환
  if (category === 'self' && emotion === 'joy') {
    newCategory = 'routine';
  }

  // self일 때 감정이 peace일 때 relate가 아니면 모두 relate로 변환
  if (emotion === 'peace' && category !== 'relate' && category !== 'self') {
    newCategory = 'self';
  }

  if (emotion === 'anger') {
    newEmotion = 'anxiety';
  }

  return { category: newCategory, emotion: newEmotion };
}

export default function Step8() {
  const router = useRouter();
  const [finalCardText, setFinalCardText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState(null);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, getStageAnswer, updateCategoryAndEmotion, saveAIFeedback } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading || isGenerating);

  useEffect(() => {
    const performSummary = async () => {
      try {
        // 이전 단계 답변 불러오기
        const step2Answer = await getStageAnswer('step2');
        const step3Answer = await getStageAnswer('step3');
        const step4Answer = await getStageAnswer('step4');
        const step5Answer = await getStageAnswer('step5');
        const step6Answer = await getStageAnswer('step6');

        // step4는 감정들, step5는 이유, step6은 마음 속 말(선택지)
        // step3Feelings는 step4의 답변, step4_answer는 step5의 답변, step5_answer는 step6의 답변
        const response = await fetch('/api/self-emapthy-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step1_answer: step2Answer || '',
            step2_answer: step3Answer || '',
            step3Feelings: step4Answer || '',
            step4_answer: step5Answer || '',
            step5_answer: step6Answer || '',
          }),
        });

        if (!response.ok) {
          setFinalCardText('요약을 불러오지 못했습니다. 다시 시도해 주세요.');
          setIsGenerating(false);
          return;
        }

        const data = await response.json();
        setFinalCardText(data.summary || '요약을 불러오지 못했습니다.');
        setIsGenerating(false);

        // 카테고리/감정 결과를 받아서 localStorage에 저장
        const categoryResponse = await fetch('/api/self-emapthy-summary/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step1_answer: step2Answer || '',
            step2_answer: step3Answer || '',
            step3Feelings: step4Answer || '',
            step4_answer: step5Answer || '',
            step5_answer: step6Answer || '',
          }),
        });

        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          if (categoryData.categoryResult) {
            // 카테고리와 감정 변환 규칙 적용
            const transformedResult = transformCategoryAndEmotion(
              categoryData.categoryResult.category,
              categoryData.categoryResult.emotion
            );
            await updateCategoryAndEmotion(transformedResult.category, transformedResult.emotion);
          }

          // aiFeedback 저장
          const today = new Date().toISOString().split('T')[0];
          if (data.summary) {
            await saveAIFeedback(today, data.summary);
          }
        }
      } catch (err) {
        console.error('감정 요약 중 오류:', err);
        setFinalCardText('요약을 불러오지 못했습니다. 다시 시도해 주세요.');
        setIsGenerating(false);
      }
    };

    performSummary();
  }, [
    getStageAnswer,
    updateCategoryAndEmotion,
    saveAIFeedback,
    setIsGenerating,
    setFinalCardText,
    router,
    setError,
  ]);

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
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
        onBack={() => router.push('/self-empathy/7')}
      >
        <LoadingState type="default" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
      <div className="final-message">
        <span className="final-line line1">잠시, 꺼내어 본 감정을 함께 들여다볼까요?</span>
        <br />
        <span className="final-line line2">감정 속에는 중요한 메시지가 담겨 있었어요.</span>
      </div>
      <div className="final-card fade-in-card">
        <div className="final-card-text">{finalCardText}</div>
      </div>
      <div className="final-bottom-ment">
        {/* 오늘도 무지님은,
        <br />
        여러 감정 속에서도, 스스로를
        <br />더 다정하게 대하는 법을 찾아가고 있어요 */}
      </div>
      <Image className="mail-box" src={mailBox} alt="메일박스" />
      <button className="next-button" onClick={() => router.push('/self-empathy/9')}>
        <Image src={nextArrow} alt="다음" />
      </button>
    </SelfEmpathyLayout>
  );
}
