import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import nextArrow from '@/assets/icons/otherempathy-next.png';

export default function ReviewStep() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-start justify-start min-h-screen pt-7 pl-4 pr-4 relative">
      <p className="text-white text-base mb-6 text-left whitespace-pre-line">
        이제 모든 여정이 마무리되었어요.
        <br />오늘을 돌아보며 마음에 깃든 온기를,
        <br />나만의 언어로 담아보아요
      </p>
      <textarea
        className="w-full max-w-xl min-h-[180px] bg-[#FFFBEC] text-[#222] text-base rounded-xl p-4 resize-none border-none outline-none mb-6 shadow whitespace-pre-line"
        placeholder={`오늘 여정을 마치며 떠오른 감정이나
나에게 건네고 싶은 말을 자유롭게 적어주세요...`}
      />
        <button
        className="fixed bottom-8 right-3 p-0 bg-transparent border-none shadow-none hover:opacity-80 transition"
        onClick={() => router.push('/other-empathy/3')}
        aria-label="다음"
        >
        <Image src={nextArrow} alt="다음" width={64} height={64} />
        </button>
    </div>
  );
}
