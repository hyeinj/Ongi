"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LetterStorage } from "@/services/storage/letterStorage";
import { EmotionStorage } from "@/services/storage/emotionStorage";
import Image from "next/image";
import postboxIcon from "@/assets/images/postbox-icon.png";
import localFont from "next/font/local";

const garamFont = localFont({
  src: "../../../../../assets/fonts/gaRamYeonGgoc.ttf",
});


type EmotionData = {
  category: string;
  emotion: string;
  entries: {
    step2?: EntryStep;
    step3?: EntryStep;
    step4?: EntryStep;
    step5?: EntryStep;
    step6?: EntryStep;
    step7?: EntryStep;
  };
  aiFeedback?: string;
};

type EntryStep = {
  question: string;
  answer: string;
};

type LetterData = {
  mockLetter?: string;
  userResponse?: string;
  feedbackSections?: FeedbackSections;
  realLetterId?: string;
  highlightedParts?: string[];
};

type FeedbackSections = {
  emotionConnection?: string;
  empathyReflection?: string[];
  improvementSuggestion?: string[];
  overallComment?: string;
};




const LetterDetailPage = () => {
    const { date } = useParams() as { date: string; type: string };
    const [letter, setLetter] = useState<LetterData | null>(null);
    const [emotion, setEmotion] = useState<EmotionData | null>(null);

    // 상태/탭
    const [activeTab, setActiveTab] = useState<'self' | 'letter' | 'others'>('self');
    const [contentTitle, setContentTitle] = useState<string>('하나, 이 날의 나는 이런 마음을 꺼내보았어요.');
    const [toggleTitle, setToggleTitle] = useState<string>();

    const tabTitles = {
        self: ['하나, 이 날의 나는 이런 마음을 꺼내보았어요.', '내 기록을 다시 읽어볼까요?'],
        letter: ['둘, 이 날의 나는 누군가의 마음에 답장을 보냈어요.', '내가 쓴 편지를 다시 읽어볼까요?'],
        others: ['셋, 이 문장이 이 날의 나에게 소중히 남았어요.', '온기우체부의 편지를 다시 읽어볼까요?'],
    };

    const changeTab = (tab: 'self' | 'letter' | 'others') => {
        setActiveTab(tab);
        const titles = tabTitles[tab];
        setContentTitle(titles[0]);
        setToggleTitle(titles[1]);
    };

    useEffect(() => {
        const fetch = async () => {
        const letterStorage = new LetterStorage();
        const emotionStorage = new EmotionStorage();

        const l = await letterStorage.getByDate(date);
        const e = await emotionStorage.getByDate(date);

        setLetter(l);
        setEmotion(e);
        };

        fetch();
  }, [date]);

  if (!letter && !emotion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-amber-800">기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full ${garamFont.className}`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <div className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] overflow-y-auto break-keep">
        <div className="w-full flex justify-end pr-3">
        <div className="flex space-x-[-8px]">
            {['self', 'letter', 'others'].map((tab) => (
            <button
                key={tab}
                className={`py-1 px-4 rounded-t-lg text-sm transition-colors ${
                activeTab === tab
                    ? 'bg-[#FFDB68] text-black font-medium z-10'
                    : 'bg-[#919191] text-black active:bg-[#fee9a1]'
                }`}
                onClick={() => changeTab(tab as 'self' | 'letter' | 'others')}
            >
                {tab === 'self' ? '자기공감' : tab === 'letter' ? '편지쓰기' : '타인공감'}
            </button>
            ))}
        </div>
        </div>


          <div className="flex flex-col items-center mb-5 relative">
            <Image
              src={postboxIcon}
              alt="편지함 아이콘"
              width={50}
              height={50}
              priority
              loading="eager"
            />

            <h3 className="text-center mt-3 font-medium text-lg text-amber-800 whitespace-pre-line">
              {date}
            </h3>
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="text-md font-semibold text-amber-900">{contentTitle}</h4>
            <p className="text-gray-700 whitespace-pre-line">
                {activeTab === 'self' && (emotion?.aiFeedback ?? '자기공감 피드백이 없어요.')}
                {activeTab === 'others' && (letter?.highlightedParts ?? '편지에 대한 하이라이트가 없어요.')}
            </p>
            {activeTab === 'letter' && (
                <div className="space-y-2 mt-4">
                    <p className="text-amber-800">무지님의 마음과 사연자의 마음은 닮아 있었어요.</p>
                    <p className="text-gray-700">
                        {letter?.feedbackSections?.emotionConnection ?? '첫번째 피드백이 없어요.'}
                    </p>

                    <p className="text-amber-800">그리고 편지 속에 이런 한 마디를 남기셨죠.</p>
                    <p className="text-amber-700">&quot;{letter?.feedbackSections?.empathyReflection?.[0] }&quot;</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.empathyReflection?.[1] ?? '두번째 피드백이 없어요.'}</p>
                    
                    
                    <p className="text-amber-800">추가로, 편지에서 이런 점을 개선할 수 있었어요.</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.improvementSuggestion?.[0]}</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.improvementSuggestion?.[1] ?? '세번째 피드백이 없어요.'}</p>
                    
                </div>
                )}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="text-sm text-amber-700 underline">
              {toggleTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterDetailPage;