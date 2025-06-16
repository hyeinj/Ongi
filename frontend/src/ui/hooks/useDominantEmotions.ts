import { useEffect, useState, useMemo } from "react";
import { EmotionStorage } from "@/services/storage/emotionStorage";
import type { EmotionType } from "@/core/entities/emotion";

export const useDominantEmotions = (dates: string[], category: string) => {
  const [dominantEmotions, setDominantEmotions] = useState<EmotionType[]>([]);
  const emotionStorage = useMemo(() => new EmotionStorage(), []);

  useEffect(() => {
    if (dates.length === 0) return;

    const fetch = async () => {
      const emotionCount: Record<EmotionType, number> = {
        joy: 0,
        peace: 0,
        sadness: 0,
        anger: 0,
        anxiety: 0,
      };

      for (const date of dates) {
        const data = await emotionStorage.getByDate(date);
        if (data?.category === category) {
          emotionCount[data.emotion]++;
        }
      }

      const maxCount = Math.max(...Object.values(emotionCount));
      const dominant = Object.entries(emotionCount)
        .filter(([, count]) => count === maxCount && count > 0)
        .map(([emotion]) => emotion as EmotionType);

      setDominantEmotions(prev =>
        JSON.stringify(prev) !== JSON.stringify(dominant) ? dominant : prev
      );
    };

    fetch();
  }, [dates, category, emotionStorage]); // ✅ 깔끔한 버전

  return dominantEmotions;
};
