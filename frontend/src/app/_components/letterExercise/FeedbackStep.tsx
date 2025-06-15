import React, { useState, useRef, useEffect } from 'react';
import letterExercisePostBox from '@/assets/images/letter-exercise-post-box.png';
import Image from 'next/image';
import ChevronDown from '../icons/ChevronDown';
import localFont from 'next/font/local';
import letterExerciseBig from '@/assets/images/letter-exercise-bird.png';
import { useLetter } from '@/ui/hooks/useLetter';
import { Letter } from '@/core/entities';
import { useEmotion } from '@/ui/hooks/useEmotion';
import {
  convertServerFeedbackToFeedbackSections,
  convertServerFeedbackToAiFeedback,
  type ServerFeedbackResponse,
} from '@/services/storage/feedbackConverter';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function FeedbackStep() {
  const { getLetterData, saveLetterExerciseReview, saveLetterData } = useLetter();
  const [letterData, setLetterData] = useState<Letter | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getEmotionByDate } = useEmotion();
  const [myLetter, setMyLetter] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  // 편지 데이터 로드 및 피드백 생성 (한 번만 실행)
  useEffect(() => {
    if (dataLoaded) return;

    const fetchFeedback = async () => {
      setIsLoading(true);
      setDataLoaded(true);

      try {
        const today = new Date().toISOString().split('T')[0];

        const emotionData = await getEmotionByDate(today);
        const currentLetterData = await getLetterData(today);

        if (!emotionData) {
          throw new Error('오늘의 감정 데이터를 찾을 수 없습니다.');
        }
        if (!currentLetterData) {
          throw new Error('오늘의 편지 데이터를 찾을 수 없습니다.');
        }

        // 이미 피드백 데이터가 있는지 확인
        if (currentLetterData.feedbackSections || currentLetterData.aiFeedback) {
          console.log('✅ 기존 피드백 데이터 사용');
          setLetterData(currentLetterData);

          // 기존 리뷰 데이터가 있으면 텍스트 입력창에 설정
          if (currentLetterData.review?.letterExercise) {
            setMyLetter(currentLetterData.review.letterExercise);
            console.log('✅ 기존 리뷰 데이터 로드됨');
          }

          return;
        }

        console.log('🔄 새로운 피드백 생성 시작');
        setLetterData(currentLetterData);

        const requestBody = {
          step1_answer: emotionData.entries.step2?.answer || '',
          step2_answer: emotionData.entries.step3?.answer || '',
          step3Feelings: emotionData.entries.step4?.answer || '',
          step4_answer: emotionData.entries.step5?.answer || '',
          step5_answer: emotionData.entries.step6?.answer || '',
          mock_letter: currentLetterData.realLetterData?.letterTitle || '',
          letter_response: currentLetterData.userResponse || '',
        };

        const response = await fetch('/api/mock-letter/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('피드백 생성에 실패했습니다.');
        }

        const result = await response.json();

        if (result.success && result.data) {
          const serverFeedback = result.data as ServerFeedbackResponse;

          // 서버 응답을 프론트엔드 구조로 변환
          const feedbackSections = convertServerFeedbackToFeedbackSections(serverFeedback);
          const aiFeedback = convertServerFeedbackToAiFeedback(serverFeedback);

          const updatedLetterData = {
            ...currentLetterData,
            aiFeedback: aiFeedback,
            feedbackSections: feedbackSections,
          };

          // 로컬스토리지에 피드백 데이터 저장
          await saveLetterData(today, {
            aiFeedback: aiFeedback,
            feedbackSections: feedbackSections,
          });

          setLetterData(updatedLetterData);
          console.log('✅ 새로운 피드백 생성 및 저장 완료');
        }
      } catch (err) {
        console.error('피드백 처리 중 오류:', err);
        setSaveError(err instanceof Error ? err.message : '피드백 처리에 실패했습니다.');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열이 비어있어 한 번만 실행됩니다.

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
        {saveError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">오류:</strong>
            <span className="block sm:inline"> {saveError}</span>
          </div>
        )}
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

            <p className="text-white mb-6">
              내 마음과 타인의 이야기가 맞닿은 지금,
              <br />이 답장 편지가 나에게 도착했다면 <br />
              나는 어떤 표정으로 읽게 되었을까요?
            </p>
            <textarea
              className={`w-full h-full min-h-[10vh] bg-[#FFFBEC] text-sm resize-none border-none outline-none overflow-y-auto break-keep rounded-xl p-3 transition-colors duration-200 whitespace-pre-line ${
                myLetter ? 'text-[#222]' : 'text-[#555]'
              }`}
              placeholder={`꼭 적지 않아도 괜찮아요.\n한 번 생각해보는 것만으로도 충분하니까요.`}
              value={myLetter}
              onChange={(e) => setMyLetter(e.target.value)}
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
          <div
            className="p-4.5 rounded-full bg-[#EEEEEE] active:bg-[#DEDEDE] shadow-lg cursor-pointer"
            onClick={async () => {
              try {
                // 1. 사용자가 리뷰를 입력했을 때만 로컬스토리지에 저장
                if (myLetter.trim()) {
                  await saveLetterExerciseReview(myLetter);
                  console.log('✅ 편지 연습 리뷰 저장됨');
                }

                // 2. 편지 연습 전체 내용을 백엔드에 저장
                const today = new Date().toISOString().split('T')[0];
                const emotionData = await getEmotionByDate(today);

                if (!emotionData || !letterData) {
                  throw new Error('필요한 데이터를 찾을 수 없습니다.');
                }

                const saveRequestBody = {
                  userResponse: letterData.userResponse || '',
                  feedback1:
                    letterData.feedbackSections?.emotionConnection || letterData.aiFeedback || '',
                  feedback2Title: letterData.feedbackSections?.empathyReflection?.[0] || '',
                  feedback2Content: letterData.feedbackSections?.empathyReflection?.[1] || '',
                  feedback3Title: letterData.feedbackSections?.improvementSuggestion?.[0] || '',
                  feedback3Content: letterData.feedbackSections?.improvementSuggestion?.[1] || '',
                  review: myLetter.trim() || null,
                  selfempathyId: emotionData.selfEmpathyId,
                };

                const saveResponse = await fetch('/api/mock-letter/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(saveRequestBody),
                });

                if (!saveResponse.ok) {
                  throw new Error('편지 연습 저장에 실패했습니다.');
                }

                const saveResult = await saveResponse.json();

                if (saveResult.success) {
                  console.log('✅ 편지 연습 전체 내용 저장 완료:', saveResult.data);
                  // 저장 완료 후 다음 페이지로 이동
                } else {
                  throw new Error(saveResult.error || '편지 연습 저장에 실패했습니다.');
                }
              } catch (error) {
                console.error('❌ 저장 실패:', error);
                setSaveError(error instanceof Error ? error.message : '저장에 실패했습니다.');
              } finally {
                window.location.href = '/letter-exercise/4';
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
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
