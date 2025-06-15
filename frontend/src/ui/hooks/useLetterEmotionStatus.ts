import { EmotionStorage } from "@/services/storage/emotionStorage";
import type { EmotionType, Category } from "@/core/entities/emotion";

export type EmotionStatus =
  | { type: "match"; emotion: EmotionType }
  | { type: "mismatch"; category: Category}
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
      statuses[date] = { 
        type: "mismatch",
        category: emotion.category, 
      };
    }
  }

  return statuses;
};
