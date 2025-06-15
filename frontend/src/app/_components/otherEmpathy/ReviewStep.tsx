import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import nextArrow from '@/assets/icons/otherempathy-next.png';
import { useLetter } from '@/ui/hooks/useLetter';

export default function ReviewStep() {
  const router = useRouter();
  const [reviewText, setReviewText] = useState('');
  const { saveOtherEmpathyReview, getLetterData } = useLetter();

  // 기존 리뷰 데이터 로드
  useEffect(() => {
    const loadExistingReview = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const letterData = await getLetterData(today);

        if (letterData?.review?.otherEmpathy) {
          setReviewText(letterData.review.otherEmpathy);
          console.log('✅ 기존 other empathy 리뷰 데이터 로드됨');
        }
      } catch (error) {
        console.error('기존 리뷰 데이터 로드 실패:', error);
      }
    };

    loadExistingReview();
  }, [getLetterData]);

  const handleNext = async () => {
    // 리뷰 내용이 있으면 저장
    if (reviewText.trim()) {
      try {
        await saveOtherEmpathyReview(reviewText);
        console.log('✅ Other empathy 리뷰 저장됨');
      } catch (error) {
        console.error('❌ 리뷰 저장 실패:', error);
      }
    }

    router.push('/other-empathy/3');
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen pt-7 pl-4 pr-4 relative">
      <p className="text-white text-base mb-6 text-left whitespace-pre-line">
        이제 모든 여정이 마무리되었어요.
        <br />
        오늘을 돌아보며 마음에 깃든 온기를,
        <br />
        나만의 언어로 담아보아요
      </p>
      <textarea
        className="w-full max-w-xl min-h-[180px] bg-[#FFFBEC] text-[#222] text-base rounded-xl p-4 resize-none border-none outline-none mb-6 shadow whitespace-pre-line"
        placeholder={`오늘 여정을 마치며 떠오른 감정이나
나에게 건네고 싶은 말을 자유롭게 적어주세요...`}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button
        className="fixed bottom-8 right-3 p-0 bg-transparent border-none shadow-none hover:opacity-80 transition"
        onClick={handleNext}
        aria-label="다음"
      >
        <Image src={nextArrow} alt="다음" width={64} height={64} />
      </button>
    </div>
  );
}
