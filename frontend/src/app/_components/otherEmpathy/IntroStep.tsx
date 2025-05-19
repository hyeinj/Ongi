'use client';

import Link from 'next/link';
import React from 'react';

export default function IntroStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {' '}
      <div className="text-center text-white">
        <p className="text-base">
          이제,
          <br />
          온기 사연자님이 남긴 진심 어린 편지와
          <br />
          온기우체부의 따뜻한 마음을 담은
          <br />
          답장을 읽어보며
          <br />그 온기를 느껴보세요.
        </p>
      </div>
      <div className="w-full absolute bottom-10 px-4 flex justify-center">
        <Link
          href="/other-empathy/2"
          className="w-full rounded-full py-4 bg-[#EEEEEE] text-center shadow active:bg-[#D2D2D2]"
        >
          마음을 건네받을게요
        </Link>
      </div>
    </div>
  );
}
