'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import mailBird from '@/assets/images/mail-bird.png';
import mailBox from '@/assets/images/mailbox.png';
import '@/styles/SelfEmpathyFinal.css';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useEmotion } from '../../../presentation/hooks/useEmotion';

export default function Step8() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { error, analyzeAndSaveEmotionAndCategory } = useEmotion();

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        // 로딩 시간 동안 감정 분석 및 저장 수행
        const analysisPromise = analyzeAndSaveEmotionAndCategory();
        const timerPromise = new Promise((resolve) => setTimeout(resolve, 2000));

        // 최소 2초 대기와 감정 분석 병렬 실행
        const [analysisResult] = await Promise.all([analysisPromise, timerPromise]);

        if (analysisResult) {
          console.log('감정 분석 완료:', analysisResult);
        } else {
          console.warn('감정 분석 실패, 기본값으로 진행');
        }
      } catch (err) {
        console.error('감정 분석 중 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [analyzeAndSaveEmotionAndCategory]);

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

  if (isLoading) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
        <div className="loading-page">
          <Image src={mailBird} alt="로딩" />
          <div className="loading-text">오늘의 감정이 전달되고 있어요.</div>
        </div>
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
        <div className="final-card-text">
          무지님은 오늘 옷을 고르는 평범한 상황 속에서 답답함과 짜증이라는 감정을 느꼈어요. 그
          감정은 단순한 불편함이 아니라, &lsquo;시간을 효율적으로 써야 한다&rsquo;는 내면의 기준에서
          비롯된 것이었죠.
          <br />
          <br />그 짜증을 따라가며 무지님은 &lsquo;왜 그런 감정이 들었는지&rsquo;, &lsquo;무엇을
          기대하고 있었는지&rsquo;를 상황의 맥락과 자신의 가치 기준과 연결해 바라보았어요. 앞으로
          비슷한 순간에, 자신을 더 다그치고 더 부드럽게 조율할 수 있는 실마리가 될 거예요.
        </div>
      </div>
      <div className="final-bottom-ment">
        오늘도 무지님은,
        <br />
        짜증이라는 감정 속에서도, 스스로를
        <br />더 다정하게 대하는 법을 찾아가고 있어요
      </div>
      <Image className="mail-box" src={mailBox} alt="메일박스" />
      <button className="next-button" onClick={() => router.push('/self-empathy/9')}>
        <Image src={nextArrow} alt="다음" />
      </button>
    </SelfEmpathyLayout>
  );
}
