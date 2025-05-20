'use client';

import Link from 'next/link';
import React from 'react';

export default function SumUpStep() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* 메인 텍스트 */}
      <div className="text-center text-white max-w-xs px-4">
        <p className="text-base leading-7">
          오늘 무지님은
          <br />
          자신의 마음을 들여다보고,
          <br />
          누군가에게 마음을 건네고,
          <br />
          또 다른 마음을 조심스레 받아보았어요.
          <br />
          <br />
          그렇게 마음이 연결되는 오늘이 만들어졌어요.
          <br />
          그게 얼마나 대단한 일인지
          <br />
          우리는 잘 알고 있어요.
          <br />
          무지님, 오늘도 수고 많았어요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="w-full absolute bottom-10 px-4 flex justify-center">
        <Link
          href="/other-empathy/4"
          className="w-full rounded-full py-4 bg-[#EEEEEE] text-center shadow active:bg-[#D2D2D2]"
        >
          오늘의 마음을 온기섬에 남길게요
        </Link>
      </div>
    </div>
  );
}
