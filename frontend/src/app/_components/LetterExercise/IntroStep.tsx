import Image from 'next/image';
import letterImage from '@/assets/letter.png';

export default function IntroStep() {
  return (
    <div className="flex flex-col items-center justify-around h-full w-full text-center px-6 py-10 opacity-100">
      <div className="mt-16">
        <h1 className="text-white text-2xl font-semibold mb-6">
          익명의 손편지가 무지님을 찾아왔어요.
        </h1>
        <div className="bg-white/25 backdrop-blur-sm rounded-full px-6 py-3 mb-10 shadow-md max-w-sm mx-auto">
          <p className="text-white text-sm italic">
            &ldquo;매일이 전쟁 같은 시간 속, 숨 쉴 틈이 필요해요.&rdquo;
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-4 mb-10">
        <Image
          src={letterImage}
          alt="편지 봉투 이미지"
          width={500}
          height={350}
          layout="responsive"
          priority
        />
      </div>
    </div>
  );
}
