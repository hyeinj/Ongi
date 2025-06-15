'use client';

// import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IslandStorage } from '@/services/storage/islandStorage';
import { useLetter } from '@/ui/hooks/useLetter';
import { useEmotion } from '@/ui/hooks/useEmotion';

export default function SumUpStep() {
  const { getLetterData } = useLetter();
  const { getEmotionByDate } = useEmotion();

  // 표시할 텍스트 줄들을 배열로 정의
  const textLines = [
    '오늘 무지님은',
    '자신의 마음을 들여다보고,',
    '누군가에게 마음을 건네고,',
    '또 다른 마음을 조심스레 받아보았어요.',
    '',
    '그렇게 마음이 연결되는 오늘이 만들어졌어요.',
    '그게 얼마나 대단한 일인지',
    '우리는 잘 알고 있어요.',
    '무지님, 오늘도 수고 많았어요.',
  ];

  // 현재까지 표시된 줄 수를 추적
  const [visibleLines, setVisibleLines] = useState<number>(0);
  // 컴포넌트 렌더링 여부를 추적
  const [isRendered, setIsRendered] = useState<boolean>(false);
  // 저장 상태 추적
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 직후에 렌더링 상태를 true로 설정
    setIsRendered(true);

    // 각 줄이 나타나는 타이밍을 설정
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        // 모든 줄이 표시되었으면 타이머 중지
        if (prev >= textLines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400); // 400ms 간격으로 한 줄씩 표시

    return () => clearInterval(timer);
  }, [textLines.length]);

  const router = useRouter();
  const handleGoToIsland = async () => {
    if (isSaving) return; // 이미 저장 중이면 중복 실행 방지

    setIsSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. 타인공감 데이터 서버에 저장
      const [letterData, emotionData] = await Promise.all([
        getLetterData(today),
        getEmotionByDate(today),
      ]);

      if (!emotionData) {
        throw new Error('오늘의 감정 데이터를 찾을 수 없습니다.');
      }

      // 로컬스토리지에서 하이라이트된 문장들과 리뷰 가져오기
      const highlights = letterData?.highlightedParts || [];
      const review = letterData?.review?.otherEmpathy || '';

      // 타인공감 데이터가 있을 때만 서버에 저장
      if (highlights.length > 0 || review.trim()) {
        const saveRequestBody = {
          review: review.trim() || null,
          highlights: highlights,
          selfempathyId: emotionData.selfEmpathyId,
        };

        const saveResponse = await fetch('/api/other-empathy/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveRequestBody),
        });

        if (!saveResponse.ok) {
          throw new Error('타인공감 저장에 실패했습니다.');
        }

        const saveResult = await saveResponse.json();

        if (saveResult.success) {
          console.log('✅ 타인공감 저장 완료:', saveResult.data);
        } else {
          throw new Error(saveResult.error || '타인공감 저장에 실패했습니다.');
        }
      }

      // 2. 섬으로 이동
      const islandStorage = new IslandStorage();
      const category = await islandStorage.getCategoryForDate(today);

      console.log('sumup - 클릭 시 오늘 날짜:', today);
      console.log('sumup - 클릭 시 찾은 카테고리:', category);

      if (category) {
        router.push(`/island/${category}`);
      } else {
        console.warn('카테고리를 찾지 못함 → 홈으로 이동');
        router.push('/');
      }
    } catch (error) {
      console.error('❌ 타인공감 저장 또는 이동 실패:', error);
      // 오류가 발생해도 섬으로 이동은 계속 진행
      const islandStorage = new IslandStorage();
      const today = new Date().toISOString().split('T')[0];
      const category = await islandStorage.getCategoryForDate(today);

      if (category) {
        router.push(`/island/${category}`);
      } else {
        router.push('/');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* 메인 텍스트 */}
      <div className="text-center text-white max-w-xs px-4">
        <p className="text-base leading-7">
          {textLines.map((line, index) => (
            <React.Fragment key={index}>
              <span
                className={`transition-opacity duration-500 ease-in-out ${
                  index < visibleLines && isRendered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {line}
              </span>
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="w-full absolute bottom-10 px-4 flex justify-center">
        <button
          onClick={handleGoToIsland}
          disabled={isSaving}
          className={`w-full rounded-full py-4 bg-[#EEEEEE] text-center shadow active:bg-[#D2D2D2] transition-opacity duration-500 ease-in-out ${
            visibleLines >= textLines.length ? 'opacity-100' : 'opacity-0'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? '저장 중...' : '오늘의 마음을 온기섬에 남길게요'}
        </button>
      </div>
    </div>
  );
}
