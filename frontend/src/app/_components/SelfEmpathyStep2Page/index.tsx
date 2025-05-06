import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelfEmpathyStep2Page.css';

// 이미지 import
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import bottomMt from '@/assets/images/self-empathy-mountain.png';
import arrow from '@/assets/icons/arrow.png';
import selfProgress from '@/assets/icons/self-progress.png';

const SelfEmpathyStep2Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="self-empathy-step2-page">
      <div className="div">
        <div className="ver" style={{ backgroundImage: `url(${bottomMt})` }} />
        
        <img className="element-1" alt="별똥별 1" src={star1.src} />
        <img className="element-2" alt="별똥별 2" src={star2.src} />
        <img className="element-3" alt="별똥별 3" src={star3.src} />

        <div className="content">
          <div className="header">
            <button className="back-button" onClick={() => navigate('/self-empathy')}>
              <img src={arrow.src} alt="뒤로 가기" />
            </button>
            <img className="progress-bar" src={selfProgress.src} alt="진행 상태" />
          </div>

          <div className="question-text">
            <p className="small-text">무지님의 하루가 궁금해요.</p>
            <p className="large-text">오늘, 가장 반가웠던 것은 무엇인가요?</p>
          </div>

          <textarea
            className="answer-input"
            placeholder="답변을 입력해주세요"
          />
          
        </div>
      </div>
    </div>
  );
};

export default SelfEmpathyStep2Page; 