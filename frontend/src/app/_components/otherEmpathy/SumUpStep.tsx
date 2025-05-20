'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function SumUpStep() {
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
        <Link
          href="/"
          className={`w-full rounded-full py-4 bg-[#EEEEEE] text-center shadow active:bg-[#D2D2D2] transition-opacity duration-500 ease-in-out ${
            visibleLines >= textLines.length ? 'opacity-100' : 'opacity-0'
          }`}
        >
          오늘의 마음을 온기섬에 남길게요
        </Link>
      </div>
    </div>
  );
}
