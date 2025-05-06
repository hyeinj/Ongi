import React from 'react';
import { useLetter } from './LetterContext';

export default function FeedbackStep() {
  const { resetLetter } = useLetter();

  const handleRestart = () => {
    resetLetter();
    // 여기에 이전 단계로 돌아가는 로직을 추가할 수 있습니다
  };

  return (
    <div className="flex flex-col h-full w-full py-10 px-6">
      <h2 className="text-white text-xl mb-6">소중한 마디</h2>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-5 mb-6 flex-1">
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <p className="text-gray-800 text-sm">
            &ldquo;당신의 글에는 진심이 느껴지는 따뜻한 말들로 가득해요. 하지만 더 구체적인 경험을
            담으면 더욱 소중한 편지가 될 것 같아요.&rdquo;
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <p className="text-gray-800 text-sm">
            &ldquo;시작과 마무리가 자연스럽고 따스한 문장으로 이루어져 있어요. 중간 부분에 더 많은
            이야기를 담아보세요.&rdquo;
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4">
          <p className="text-gray-800 text-sm">
            &ldquo;가장 좋은 편지는 마음에서 우러나오는 솔직한 감정표현이 담긴 편지입니다. 당신의
            마음을 더 자유롭게 표현해 보세요.&rdquo;
          </p>
        </div>
      </div>

      <div className="bg-yellow-200/90 rounded-lg p-4">
        <button
          onClick={handleRestart}
          className="w-full py-2 bg-yellow-400 rounded-lg font-medium text-gray-700"
        >
          편지 다시 작성하기
        </button>
      </div>
    </div>
  );
}
