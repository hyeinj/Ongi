'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postboxIcon from '@/assets/images/postbox-icon.png';
import { useLetter } from '@/ui/hooks/useLetter';
import localFont from 'next/font/local';
import { RealLetterData } from '@/core/entities/letter';
import { convertRawRealLetterDataContent } from '@/services/storage/converter';
import { useEmotion } from '@/ui/hooks/useEmotion';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

interface LetterContentProps {
  isVisible: boolean;
}

export default function LetterContent({ isVisible }: LetterContentProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [realLetterData, setRealLetterData] = useState<RealLetterData | null>(null);
  const { getEmotionByDate } = useEmotion();
  const { saveRealLetter, getLetterData } = useLetter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetterData = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)

        // 먼저 로컬스토리지에서 기존 편지 데이터 확인
        const existingLetterData = await getLetterData(today);

        if (
          existingLetterData?.realLetterData?.worryContent &&
          existingLetterData?.realLetterData?.answerContent &&
          existingLetterData.realLetterData.worryContent.length > 0 &&
          existingLetterData.realLetterData.answerContent.length > 0
        ) {
          console.log('✅ 기존 편지 데이터 사용');
          setRealLetterData(existingLetterData.realLetterData);
          return;
        }

        console.log('🔄 새로운 편지 데이터 생성 시작');

        const todayEmotion = await getEmotionByDate(today);
        if (!todayEmotion) {
          console.error('오늘의 감정 데이터를 찾을 수 없습니다.');
          return;
        }

        if (!todayEmotion.selfEmpathyId) {
          console.error("Today's self empathy result not found");
          return;
        }

        const selfempathyId = todayEmotion.selfEmpathyId;

        // 1. Mock Letter API 요청 (worryContent)
        const mockLetterResponse = await fetch(`/api/mock-letter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selfempathyId: selfempathyId,
          }),
        });

        if (!mockLetterResponse.ok) {
          throw new Error('Failed to fetch mock letter data');
        }

        const mockLetterResult = await mockLetterResponse.json();
        console.log('Mock letter result:', mockLetterResult.data.letterContent);

        const { convertedContent: worryContent } = convertRawRealLetterDataContent(
          mockLetterResult.data.letterContent
        );

        // 2. Other Empathy API 요청 (answerContent)
        const otherEmpathyResponse = await fetch(`/api/other-empathy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selfempathyId: selfempathyId,
          }),
        });

        if (!otherEmpathyResponse.ok) {
          throw new Error('Failed to fetch other empathy data');
        }

        const otherEmpathyResult = await otherEmpathyResponse.json();
        console.log('Other empathy full result:', otherEmpathyResult);
        console.log('Other empathy result data:', otherEmpathyResult.data);
        console.log(
          'Other empathy result responseContent:',
          otherEmpathyResult.data?.data?.responseContent
        );

        const { convertedContent: answerContent } = convertRawRealLetterDataContent(
          otherEmpathyResult.data?.data?.responseContent
        );

        // 3. 두 데이터 모두 저장
        if (
          mockLetterResult.success &&
          otherEmpathyResult.success &&
          worryContent &&
          answerContent
        ) {
          await saveRealLetter({
            title: mockLetterResult.data.letterTitle,
            worryContent: worryContent,
            answerContent: answerContent,
          });
          console.log('✅ 새로운 편지 데이터 생성 및 저장 완료');
        }

        setRealLetterData({
          letterTitle: mockLetterResult.data.letterTitle,
          worryContent: worryContent,
          answerContent: answerContent,
        });
      } catch (error) {
        console.error('편지 데이터를 가져오는 중 오류가 발생했습니다:', error);
        setError('편지 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLetterData();
  }, []);

  useEffect(() => {
    if (isVisible) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isVisible]);

  // 편지 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">편지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
        isVisible && fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center p-4 ${garamFont.className}`}
      >
        <div className="w-full flex justify-end pr-3">
          <div className="flex space-x-[-8px]">
            <button className="py-1 px-4 rounded-t-lg text-lg bg-[#FFDB68] text-gray-600 font-medium z-10">
              고민편지
            </button>
          </div>
        </div>

        <div className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] transition-opacity duration-300 ease-in-out overflow-y-auto overflow-hidden break-keep">
          <div className="flex flex-col items-center mb-5 relative">
            <Image
              src={postboxIcon}
              alt="편지함 아이콘"
              width={50}
              height={50}
              priority
              loading="eager"
            />
          </div>

          <div className="space-y-4 mt-6 transition-opacity duration-300 ease-in-out">
            {realLetterData?.worryContent.length ?? 0 > 0 ? (
              realLetterData?.worryContent.map((paragraph) => (
                <p
                  id={`paragraph-${paragraph.id}`}
                  key={paragraph.id}
                  className=" text-gray-600 cursor-text text-md"
                >
                  {paragraph.text}
                </p>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>편지 내용을 불러올 수 없습니다.</p>
                <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
