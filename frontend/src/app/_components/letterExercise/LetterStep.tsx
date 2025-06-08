'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import letterClosedImg from '@/assets/images/letter-closed.png';
import letterOpenedImg from '@/assets/images/letter-opened.png';
import letterOpenedBgImg from '@/assets/images/letter-opened-bg.png';
import LetterContent from './LetterContent';
import Link from 'next/link';

export default function LetterStep() {
  const [isOpen, setIsOpen] = useState(false);
  const [scaleUp, setScaleUp] = useState(false);
  const [showLetterContent, setShowLetterContent] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    // 먼저 확대 애니메이션 시작
    const scaleTimer = setTimeout(() => {
      setScaleUp(true);

      // 0.8초 후 편지 열림 상태로 변경
      const openTimer = setTimeout(() => {
        setIsOpen(true);

        // 1초 후 편지 내용 화면으로 전환 애니메이션 시작
        const contentTimer = setTimeout(() => {
          setAnimating(true);

          // 애니메이션 시작 후 100ms 후에 내용 보이기 (자연스러운 전환을 위해)
          setTimeout(() => {
            setShowLetterContent(true);

            // "두 사람의 마음이 오간 기록을 함께 읽어볼까요?" 표시 후 2초 뒤에 전체 내용 표시
            setTimeout(() => {
              setShowFullContent(true);
            }, 2000);
          }, 100);
        }, 1000);

        return () => clearTimeout(contentTimer);
      }, 800);

      return () => clearTimeout(openTimer);
    }, 1200);

    return () => clearTimeout(scaleTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div
        className={`flex flex-col items-center ${showLetterContent ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          className={`absolute top-1/4 w-100 h-100 transition-all duration-1000 ease-in-out ${
            scaleUp ? 'scale-110' : 'scale-100'
          }`}
        >
          <Image
            src={letterClosedImg}
            alt="닫힌 편지"
            className={`absolute object-contain transition-all duration-1000 ease-in-out ${
              isOpen ? 'opacity-0 rotate-3' : 'opacity-100 rotate-0'
            }`}
            priority
            loading="eager"
          />

          <Image
            src={letterOpenedImg}
            alt="열린 편지"
            className={`absolute object-contain transition-all duration-1000 ease-in-out ${
              isOpen ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
            }`}
            priority
            loading="eager"
          />
        </div>
        <p className="pt-20 text-center text-white text-lg transition-opacity duration-700 ease-in-out">
          익명의 고민 편지가 무지님을 찾아왔어요.
        </p>
      </div>

      <div
        className={`flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`absolute top-1/3 z-10 text-center text-white transition-opacity duration-500 ease-in-out ${
            showFullContent ? 'opacity-0' : 'opacity-100'
          }`}
        ></div>

        {/* 새로운 LetterContent 컴포넌트 */}
        <LetterContent isVisible={showFullContent} />
        <div className="fixed bottom-12 w-full flex justify-end px-8 z-50">
          <Link href="/letter-exercise/2">
            <div className="p-4.5 rounded-full bg-[#EEEEEE] active:bg-[#DEDEDE] shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
        <div
          className={`absolute bottom-0 w-full transition-transform duration-1500 ease-out ${
            showLetterContent ? 'translate-y-0' : 'translate-y-full'
          } ${showFullContent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        >
          <Image
            src={letterOpenedBgImg}
            alt="편지 배경"
            width={500}
            height={350}
            className="w-full h-auto"
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
