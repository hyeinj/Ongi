import React, { useState, useRef, useEffect } from 'react';
import letterExercisePostBox from '@/assets/images/letter-exercise-post-box.png';
import Image from 'next/image';
import Link from 'next/link';
import ChevronDown from '../icons/ChevronDown';
import localFont from 'next/font/local';
import letterExerciseBig from '@/assets/images/letter-exercise-bird.png';
// ALERT: 클로즈베타 버전에서는 AI 피드백 생성 기능 제거
// import { useLetter } from '@/presentation/hooks/useLetter';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function FeedbackStep() {
  // ALERT: 클로즈베타 버전에서는 AI 피드백 생성 기능 제거
  // const { getLetterData } = useLetter();
  // const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [feedback, setFeedback] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  // const [dataLoaded, setDataLoaded] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ALERT: 클로즈베타 버전에서는 AI 피드백 생성 기능 제거
  // 편지 데이터 로드 (한 번만 실행)
  useEffect(() => {
    // if (dataLoaded) return;

    // const loadLetterData = async () => {
    //   const existingLetter = await getLetterData(currentDate);
    //   if (existingLetter) {
    //     setFeedback(existingLetter.aiFeedback || '');
    //   }
    //   setIsLoading(false);
    //   setDataLoaded(true);
    // };
    // loadLetterData();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []); // 함수를 의존성에서 제거 임시로 currentDate, dataLoaded 제거 나중에 추가해야함

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
            <Image src={letterExerciseBig} alt="letter exercise big" width={100} />
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
        ref={scrollContainerRef}
      >
        <h2 className="text-white text-md mb-6 w-full text-left">
          잠시, 이 편지를 함께 바라볼까요?
          <br />
          무지님의 마음과 사연자의 마음이 닮아 있었어요.
        </h2>

        <div className="pt-4 mb-6 flex-1">
          {feedback ? (
            <div className="bg-[#FFFBEC]/80 rounded-2xl p-4 mb-4">
              <p className="text-gray-800 text-sm leading-7 whitespace-pre-wrap">{feedback}</p>
            </div>
          ) : (
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
            <ChevronDown className="text-white cursor-pointer absolute top-[70vh] left-1/2 -translate-x-1/2" />
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
            <div className="bg-[#FFFBEC]/80 rounded-2xl p-3 mb-8">
              <p className="text-gray-800 text-sm font-bold mb-3">
                사연자의 감정을 먼저 헤아려 보아요.
              </p>
              <p className="text-gray-800 text-sm leading-7">
                &ldquo;누구나 겪는 일이에요&rdquo;처럼 들릴 수 있는 말보다는,
                <br />
                &ldquo;그 상황, 정말 버거우셨겠어요&rdquo;처럼 사연자의 감정을 먼저 인정하는 말이 더
                오래 기억에 남을 거예요.
              </p>
            </div>
            <p className="text-white mb-6">오늘 무지님의 편지는 …</p>

            <div className="bg-[#FFFBEC]/80 rounded-xl p-3">
              <p className="text-gray-800 text-sm leading-7">
                따뜻했고, 다정했고, 무엇보다 스스로에게도 다시 돌아올 수 있는 말이었어요.
                <br />그 마음이 이 여정의 끝에서 오래 머물 수 있길 바라요.
              </p>
            </div>
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
            <p className="text-white mb-1 leading-7">
              마음을 건네고, 마음을 받아보는 일.
              <br />
              그 연결의 여정을
              <br />
              계속 이어가볼까요?
            </p>
          </div>
          <Link href="/other-empathy/1">
            <button className="bg-white rounded-full px-20 py-3 shadow-md">완료</button>
          </Link>
        </div>

        <Image
          src={letterExercisePostBox}
          alt="post box"
          width={130}
          className="absolute bottom-15 left-0"
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
