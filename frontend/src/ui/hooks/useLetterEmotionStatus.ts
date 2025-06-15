// import { EmotionStorage } from "@/services/storage/emotionStorage";

// export type EmotionStatus =
//   | { type: "match"; emotion: "joy" | "peace" | "sadness" | "anger" | "anxiety" }
//   | { type: "mismatch" }
//   | { type: "none" };

// const isValidEmotion = (
//   value: string
// ): value is EmotionStatus["emotion"] => {
//   return ["joy", "peace", "sadness", "anger", "anxiety"].includes(value);
// };

// export const getLetterEmotionStatuses = async (
//   dates: string[],
//   currentCategory: string
// ): Promise<Record<string, EmotionStatus>> => {
//   const emotionStorage = new EmotionStorage();
//   const statuses: Record<string, EmotionStatus> = {};

//   for (const date of dates) {
//     const emotion = await emotionStorage.getByDate(date);

//     if (!emotion) {
//       statuses[date] = { type: "none" };
//     } else if (emotion.category === currentCategory && isValidEmotion(emotion.emotion)) {
//       statuses[date] = {
//         type: "match",
//         emotion: emotion.emotion,
//       };
//     } else {
//       statuses[date] = { type: "mismatch" };
//     }
//   }

//   return statuses;
// };

import { EmotionStorage } from "@/services/storage/emotionStorage";
import type { EmotionType } from "@/core/entities/emotion";

export type EmotionStatus =
  | { type: "match"; emotion: EmotionType }
  | { type: "mismatch" }
  | { type: "none" };

export const getLetterEmotionStatuses = async (
  dates: string[],
  currentCategory: string
): Promise<Record<string, EmotionStatus>> => {
  const emotionStorage = new EmotionStorage();
  const statuses: Record<string, EmotionStatus> = {};

  for (const date of dates) {
    const emotion = await emotionStorage.getByDate(date); // 타입 불일치 주의 

    if (!emotion) {
      statuses[date] = { type: "none" };
    } else if (emotion.category === currentCategory) {
      statuses[date] = {
        type: "match",
        emotion: emotion.emotion,
      };
    } else {
      statuses[date] = { type: "mismatch" };
    }
  }

  return statuses;
};
