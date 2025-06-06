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
};

type EntryStep = {
  question: string;
  answer: string;
};

type LetterData = {
  aiFeedback?:string; // 삭제
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
              {date}의 마음
            </h3>
            <p>하나, 이 날의 나는 이런 마음을 꺼내보았어요.</p>
            <p className="text-end text-sm text-amber-700 mt-1 w-full">
              감정: {emotion?.emotion ?? "없음"}
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="text-md font-semibold text-amber-900">🟨 AI 피드백</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {letter?.mockLetter ?? "피드백이 없습니다."}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <button className="text-sm text-amber-700 underline">
              내 기록을 다시 읽어볼까요?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterDetailPage;