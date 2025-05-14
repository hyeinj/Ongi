import { useEffect, useState } from 'react';
import Image from 'next/image';
import letterImage from '@/assets/images/letter.png';
import localFont from 'next/font/local';
import { useLetter } from '@/app/_store/LetterContext';

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
  return <div>hihi</div>;
};
