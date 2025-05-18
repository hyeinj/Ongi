'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import '@/styles/SelfEmpathyFinal.css';
import bottomButton from '@/assets/icons/bottombutton.png';
import '@/styles/SelfEmpathyPage.css';

export default function Step9() {
  const router = useRouter();

return (
    <SelfEmpathyLayout currentStep={9} onBack={() => router.push('/self-empathy/8')}>
        <span className="next-text">무지님의 소중한 오늘을 살펴보았어요.<br /><br />이제 무지님과 닮은 마음에<br /> 조심스런 답장을 건네러 가볼까요?</span>
        <button className="bottom-button final-button"onClick={() => router.push('/letter-exercise/1')}> 
            {/* 병찬님 화면으로 넘어가게 */}
          <Image src={bottomButton} alt="다음으로" />
          <span className="button-text final-button-text">마음을 담아 건네러 갈게요</span>
        </button>
    </SelfEmpathyLayout>
    ); 
}
