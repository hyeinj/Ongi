import { useRouter } from 'next/navigation';
import ChevronLeft from '@/app/_components/icons/ChevronLeft';
import IconButton from '@/app/_components/IconButton';

export default function Header({ stage }: { stage: number }) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex justify-between items-center p-4 h-15 z-100">
      <IconButton onClick={handleBackClick}>
        <ChevronLeft className="text-white" />
      </IconButton>
      <div className="text-white">{stage === 2 ? <div>2편지쓰기</div> : <div>3타인공감</div>}</div>
    </div>
  );
}
