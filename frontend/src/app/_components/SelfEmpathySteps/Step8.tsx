'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import mailBird from '@/assets/images/mail-bird.png';
import mailBox from '@/assets/images/mailbox.png';
import '@/styles/SelfEmpathyFinal.css';
import nextArrow from '@/assets/icons/next-arrow.png';
import { useSelfEmpathy } from '@/store/SelfEmpathyContext';

export default function Step8() {
  const router = useRouter();
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const { empathyMessage, generateEmpathy, isLoading, userAnswer, conversations } =
    useSelfEmpathy();

  // 컴포넌트 마운트 시 최종 공감 메시지 생성
  useEffect(() => {
    const generateEmpathyMessage = async () => {
      // 마지막 질문에 대한 답변이 있고, 아직 공감 메시지가 없는 경우에만 생성
      if (userAnswer.trim() && !empathyMessage) {
        await generateEmpathy();
      }

      // 로딩 애니메이션을 위한 타이머
      const timer = setTimeout(() => setIsAnimationDone(true), 2000);
      return () => clearTimeout(timer);
    };

    generateEmpathyMessage();
  }, [userAnswer, empathyMessage, generateEmpathy]);

  // 로딩 중이거나 애니메이션이 끝나지 않은 경우 로딩 화면 표시
  if (isLoading || !isAnimationDone) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
        <div className="loading-page">
          <Image src={mailBird} alt="로딩" />
          <div className="loading-text">오늘의 감정이 전달되고 있어요.</div>
        </div>
      </SelfEmpathyLayout>
    );
  }

  // 사용자 이름은 첫 4자리만 사용 또는 기본값
  const userName =
    conversations.length > 0 && conversations[0].answer
      ? conversations[0].answer.substring(0, 4)
      : '무지';

  return (
    <SelfEmpathyLayout onBack={() => router.push('/self-empathy/7')}>
      <div className="final-message">
        <span className="final-line line1">잠시, 꺼내어 본 감정을 함께 들여다볼까요?</span>
        <br />
        <span className="final-line line2">감정 속에는 중요한 메시지가 담겨 있었어요.</span>
      </div>
      <div className="final-card fade-in-card">
        <div className="final-card-text">{empathyMessage}</div>
      </div>
      <div className="final-bottom-ment">
        오늘도 {userName}님은,
        <br />
        자신의 감정 속에서도, 스스로를
        <br />더 다정하게 대하는 법을 찾아가고 있어요
      </div>
      <Image className="mail-box" src={mailBox} alt="메일박스" />
      <button className="next-button" onClick={() => router.push('/self-empathy/9')}>
        <Image src={nextArrow} alt="다음" />
      </button>
    </SelfEmpathyLayout>
  );
}
