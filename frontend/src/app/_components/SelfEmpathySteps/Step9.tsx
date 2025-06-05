'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import '@/styles/SelfEmpathyFinal.css';
import bottomButton from '@/assets/icons/bottombutton.png';
import '@/styles/SelfEmpathyPage.css';
import { useEmotion } from '@/ui/hooks/useEmotion';

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
      <div className="next-text">
        지금 솔직한 마음을 들려줘서 정말 고마워요.
        <br />
        <br />
        다음 단계에서는 비슷한 감정을 겪은
        <br />
        누군가가 남긴 편지를 보여드릴게요.
        <br />
        <br />
        &apos;나만 이런 게 아니구나&apos;,
        <br />
        &apos;다른 사람도 이렇게 마음을 털어놓았구나&apos; 하고
        <br />
        천천히 공감하며 읽어보세요.
        <br />
        <br />
        그리고 그 마음을 받아들여,
        <br />
        마치 가장 가까운 친구에게 편지를 쓰듯
        <br />
        나에게 답장을 써보면 어떨까요?
        <br />
        <br />
        조금 낯설더라도,
        <br />
        놓쳤던 말과 감정을
        <br />
        따뜻하게 적어보세요.
        <br />
        👋💌
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

