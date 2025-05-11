import Header from '@/app/_components/Header';

export default function LetterExerciseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
