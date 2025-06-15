"use client";

import { useEffect } from "react";
import { EmotionStorage } from "@/services/storage/emotionStorage";
import { LetterStorage } from "@/services/storage/letterStorage";
import { Category, EmotionType } from "@/core/entities/emotion"
import dummyData from "./dummyData.json"; 

const emotionStorage = new EmotionStorage();
const letterStorage = new LetterStorage();

const InitDummyData = () => {
  useEffect(() => {
    const initialize = async () => {
      for (const entry of dummyData) {
        const { date, emotionData, letterData } = entry;

        // 1. 감정 저장
        await emotionStorage.updateCategoryAndEmotion(date, emotionData.category as Category, emotionData.emotion as EmotionType);

        // 2. 엔트리 저장
        for (const [step, entryValue] of Object.entries(emotionData.entries || {})) {
          await emotionStorage.saveStageEntry(date, step, entryValue);
        }

        // 3. AI 피드백 저장
        if (emotionData.aiFeedback) {
          await emotionStorage.saveAIFeedback(date, emotionData.aiFeedback);
        }

        // 4. 편지 저장
        await letterStorage.saveLetter(date, {
          userResponse: letterData.userResponse || "",
          highlightedParts: letterData.highlightedParts || [],
          feedbackSections: letterData.feedbackSections || undefined,
        });

        // 5. RealLetter 저장
        if (letterData.realLetterData) {
          await letterStorage.saveRealLetter(date, letterData.realLetterData);
        }
      }
      console.log("✅ Dummy data successfully initialized!");
    };

    initialize();
  }, []);

  return null;
};

export default InitDummyData;
