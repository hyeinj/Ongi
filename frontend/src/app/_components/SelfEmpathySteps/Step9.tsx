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
        솔직한 마음을 들려줘서 고마워요.
        <br />
        <br />
        <strong className="glow-text">이제 당신의 감정과 닮은,</strong>
        <br />
        <strong className="glow-text">누군가가 남긴 고민 편지를 읽어볼 거예요.</strong>
        <br />
        <br />
        지금 내 안에 머무는 감정이 어떻든,
        <br />
        &ldquo;<em>나와 비슷한 마음을 겪은 사람이 있었구나</em>&rdquo; 혹은
        <br />
        &ldquo;<em>내 따뜻함이 누군가에게 작은 숨결이 될 수 있겠구나</em>&rdquo;
        <br />
        라는 생각으로, 천천히 공감하며 읽어보세요.
        <br />
        <br />
        무지님의 편지가 실제로 보내지는 건 아니에요.
        <br />
        <br />
        다만, 누군가의 마음에 조심스레 말을 건네 보고,
        <br />
        그 마음에 답장을 써 보는 경험은
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


