import Image from 'next/image';
import backgroundImage from '@/assets/letterExerciseBackground.png';

export default function LetterExerciseBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen">
      <Image src={backgroundImage} alt="편지 배경 이미지" fill priority />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
