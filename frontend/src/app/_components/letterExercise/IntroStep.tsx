import { useEffect, useState } from 'react';
import Image from 'next/image';
import letterImage from '@/assets/images/letter.png';
import localFont from 'next/font/local';
import { useLetter } from '@/store/LetterContext';
import letterExerciseLetterBg from '@/assets/images/letter-exercise-letter-bg.png';
import letterExerciseLetterTopIcon from '@/assets/images/postbox-icon.png';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function IntroStep() {
  const { introStepShown, setIntroStepShown } = useLetter();
  const [showContent, setShowContent] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!introStepShown) {
      // 2초 후 페이드아웃 시작
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      // 페이드아웃 후 컴포넌트 숨기기
      const hideTimeout = setTimeout(() => {
        setShowContent(false);
        setIntroStepShown(true);
      }, 2500); // 페이드아웃 애니메이션 시간 0.5초 포함

      return () => {
        clearTimeout(timeout);
        clearTimeout(hideTimeout);
      };
    } else {
      // 이미 보여진 경우 바로 숨김
      setShowContent(false);
    }
  }, [introStepShown, setIntroStepShown]);

  if (!showContent) {
    // 인트로 단계가 끝나면 아무것도 렌더링하지 않음
    return <LetterContent />;
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

const LetterContent = () => {
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
        <div className={`text-center ${garamFont.className} py-4 text-[#6A3C00] font-extrabold`}>
          자기 계발과 끝없는 업무 속에서,
          <br /> 버텨내는 매일이 너무 힘겹게 느껴져요.
        </div>
        <div className={` mb-6 ${garamFont.className} leading-8`}>
          무지님, 안녕하세요.
          <br />
          저는 요즘 정말 힘든 시간을 보내고 있습니다.
          <br />
          직장에서는 업무가 끊임없이 늘어나고,
          <br />
          퇴근 후에도 자기 계발을 위한 공부를 해야 하는데
          <br />
          시간이 턱없이 부족해 매일 스트레스로
          <br />
          가득한 나날을 보내고 있어요. <br />
          <br />
          이런 상황에서 어떻게 하면 좋을까요? <br />
          무지님은 이런 제 마음을 헤아려주실 수 있을 것 같아요.
        </div>
      </div>
    </div>
  );
};
