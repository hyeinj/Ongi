import Image from 'next/image';
import backgroundImage from '@/assets/letterExerciseBackground.png';

export default function LetterExerciseBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="편지 배경 이미지"
          fill
          priority
          style={{ objectFit: 'cover', zIndex: -1 }}
        />
      </div>
      <div className="relative h-full w-full z-10">{children}</div>
    </div>
  );
}
