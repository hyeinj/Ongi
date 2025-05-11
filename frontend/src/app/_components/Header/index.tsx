import ChevronLeft from '@/app/_components/icons/ChevronLeft';
import IconButton from '@/app/_components/IconButton';
import StepIndicator from '@/app/_components/StepIndicator';

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 h-15">
      <IconButton>
        <ChevronLeft />
      </IconButton>
      <div>
        <StepIndicator />
      </div>
    </div>
  );
}
