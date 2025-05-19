'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import letterClosedImg from '@/assets/images/letter-closed.png';
import letterOpenedImg from '@/assets/images/letter-opened.png';
import letterOpenedBgImg from '@/assets/images/letter-opened-bg.png';
import mailboxIcon from '@/assets/images/postbox-icon.png';

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

            // "두 사람의 마음이 오간 기록을 함께 읽어볼까요?" 표시 후 1초 뒤에 전체 내용 표시
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
          className={`absolute top-1/4 w-90 h-90 transition-all duration-1000 ease-in-out ${
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
          />

          <Image
            src={letterOpenedImg}
            alt="열린 편지"
            className={`absolute object-contain transition-all duration-1000 ease-in-out ${
              isOpen ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
            }`}
            priority
          />
        </div>
        <p className="pt-20 text-center text-white text-lg transition-opacity duration-700 ease-in-out">
          편지가 도착했어요.
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
        >
          <p className="text-lg">
            두 사람의 마음이 오간 기록을
            <br />
            함께 읽어볼까요?
          </p>
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${
            showFullContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute top-0 w-full flex justify-end px-4 py-2">
            <div className="flex space-x-2">
              <button className="py-1 px-3 bg-yellow-500 rounded-full text-sm text-black">
                고민편지
              </button>
              <button className="py-1 px-3 bg-white rounded-full text-sm text-black">
                답장편지
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg max-w-md w-full mx-auto p-6 z-20 shadow-lg">
            <div className="flex flex-col items-center mb-4">
              <Image src={mailboxIcon} alt="편지함 아이콘" width={50} height={50} priority />
              <h3 className="text-center mt-2 font-medium text-lg">
                현재를 전체적인 관점에서 의욕고 지키는 것과 같아요.
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              안녕하세요, 다니엘 지금은 고민두고 나눠보는 마음 깊은 대화에 참가하네요.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              아쉬워 됐을 내에 카카오 워킹룸 안에서, 공에 카카오 지는 직만 토스도 전체를 전체네는
              것이 고작된 것 같아요.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              이 간 전체에 지는 중용 취득고 커패시티도 것만 같아요. 다시 쓸이 굉장히, 전반으로
              치요하고, 심층레벨 넘어진 즐겁습니다.
            </p>

            <p className="text-sm text-gray-700">
              지금에 카면 고민이 없겠죠? 당울 추석이면, 조금씩 게 마음을 담아 감사하겠습니다.
            </p>
          </div>
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
          />
        </div>
      </div>
    </div>
  );
}
