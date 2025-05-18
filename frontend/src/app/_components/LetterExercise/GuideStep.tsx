import React from 'react';
import Image from 'next/image';
import letterImage from '@/assets/images/letter.png'; // 기존 letter.png 파일 사용

export default function GuideStep() {
  return (
    <div className="flex flex-col h-full w-full py-10 px-6">
      <h2 className="text-white text-xl mb-6">어떻게 편지를 쓰나요?</h2>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-5 mb-8">
        <ul className="space-y-3 text-white">
          <li className="flex items-start">
            <div className="mr-2 mt-1 text-yellow-200">➜</div>
            <p>마음속에 있는 이야기를 솔직하게 표현하세요.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-1 text-yellow-200">➜</div>
            <p>상대방에게 고마웠던 경험이나 사건을 떠올려보세요.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-1 text-yellow-200">➜</div>
            <p>서로에 대한 감정이나, 소망을 담아보세요.</p>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center flex-1">
        <div className="text-center">
          <Image
            src={letterImage}
            alt="편지 이미지"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <p className="text-white text-sm">편지 쓰기</p>
        </div>
      </div>
    </div>
  );
}
