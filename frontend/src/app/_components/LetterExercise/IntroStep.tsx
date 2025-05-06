import Image from 'next/image';
import letterImage from '@/assets/letter.png';

export default function IntroStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-6 pt-20 pb-10">
      <h1 className="text-white text-xl font-semibold mb-6">
        익명의 손편지가 무지님을 찾아왔어요.
      </h1>

      <div className="bg-white/25 backdrop-blur-sm rounded-full px-6 py-3 mb-10 shadow-md">
        <p className="text-white text-sm italic">
          &ldquo;매일이 전쟁 같은 시간 속, 숨 쉴 틈이 필요해요.&rdquo;
        </p>
      </div>

      <div className="w-64 h-auto md:w-80">
        <Image
          src={letterImage}
          alt="편지 봉투 이미지"
          width={500} // 원본 이미지 비율에 맞게 조절
          height={350} // 원본 이미지 비율에 맞게 조절
          layout="responsive"
          priority
        />
      </div>
    </div>
  );
}
