import Image, { StaticImageData } from 'next/image';

export default function BackgroundImage({
  children,
  backgroundImage,
}: {
  children: React.ReactNode;
  backgroundImage: StaticImageData;
}) {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="편지 배경 이미지"
          fill
          priority
          loading="eager"
          style={{ objectFit: 'cover', zIndex: -1 }}
        />
      </div>
      <div className="relative h-full w-full z-10">{children}</div>
    </div>
  );
}
