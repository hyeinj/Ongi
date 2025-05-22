'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import letterImage from '@/assets/images/letter.png';
import localFont from 'next/font/local';
import letterExerciseLetterBg from '@/assets/images/letter-exercise-letter-bg.png';
import letterExerciseLetterTopIcon from '@/assets/images/postbox-icon.png';
import { useLetter } from '@/presentation/hooks/useLetter';
import { useSearchParams } from 'next/navigation';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function IntroStep() {
  const searchParams = useSearchParams();
  const { generateMockLetter, getLetterData } = useLetter();
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mockLetter, setMockLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // 쿼리 파라미터에서 introStepShown 확인
  const introStepShown = searchParams.get('introStepShown') === 'true';

  // 편지 데이터 로드 및 생성 (한 번만 실행)
  useEffect(() => {
    if (dataLoaded) return;

    const loadOrGenerateLetter = async () => {
      setIsLoading(true);

      // 먼저 기존 편지 확인
      const existingLetter = await getLetterData(currentDate);
      if (existingLetter && existingLetter.mockLetter) {
        setMockLetter(existingLetter.mockLetter);
      } else {
        // 없으면 새로 생성
        const result = await generateMockLetter(currentDate);
        if (result) {
          setMockLetter(result.mockLetter);
        }
      }

      setIsLoading(false);
      setDataLoaded(true);
    };

    loadOrGenerateLetter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, dataLoaded]); // 함수들을 의존성에서 제거

  useEffect(() => {
    if (!introStepShown) {
      // 2초 후 페이드아웃 시작
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      // 페이드아웃 후 컴포넌트 숨기기
      const hideTimeout = setTimeout(() => {
        setShowContent(false);
      }, 2500); // 페이드아웃 애니메이션 시간 0.5초 포함

      return () => {
        clearTimeout(timeout);
        clearTimeout(hideTimeout);
      };
    } else {
      // 이미 보여진 경우 바로 숨김
      setShowContent(false);
    }
  }, [introStepShown]);

  if (!showContent) {
    // 인트로 단계가 끝나면 편지 내용 표시
    return (
      <>
        <LetterContent mockLetter={mockLetter} isLoading={isLoading} />
        <div className="fixed bottom-12 w-full flex justify-end px-8 z-50">
          <Link href="/letter-exercise/2">
            <div className="p-4.5 rounded-full bg-[#EEEEEE] active:bg-[#DEDEDE] shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex flex-col items-center h-full w-full text-center px-4 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mt-40">
        <div className="text-white text-lg font-light mb-6">
          익명의 손편지가 무지님을 찾아왔어요.
        </div>
        <div className="relative mb-6">
          <div className="bg-white/25 rounded-full mx-auto blur-[2.50px] w-full h-full absolute top-0 left-0" />
          <p className={`relative text-black px-6 py-3 text-m italic ${garamFont.className}`}>
            &ldquo;매일이 전쟁 같은 시간 속, 숨 쉴 틈이 필요해요.&rdquo;
          </p>
        </div>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-4">
        <Image
          src={letterImage}
          alt="편지 봉투 이미지"
          width={500}
          height={350}
          layout="responsive"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
}

const LetterContent = ({ mockLetter, isLoading }: { mockLetter?: string; isLoading?: boolean }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 직후 페이드인 시작
    const timeout = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 flex w-full h-full flex-1 justify-center items-center px-6 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Image
        src={letterExerciseLetterBg}
        alt="편지 배경 이미지"
        loading="eager"
        className="absolute bottom-15 left-0 w-full h-auto"
      />
      <div className="flex flex-col items-center justify-start bg-[#F7F4E6] w-full h-[80vh] shadow-[#00000058] shadow-xl p-4 scroll-auto overflow-y-auto ">
        <Image src={letterExerciseLetterTopIcon} alt="편지 위 아이콘" width={50} height={50} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A3C00] mb-4"></div>
            <p className={`text-[#6A3C00] ${garamFont.className}`}>편지를 받아오고 있어요...</p>
          </div>
        ) : mockLetter ? (
          <div
            className={`mb-6 ${garamFont.className} leading-8 text-[#6A3C00] whitespace-pre-wrap overflow-y-auto scrollbar-hide`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className=" h-[100vh]">{mockLetter}</div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
