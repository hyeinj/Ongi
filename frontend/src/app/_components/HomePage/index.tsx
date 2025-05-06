import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import homepageMt from '../assets/images/homepage-mountain.png';
import star1 from '../assets/images/star1.png';
import star2 from '../assets/images/star2.png';
import star3 from '../assets/images/star3.png';
import postoffice from '../assets/images/postoffice.png';
import line from '../assets/images/line.png';
import self from '../assets/images/self.png';
import growth from '../assets/images/growth.png';
import routine from '../assets/images/routine.png';
import relate from '../assets/images/relate.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // 임시 데이터 - 나중에 백엔드에서 가져올 예정
  const letterCounts = {
    self: 3,
    growth: 5,
    routine: 2,
    relate: 4
  };

  const handlePostOfficeClick = () => {
    setIsLoading(true);
    // 로딩 효과를 위해 약간의 지연 시간을 줍니다
    setTimeout(() => {
      navigate('/self-empathy');
    }, 800);
  };

  return (
    <div className="home-page">
      <div className="div">
        <div className="text-wrapper">
          <p>무지 님의 시간이 머무는 섬이에요.</p>
          <p>따뜻한 기록 하나, 띄워볼까요?</p>
        </div>
        <img className="line" alt="Line" src={line} />
        <img 
          className="postoffice" 
          alt="우체국" 
          src={postoffice} 
          onClick={handlePostOfficeClick}
        />
        <img className="element-1" alt="별똥별 1" src={star1} />
        <img className="element-2" alt="별똥별 2" src={star2} />
        <img className="element-3" alt="별똥별 3" src={star3} />
        <div className="mountain" style={{ backgroundImage: `url(${homepageMt})` }} />
        <img className="self" alt="자아섬" src={self} />
        <img className="growth" alt="성장섬" src={growth} />
        <img className="routine" alt="루틴섬" src={routine} />
        <img className="relate" alt="관계섬" src={relate} />
        {/* 백앤드로 채워야하는 숫자 */}
        <div className="circle-ellipse circle-self">
          <span>{letterCounts.self}</span>
        </div>
        <div className="circle-ellipse circle-growth">
          <span>{letterCounts.growth}</span>
        </div>
        <div className="circle-ellipse circle-routine">
          <span>{letterCounts.routine}</span>
        </div>
        <div className="circle-ellipse circle-relate">
          <span>{letterCounts.relate}</span>
        </div>

        {/* {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default HomePage; 