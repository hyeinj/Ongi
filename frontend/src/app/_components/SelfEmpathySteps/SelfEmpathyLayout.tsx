import Image from 'next/image';
import bottomMt from '@/assets/images/self-empathy-mountain.png';
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import arrow from '@/assets/icons/arrow.png';
import selfProgress from '@/assets/icons/self-progress.png';
import '@/styles/SelfEmpathyStep2Page.css';

interface SelfEmpathyLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  onBack: () => void;
}

export default function SelfEmpathyLayout({ children, onBack }: SelfEmpathyLayoutProps) {
  return (
    <div className="self-empathy-step2-page">
      <div className="background">
        <Image className="ver" src={bottomMt} alt="배경 이미지" />
        
        <Image className="element-1" alt="별똥별 1" src={star1} />
        <Image className="element-2" alt="별똥별 2" src={star2} />
        <Image className="element-3" alt="별똥별 3" src={star3} />

        <div className="content">
          <div className="header">
            <button className="back-button" onClick={onBack}>
              <Image src={arrow} alt="뒤로 가기" />
            </button>
            <div className="progress-row">
              <Image className="progress-bar" src={selfProgress} alt="진행 상태" />
              <span className="progress-text">1&nbsp;&nbsp;&nbsp;자기공감</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 