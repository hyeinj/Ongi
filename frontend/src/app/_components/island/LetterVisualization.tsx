import React, { useEffect, useState, useMemo } from 'react';
import LetterClosed from '@/app/_components/icons/Letter';
import { useRouter } from 'next/navigation';
import { getLetterEmotionStatuses, EmotionStatus } from '@/ui/hooks/useLetterEmotionStatus';

interface Props {
  letterDates: string[];
  total: number;
  category: string; // 현재 섬 종류 ('self', 'growth'...)
}

const LetterVisualization = ({ letterDates, total, category }: Props) => {
  const router = useRouter();
  const rowCounts = [5, 5, total - 10];

  const randomAngles = useMemo(() => {
    return Array.from({ length: letterDates.length }, () => Math.random() * 20 - 10);
  }, [letterDates.length]);

  // emotion으로 날짜가 있는지 확인 
  const [emotionStatuses, setEmotionStatuses] = useState<Record<string, EmotionStatus>>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusMap = await getLetterEmotionStatuses(letterDates, category);
      setEmotionStatuses(statusMap);
    };
    fetchStatuses();
  }, [letterDates, category]);

  return (
    <div className="letters">
      {rowCounts.map((count, visualRowIndex) => {
        const rowIndex = rowCounts.length - 1 - visualRowIndex;

        return Array.from({ length: count }).map((_, i) => {
          const index = rowCounts.slice(0, visualRowIndex) // 이전 줄들만 잘라내기
                    .reduce((sum, num) => sum + num, 0) // 이전 줄까지 편지 몇 개 있었는지
                    + i; // 현재 줄의 i번째 편지 번호

          const date = letterDates[index];
          const status = emotionStatuses[date]; // "match" | "mismatch" | "none"
          let variant: "colored" | "white" | "dashed";
          let emotion: "joy" | "peace" | "sadness" | "anger" | "anxiety" | undefined;

          if (status?.type === "match") {
            variant = "colored";
            emotion = status.emotion;
          } else if (status?.type === "mismatch") {
            variant = "white";
          } else {
            variant = "dashed";
          }

          if (!date) return null;

          const angleGap = 21;
          const startAngle = -((count - 1) / 2) * angleGap;
          const angle = startAngle + i * angleGap;
          const randomAngle = randomAngles[index] ?? 0;
          // const randomAngle = Math.random() * 20 - 10; // -10 ~ +10도 무작위 회전

          const radius = 150 + rowIndex * 30;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad) - rowIndex * 50;

          return (
            <div
              key={date}
              style={{
                position: 'absolute',
                left: `calc(43% + ${x}px)`,
                top: `calc(190% + ${y}px)`,
                transform: `rotate(${randomAngle}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <div
                className="letter-box"
                style={{
                  animation: 'letterFloat 4s ease-in-out infinite',
                }}
                onClick={() => router.push(`/island/${category}/date/${date}`)}
              >
                <LetterClosed width={48} height={31} 
                date={new Date(date).getDate()} 
                variant={variant}
                emotion={emotion}/>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default LetterVisualization;
