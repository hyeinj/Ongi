import React, { useMemo } from 'react';
import LetterClosed from '@/app/_components/icons/Letter';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="letters">
      {rowCounts.map((count, visualRowIndex) => {
        const rowIndex = rowCounts.length - 1 - visualRowIndex;

        return Array.from({ length: count }).map((_, i) => {
          const index = rowCounts.slice(0, visualRowIndex) // 이전 줄들만 잘라내기
                    .reduce((sum, num) => sum + num, 0) // 이전 줄까지 편지 몇 개 있었는지
                    + i; // 현재 줄의 i번째 편지 번호

          const date = letterDates[index];
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
                <LetterClosed width={48} height={31} date={new Date(date).getDate()}/>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default LetterVisualization;
