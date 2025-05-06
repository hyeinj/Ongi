import Image from 'next/image';
import letterIcon from '@/assets/letter.png'; // 기존 letter.png 파일 사용

export default function IntroStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      <h1 className="text-white text-xl mb-8">당신의 소중한 누군가에게 편지를 보내세요.</h1>
      <div className="relative mb-6">
        <Image
          src={letterIcon}
          alt="편지 아이콘"
          width={120}
          height={120}
          className="animate-pulse"
        />
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full max-w-xs">
        <p className="text-white text-center text-sm">
          &ldquo;당신이 생각하는 소중한 사람에게 편지를 써보세요.&rdquo;
        </p>
      </div>
    </div>
  );
}
