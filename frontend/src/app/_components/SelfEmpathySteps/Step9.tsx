'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import '@/styles/SelfEmpathyFinal.css';
import bottomButton from '@/assets/icons/bottombutton.png';
import '@/styles/SelfEmpathyPage.css';
import { useEmotion } from '@/ui/hooks/useEmotion';

export default function Step9() {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);

  // 클린 아키텍처를 통한 에러 상태 확인
  const { error } = useEmotion();

  // 페이지 진입 시 자동으로 데이터 저장
  useEffect(() => {
    const saveAllData = async () => {
      setSaveError(null);

      try {
        const today = new Date().toISOString().split('T')[0];

        // 이미 저장된 데이터가 있는지 확인
        const mockLetters = localStorage.getItem('mock-letters');
        const lettersData = mockLetters ? JSON.parse(mockLetters) : {};

        if (lettersData[today]) {
          // 이미 데이터가 있으면 API 호출하지 않음
          return;
        }

        const storageData = localStorage.getItem('emotion');

        if (!storageData) {
          throw new Error('감정 데이터를 찾을 수 없습니다.');
        }

        const emotionStore = JSON.parse(storageData);
        const todayData = emotionStore[today];

        if (!todayData) {
          throw new Error('오늘의 감정 데이터를 찾을 수 없습니다.');
        }

        // 각 단계의 질문과 답변 가져오기
        const requestBody = {
          oneQuestion: todayData.entries.step2?.question || '',
          oneAnswer: todayData.entries.step2?.answer || '',
          twoQuestion: todayData.entries.step3?.question || '',
          twoAnswer: todayData.entries.step3?.answer || '',
          threeQuestion: todayData.entries.step4?.question || '',
          threeAnswer: todayData.entries.step4?.answer || '',
          fourQuestion: todayData.entries.step5?.question || '',
          fourAnswer: todayData.entries.step5?.answer || '',
          fiveQuestion: todayData.entries.step6?.question || '',
          fiveAnswer: todayData.entries.step6?.answer || '',
          summary: todayData.aiFeedback || '',
          category: todayData.category || 'self',
          emotion: todayData.emotion || 'peace',
        };

        // API 호출
        const response = await fetch('/api/self-emapthy-summary/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('데이터 저장에 실패했습니다.');
        }

        const result = await response.json();

        // localStorage에 mock-letters 저장
        if (result.success) {
          // success, message, data.message를 제외한 데이터 저장
          const dataToSave = {
            selfEmpathyId: result.data.selfEmpathyId,
            reportId: result.data.reportId,
            category: result.data.category,
            island: result.data.island,
          };

          lettersData[today] = dataToSave;
          localStorage.setItem('mock-letters', JSON.stringify(lettersData));
        }
      } catch (err) {
        console.error('데이터 저장 중 오류:', err);
        setSaveError(err instanceof Error ? err.message : '데이터 저장에 실패했습니다.');
      }
    };

    saveAllData();
  }, []);

  // 에러 상태 처리
  if (error || saveError) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/8')}>
        <div className="error-message">
          오류가 발생했습니다: {error || saveError}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout onBack={() => router.push('/self-empathy/8')}>
      <div className="next-text">
        솔직한 마음을 들려줘서 고마워요.
        <br />
        <br />
        <strong className="glow-text">이제 당신의 감정과 닮은,</strong>
        <br />
        <strong className="glow-text">누군가가 남긴 고민 편지를 읽어볼 거예요.</strong>
        <br />
        <br />
        &ldquo;<em>나와 비슷한 마음을 겪은 사람이 있었구나</em>&rdquo; 혹은
        <br />
        &ldquo;<em>내 따뜻함이 누군가에게 작은 숨결이 될 수 있겠구나</em>&rdquo;
        <br />
        하는 마음으로, 천천히 공감하며 읽어보세요.
        <br />
        <br />
        무지님의 편지가 실제로 보내지는 건 아니에요.
        <br />
        다만,누군가의 마음에 조심스레 말을 건네며
        <br />
        그 마음에 답장을 써 보는 이 시간은
        <br />
        오히려 내 마음을 더 깊이 들여다볼 수 있는
        <br />
        작은 연습이 되어 줄 거예요.
        <br />
        <br />
        잘 쓰려고 애쓰지 않아도 괜찮아요.
        <br />
        <strong className="glow-text">지금 느낀 감정을 따라</strong>
        <br />
        <strong className="glow-text">천천히, 진심을 담아 적어보세요.</strong>
      </div>
      <button
        className="bottom-button final-button"
        onClick={() => router.push('/letter-exercise/1')}
      >
        <Image src={bottomButton} alt="다음으로" />
        <span className="button-text">마음을 담아 건네러 갈게요</span>
      </button>
    </SelfEmpathyLayout>
  );
}
