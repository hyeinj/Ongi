'use client';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import '@/styles/IslandPage.css';
import homepageMt from '@/assets/images/homepage-mountain.png';
import star1 from '@/assets/images/star1.png';
import star2 from '@/assets/images/star2.png';
import star3 from '@/assets/images/star3.png';
import postoffice from '@/assets/images/postoffice.png';
import self from '@/assets/images/self.png';
import growth from '@/assets/images/growth.png';
import routine from '@/assets/images/routine.png';
import relate from '@/assets/images/relate.png';
import navigateBefore from '@/assets/icons/navigate_before.svg'
import navigateNext from '@/assets/icons/navigate_next.svg'
import calendar from '@/assets/icons/calendar.svg'

import { useLetterDateRange } from '@/ui/hooks/useLetterDateRange';
import { useDateNavigator } from '@/ui/hooks/useDateNavigator';
import LetterVisualization from '@/app/_components/island/LetterVisualization';
import { useDominantEmotions } from "@/ui/hooks/useDominantEmotions";
import { EmotionType } from "@/core/entities/emotion"
import IslandTutorialOverlay from '@/app/_components/island/IslandTutorialOverlay';

const IslandPage = () => {
  const { type } = useParams<{ type: string }>(); // type: 'relate', 'growth', ...
  const [showTutorial, setShowTutorial] = useState(false);

  const islandTitleMap = {
    relate: '관계의 섬',
    growth: '성장의 섬',
    routine: '루틴의 섬',
    self: '자아의 섬',
  };

  const islandImageMap = {
    relate,
    growth,
    routine,
    self,
  };

  const title = islandTitleMap[type as keyof typeof islandTitleMap]; // type: islandTitleMap의 키

  const [baseDate, setBaseDate] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // 달력 토글 상태
  useEffect(() => {
    setIsMounted(true);
    // 튜토리얼 표시 여부 확인
    const hasSeenTutorial = localStorage.getItem(`island-${type}-tutorial`);
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [type]);

  const handleTutorialFinish = () => {
    setShowTutorial(false);
    // 튜토리얼을 봤다는 것을 로컬 스토리지에 저장
    localStorage.setItem(`island-${type}-tutorial`, 'true');
  };

  const {
    year,
    month,
    start,
    end,
    isFirstHalf,
    letterDates,
    total,
  } = useLetterDateRange(baseDate);


  const { movePrev, moveNext, setByCalendar } = useDateNavigator(baseDate, setBaseDate, isFirstHalf);
  const handleDateSelect = (date: Date | null) => {
    if (!date) return; // null이면 무시
    setByCalendar(date);
    setShowCalendar(false);
  };
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();
  const isCurrentMonth = month === today.getMonth();
  const todayDate = today.getDate();
  const isJune2025 = year === 2025 && month === 5; // MVP용 6월 예외 처리 

  const isCurrentRange =
    isCurrentYear &&
    isCurrentMonth &&
    (
      (isFirstHalf && ((isJune2025 && todayDate <= 16) || (!isJune2025 && todayDate <= 15))) ||
      (!isFirstHalf && todayDate >= (isJune2025 ? 17 : 16))
    );

  const dominantEmotions = useDominantEmotions(letterDates, type);
  const emotionColors: Record<EmotionType, string> = {
    joy: "#FEE191",
    peace: "#62B067",
    sadness: "#4F69D2",
    anger: "#B25A5A",
    anxiety: "#AB1EB7",
  };

  const gradientStyle = {
    background: dominantEmotions.length
      ? `radial-gradient(circle,
          ${emotionColors[dominantEmotions[0]]}DD 0%,    /* 중심: 더 진하게 */
          ${emotionColors[dominantEmotions[0]]}66 40%,   /* 중간: 살짝 흐리게 */
          ${emotionColors[dominantEmotions[0]]}33 70%,   /* 경계: 거의 연하게 */
          ${emotionColors[dominantEmotions[0]]}00 100%)` /* 바깥: 완전 투명 */
      : undefined,
  };


  console.log("gradientStyle", gradientStyle);

  const router = useRouter();
  const handlePostOfficeClick = () => {
    router.push('/');
  };

  return (
    <div className="island-page">
      {showTutorial && (
        <IslandTutorialOverlay 
          onFinish={handleTutorialFinish}
          type={type}
        />
      )}
      <div className="gradient-layer" style={gradientStyle} />
      <div className="background">
        {/* 상단 문구 */}
        <div className = "text-wrapper">
            <h1>{title}</h1>
            <div className="select-date-wrapper">
                <Image className="navigate-button" src={navigateBefore} alt="이전" onClick={movePrev} />
                <span>{year}년 {month+1}월 {start}~{end}일</span>
                <Image src={navigateNext} alt="이후" 
                  className={`navigate-button ${isCurrentRange ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!isCurrentRange) moveNext(); // 오늘 이후는 막음
                  }} />
                <Image className="calendar-button" src={calendar} alt="달력" onClick={() => setShowCalendar(!showCalendar)} />
            </div>

            <p>하늘 위에 당신의 마음이 하나씩 모이고 있어요.</p>
        </div>

        {/* 날짜 선택 달력  */}
        {showCalendar && (
            <div className="calendar-wrapper">
            <DatePicker
                selected={baseDate}
                onChange={handleDateSelect}
                inline
                dateFormat="yyyy-MM-dd"
            />
            </div>
        )}

        {/* 편지 배열 */}
        {isMounted && (
            <LetterVisualization
                letterDates={letterDates}
                total={year === 2025 && month === 5 ? 16 : total} // MVP용: 6월만 16개로 고정
                category={type}
        />)}
            

        {/* 각종 요소들 */}
        <Image
            className="island"
            alt={`${type} 섬`}
            src={islandImageMap[type as keyof typeof islandImageMap]}
            // src = {keyof typeof islandTitleMap}
            // src = {type}
        />
        <Image className="element-1" alt="별똥별 1" src={star1} />
        <Image className="element-2" alt="별똥별 2" src={star2} />
        <Image className="element-3" alt="별똥별 3" src={star3} />
        <Image className="mountain" alt="산" src={homepageMt} />
        <Image
            className="postoffice"
            alt="우체국"
            src={postoffice}
            onClick={handlePostOfficeClick}
        />
        <div className='homeButtonText'>
          홈으로
        </div>
    </div>
  </div>
  );
};

export default IslandPage;