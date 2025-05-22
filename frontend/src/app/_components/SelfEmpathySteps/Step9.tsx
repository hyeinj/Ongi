'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import '@/styles/SelfEmpathyFinal.css';
import bottomButton from '@/assets/icons/bottombutton.png';
import '@/styles/SelfEmpathyPage.css';
import { useEmotion } from '../../../presentation/hooks/useEmotion';

export default function Step9() {
  const router = useRouter();

  // 클린 아키텍처를 통한 에러 상태 확인
  const { error } = useEmotion();

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout onBack={() => router.push('/self-empathy/8')}>
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout onBack={() => router.push('/self-empathy/8')}>
      <span className="next-text">
        무지님의 소중한 오늘을 살펴보았어요.
        <br />
        <br />
        이제 무지님과 닮은 마음에
        <br /> 조심스런 답장을 건네러 가볼까요?
      </span>
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
