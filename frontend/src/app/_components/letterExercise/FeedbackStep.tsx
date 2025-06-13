import React, { useState, useRef, useEffect } from 'react';
import letterExercisePostBox from '@/assets/images/letter-exercise-post-box.png';
import Image from 'next/image';
import Link from 'next/link';
import ChevronDown from '../icons/ChevronDown';
import localFont from 'next/font/local';
import letterExerciseBig from '@/assets/images/letter-exercise-bird.png';
import { useLetter } from '@/ui/hooks/useLetter';
import { useRealLetter } from '@/ui/hooks/useRealLetter';
import { LetterStorage } from '@/services/storage/letterStorage';
import { Letter } from '@/core/entities';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function FeedbackStep() {
  const { getLetterData, generateFeedback } = useLetter();
  const { worryContent } = useRealLetter({ shouldSave: true }); // letterExercise와 동일한 옵션 사용
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [letterData, setLetterData] = useState<Letter | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 편지 데이터 로드 및 피드백 생성 (한 번만 실행)
  useEffect(() => {
    if (dataLoaded) return;

    const loadLetterDataAndGenerateFeedback = async () => {
      try {
        console.log('🔍 피드백 로드 시작');

        // 중복 실행 방지
        setDataLoaded(true);

        const existingLetter = await getLetterData(currentDate);
        console.log('📋 기존 편지 데이터:', existingLetter);
        console.log('🗂️ RealLetter worryContent:', worryContent);

        // 추가: LetterStorage에서 직접 RealLetter 데이터 조회
        const letterStorage = new LetterStorage();
        const savedRealLetter = await letterStorage.getRealLetter(currentDate);
        console.log('🗄️ 저장된 RealLetter 데이터:', savedRealLetter);

        if (existingLetter?.feedbackSections || existingLetter?.aiFeedback) {
          console.log('✅ 이미 피드백이 있음');
          // 이미 피드백이 있는 경우
          setLetterData(existingLetter);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          console.log('🔄 피드백 생성 필요');
          // 피드백이 없는 경우 생성

          let realLetterText = '';

          // 1. useRealLetter에서 worryContent 사용
          if (worryContent && worryContent.length > 0) {
            realLetterText = worryContent.map((content) => content.text).join('\n\n');
            console.log('📝 useRealLetter에서 가져온 텍스트:', realLetterText);
          }
          // 2. 저장된 RealLetter 데이터 사용 (fallback)
          else if (savedRealLetter?.worryContent && savedRealLetter.worryContent.length > 0) {
            realLetterText = savedRealLetter.worryContent
              .map((content) => content.text)
              .join('\n\n');
            console.log('📝 localStorage에서 가져온 텍스트:', realLetterText);
          }

          if (realLetterText && existingLetter?.userResponse) {
            console.log('💬 사용자 응답:', existingLetter.userResponse);

            // RealLetter 기반으로 피드백 생성 (수정된 generateFeedback 사용)
            const feedbackResult = await generateFeedback(
              realLetterText,
              existingLetter.userResponse,
              currentDate
            );

            console.log('🎯 피드백 생성 결과:', feedbackResult);

            if (feedbackResult?.success) {
              console.log('✅ 피드백 생성 성공');
              // 피드백 생성 후 다시 데이터 로드
              const updatedLetter = await getLetterData(currentDate);
              console.log('📄 업데이트된 편지 데이터:', updatedLetter);
              setLetterData(updatedLetter);
            } else {
              console.log('❌ 피드백 생성 실패:', feedbackResult?.error);
            }
          } else {
            console.log('⚠️ RealLetter 데이터나 사용자 응답 없음');
            console.log('realLetterText 존재:', !!realLetterText);
            console.log('userResponse 존재:', !!existingLetter?.userResponse);

            // RealLetter 데이터나 사용자 응답이 없는 경우 기본 피드백 생성 시도
            const feedbackResult = await generateFeedback(currentDate);
            console.log('🔄 기본 피드백 생성 결과:', feedbackResult);
            if (feedbackResult?.success) {
              const updatedLetter = await getLetterData(currentDate);
              setLetterData(updatedLetter);
            }
          }

          // 최소 로딩 시간 보장 (사용자 경험을 위해)
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error('❌ 피드백 로드/생성 실패:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    loadLetterDataAndGenerateFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]); // worryContent 의존성 제거하여 중복 실행 방지

  const handleChevronClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (extraRef.current && scrollContainerRef.current) {
        // extraRef가 컨테이너 내에서의 위치로 스크롤
        scrollContainerRef.current.scrollTo({
          top: extraRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  // 두 컴포넌트를 모두 렌더링하고 CSS로 전환 애니메이션 적용
  return (
    <>
      {/* 로딩 화면 */}
      <div
        className={`
          flex flex-col h-[80vh] w-full items-center justify-center absolute top-0 left-0 z-10
          transition-all duration-800 ease-in-out
          ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <div className="flex flex-col items-center">
          <div className="animate-float mb-4">
            <Image
              src={letterExerciseBig}
              alt="letter exercise big"
              width={100}
              priority
              loading="eager"
            />
          </div>
          <p className="text-white font-thin mb-5">무지님의 편지를 보내고 있어요</p>
        </div>
      </div>

      {/* 실제 컨텐츠 */}
      <div
        className={`
          flex flex-col h-[70vh] w-full py-10 px-4 items-center overflow-y-auto
          transition-all duration-800 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
        }}
        ref={scrollContainerRef}
      >
        <h2 className="text-white text-md mb-0 w-full text-left">
          잠시, 이 편지를 함께 바라볼까요?
          <br />
          무지님의 마음과 사연자의 마음이 닮아 있었어요.
        </h2>

        <div className="pt-4 mb-6 flex-1">
          {letterData?.feedbackSections ? (
            // 새로운 4개 영역 피드백 구조
            <>
              {/* 1. 감정 연결 피드백 */}
              {letterData.feedbackSections.emotionConnection && (
                <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
                  <p className="text-gray-800 text-sm leading-6 whitespace-pre-wrap">
                    {letterData.feedbackSections.emotionConnection}
                  </p>
                </div>
              )}

              {/* 2. 공감 문장 반영 */}
              {letterData.feedbackSections.empathyReflection &&
                letterData.feedbackSections.empathyReflection.length >= 2 && (
                  <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
                    <p className={`${garamFont.className} text-[#6A3C00] text-lg mb-2 text-center`}>
                      &ldquo;{letterData.feedbackSections.empathyReflection[0]}&rdquo;
                    </p>
                    <p className="text-gray-800 text-sm leading-6">
                      {letterData.feedbackSections.empathyReflection[1]}
                    </p>
                  </div>
                )}
            </>
          ) : letterData?.aiFeedback ? (
            // 기존 단일 피드백 구조
            <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
              <p className="text-gray-800 text-sm leading-7 whitespace-pre-wrap">
                {letterData.aiFeedback}
              </p>
            </div>
          ) : (
            // 폴백 하드코딩된 구조
            <>
              <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
                <p className="text-gray-800 text-sm leading-7">
                  &ldquo;무지님이 자기공감에서 &ldquo;시간에 쫓겨서 짜증이 났다&rdquo;고 말해주셨죠.
                  사연자도 해야 할 일을 버텨내며 스스로를 계속 몰아세우고 있었는지 몰라요. 그 짜증과
                  지침의 바닥엔, 두 분 모두 너무 열심히 버텨왔다는 흔적이 있었을지도요.&rdquo;
                </p>
              </div>

              <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
                <p className={`${garamFont.className} text-[#6A3C00] text-lg mb-2 text-center`}>
                  &ldquo;조금 쉬어도 괜찮아요.&rdquo;
                </p>
                <p className="text-gray-800 text-sm leading-7">
                  &ldquo;무지님이 자기공감에서 &ldquo;시간에 쫓겨서 짜증이 났다&rdquo;고 말해주셨죠.
                  사연자도 해야 할 일을 버텨내며 스스로를 계속 몰아세우고 있었는지 몰라요. 그 짜증과
                  지침의 바닥엔, 두 분 모두 너무 열심히 버텨왔다는 흔적이 있었을지도요.&rdquo;
                </p>
              </div>
            </>
          )}
        </div>
        {!isOpen && (
          <button onClick={handleChevronClick}>
            <ChevronDown className="w-10 h-10 text-white cursor-pointer absolute top-[70vh] left-1/2 -translate-x-1/2 animate-bounce" />
          </button>
        )}

        {/* 피드백 컨텐츠 - 애니메이션 적용 */}
        <div
          ref={extraRef}
          className={`
            w-full mt-8
            transition-all duration-500 ease-in-out
            ${
              isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none absolute'
            }
          `}
          aria-hidden={!isOpen}
        >
          <div className="mb-4">
            <p className="text-white mb-6">더 깊은 공감을 만드는 작은 제안을 드릴게요.</p>

            {letterData?.feedbackSections?.improvementSuggestion &&
            letterData.feedbackSections.improvementSuggestion.length >= 2 ? (
              // 새로운 개선 제안 구조
              <div className="bg-[#FFFBEC]/80 rounded-2xl p-3 mb-8">
                <p className="text-gray-800 text-sm font-bold mb-3">
                  {letterData.feedbackSections.improvementSuggestion[0]}
                </p>
                <p className="text-gray-800 text-sm leading-6">
                  {letterData.feedbackSections.improvementSuggestion[1]}
                </p>
              </div>
            ) : (
              // 폴백 하드코딩된 구조
              <div className="bg-[#FFFBEC]/80 rounded-2xl p-3 mb-8">
                <p className="text-gray-800 text-sm font-bold mb-3">
                  사연자의 감정을 먼저 헤아려 보아요.
                </p>
                <p className="text-gray-800 text-sm leading-6">
                  &ldquo;누구나 겪는 일이에요&rdquo;처럼 들릴 수 있는 말보다는,
                  <br />
                  &ldquo;그 상황, 정말 버거우셨겠어요&rdquo;처럼 사연자의 감정을 먼저 인정하는 말이
                  더 오래 기억에 남을 거예요.
                </p>
              </div>
            )}

            <p className="text-white mb-6">나와 타인의 이야기가 맞닿은 지금,
              <br/>이 답장 편지가 나에게 왔다면 <br/>나는 어떤 표정으로 읽게 되었을까요?</p>
              <textarea
                className="w-full h-full min-h-[10vh] bg-[#FFFBEC]  text-sm  resize-none border-none outline-none overflow-y-auto break-keep rounded-xl p-3"
                placeholder="꼭 적지 않아도 괜찮아요. 한 번 생각해보는 것만으로도 충분하니까요."
                // value 넣기 
              />
          </div>
        </div>

        {/* 하단 안내 및 버튼 - 애니메이션 적용 */}
        <div
          className={`
            absolute bottom-15 right-0 w-full flex flex-col items-end pb-8 px-4
            transition-all duration-500 ease-in-out delay-100
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
          `}
          aria-hidden={!isOpen}
        >
          <div className="mb-4 text-end">
            <p className="text-white mb-1 leading-6">
              마음을 건네고, 마음을 받아보는 일.
              <br />
              그 연결의 여정을
              <br />
              계속 이어가볼까요?
            </p>
          </div>
          <Link href="/letter-exercise/4">
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
        <Image
          src={letterExercisePostBox}
          alt="post box"
          width={130}
          className="absolute bottom-15 left-0"
          priority
          loading="eager"
        />
      </div>

      {/* 커스텀 애니메이션 정의 */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(0px) rotate(0deg);
          }
          75% {
            transform: translateY(8px) rotate(-2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
