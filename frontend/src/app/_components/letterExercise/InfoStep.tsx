'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';

const garamFont = localFont({
  src: '../../../assets/fonts/gaRamYeonGgoc.ttf',
});

export default function InfoStep() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 페이드인 효과
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-screen px-6 transition-opacity duration-1000 ease-in-out ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`text-center text-white mb-20 ${garamFont.className}`}>
        <p className="text-xl leading-8 mb-6">
          당신이 조심스레 건넨 마음은
          <br />
          어쩌면, 당신 스스로에게도
          <br />
          따뜻한 울림으로 돌아왔을지도 몰라요.
        </p>

        <p className="text-xl leading-8 mb-6">
          이번엔, 같은 고민 편지를 마주했던
          <br />
          온기우체부의 답장을 만나볼 거에요.
        </p>

        <p className="text-xl leading-8 mb-6">
          당신의 답장과 닮은 점이 있을 수도,
          <br />
          전혀 다른 시선이 담겨 있을 수도 있어요.
        </p>

        <p className="text-xl leading-8 mb-8">
          어떤 이야기든
          <br />그 안에 담긴 따뜻함을 느끼며 읽어보아요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-full px-6">
        <Link href="/other-empathy/1">
          <button
            className={`bg-white text-gray-800 w-full py-2 rounded-full text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 ${garamFont.className}`}
          >
            답장의 온기를 받아볼게요
          </button>
        </Link>
      </div>
    </div>
  );
}
