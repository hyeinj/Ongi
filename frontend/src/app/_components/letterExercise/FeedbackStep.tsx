import React, { useState, useRef } from 'react';
import letterExercisePostBox from '@/assets/images/letter-exercise-post-box.png';
import Image from 'next/image';
import ChevronDown from '../icons/ChevronDown';
import localFont from 'next/font/local';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function FeedbackStep() {
  const [isOpen, setIsOpen] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="flex flex-col h-[70vh] w-full py-10 px-4 items-center overflow-y-auto"
      ref={scrollContainerRef}
    >
      <h2 className="text-white text-md mb-6 w-full text-left">
        잠시, 이 편지를 함께 바라볼까요?
        <br />
        무지님의 마음과 사연자의 마음이 닮아 있었어요.
      </h2>

      <div className="pt-4 mb-6 flex-1">
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
      </div>
      {!isOpen && (
        <button onClick={handleChevronClick}>
          <ChevronDown className="text-white cursor-pointer" />
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
        <button className="bg-white rounded-full px-20 py-3 shadow-md">네, 좋아요</button>
      </div>

      <Image
        src={letterExercisePostBox}
        alt="post box"
        width={130}
        className="absolute bottom-15 left-0"
      />
    </div>
  );
}
