'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SkeletonUI from './SkeletonUI';
import mailBox from '@/assets/images/mailbox.png';
import '@/styles/SelfEmpathyFinal.css';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useEmotion } from '@/ui/hooks/useEmotion';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';

export default function Step8() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [finalCardText, setFinalCardText] = useState('');

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { error, analyzeAndSaveEmotionAndCategory, generateFinalCardText } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowSkeleton = useDelayedLoading(isLoading);

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

          // 감정 분석 완료 후 final card text 생성
          const finalTextResult = await generateFinalCardText();
          if (finalTextResult && finalTextResult.success) {
            setFinalCardText(finalTextResult.finalText);
          } else {
            // 실패 시 기본 텍스트 사용
            setFinalCardText(
              '오늘 하루 감정을 되돌아보며 자신을 더 이해하게 되는 소중한 시간이었어요.'
            );
          }
        } else {
          console.warn('감정 분석 실패, 기본값으로 진행');
          setFinalCardText(
            '오늘 하루 감정을 되돌아보며 자신을 더 이해하게 되는 소중한 시간이었어요.'
          );
        }
      } catch (err) {
        console.error('감정 분석 중 오류:', err);
        setFinalCardText(
          '오늘 하루 감정을 되돌아보며 자신을 더 이해하게 되는 소중한 시간이었어요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [analyzeAndSaveEmotionAndCategory, generateFinalCardText]);

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

  if (shouldShowSkeleton) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
        <SkeletonUI type="card" />
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
        오늘도 무지님은,
        <br />
        여러 감정 속에서도, 스스로를
        <br />더 다정하게 대하는 법을 찾아가고 있어요
      </div>
      <Image className="mail-box" src={mailBox} alt="메일박스" />
      <button className="next-button" onClick={() => router.push('/self-empathy/9')}>
        <Image src={nextArrow} alt="다음" />
      </button>
    </SelfEmpathyLayout>
  );
}
