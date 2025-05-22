import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import letterExerciseDotImage from '@/assets/images/letter-exercise-dot-img.png';
import { useLetter } from '@/presentation/hooks/useLetter';
import paperPlane from '@/assets/icons/paper-plane.png';

export default function WritingStep() {
  const { saveUserResponse, generateFeedback, getLetterData } = useLetter();
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [letterContent, setLetterContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();

  // 기존 답장 데이터 로드 (한 번만 실행)
  useEffect(() => {
    if (dataLoaded) return;

    const loadLetterData = async () => {
      const existingLetter = await getLetterData(currentDate);
      if (existingLetter) {
        setLetterContent(existingLetter.userResponse || '');
      }
      setDataLoaded(true);
    };
    loadLetterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, dataLoaded]); // 함수를 의존성에서 제거

  const handleLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterContent(e.target.value);
  };

  const handleSendLetter = async () => {
    if (letterContent.trim()) {
      setIsLoading(true);
      await saveUserResponse(currentDate, letterContent);
      await generateFeedback(currentDate);
      setIsLoading(false);
      router.push('/letter-exercise/3');
    }
  };

  return (
    <div className="flex flex-col h-full w-full py-10 px-6">
      <h2 className="text-white text-md mb-6">당신의 마음을 담아, 적어볼까요?</h2>

      <div className="  mb-8">
        <ul className="space-y-1 text-white font-thin text-sm">
          <li className="flex items-center gap-2">
            <Image src={letterExerciseDotImage} alt="점" width={14} height={14} />
            <p>상대방의 감정에 초점을 맞추어 보세요.</p>
          </li>
          <li className="flex items-center gap-2">
            <Image src={letterExerciseDotImage} alt="점" width={14} height={14} />
            <p>판단보다는 이해를 바탕으로 응답해 보세요.</p>
          </li>
          <li className="flex items-center gap-2">
            <Image src={letterExerciseDotImage} alt="점" width={14} height={14} />
            <p>자신의 경험을 나누되, 상대의 감정을 중심에 두세요.</p>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-5 overflow-hidden">
        <div className="w-full h-full">
          <textarea
            className="w-full h-full min-h-[50vh] bg-transparent text-white placeholder-white/50 resize-none border-none outline-none font-thin overflow-y-auto break-keep"
            placeholder="※ 가상의 인물에게 보내지는 편지이니, 마음 편히 당신의 이야기를 꺼내보셔도 좋아요."
            value={letterContent}
            onChange={handleLetterChange}
          />
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-12 left-0 w-full z-50 flex justify-center">
        <div className="flex w-full px-4 gap-2">
          <Link href="/letter-exercise/1?introStepShown=true">
            <div className="px-6 py-3 rounded-full bg-[#FAF2E2] active:bg-[#F4E8D1] shadow-lg">
              <span className="text-black font-medium">편지 다시보기</span>
            </div>
          </Link>

          <button
            onClick={handleSendLetter}
            disabled={!letterContent.trim() || isLoading}
            className="flex-1 px-6 py-3 rounded-full bg-[#EEEEEE] active:bg-[#F4E8D1] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-black font-medium">
              {isLoading ? (
                '전송 중...'
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <Image src={paperPlane} alt="전송" width={30} height={30} />
                  <span className="text-black font-medium">전송하기</span>
                </div>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
