import React from 'react';
import { useLetter } from '../../_store/LetterContext';

export default function LetterWritingStep() {
  const { letter, setRecipient, setContent, setSender } = useLetter();

  return (
    <div className="flex flex-col h-full w-full py-10 px-6">
      <div className="bg-yellow-50/90 rounded-lg p-4 flex-1 shadow-xl flex flex-col">
        <div className="mb-4">
          <h3 className="text-gray-700 text-sm mb-1">To, 누구</h3>
          <input
            type="text"
            value={letter.recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-gray-800 pb-1"
            placeholder="받는 사람"
          />
        </div>

        <div className="flex-1 mb-4">
          <textarea
            value={letter.content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-800 leading-relaxed"
            placeholder="오늘도 잘 지내고 있나요?&#10;늘 당신 생각을 하네요...&#10;&#10;이번에 내가 이런 경험을 했는데...&#10;&#10;그냥 당신과 나눠보고 싶었어요.&#10;&#10;다음에 만나면 차 한잔 해요."
          />
        </div>

        <div className="self-end">
          <h3 className="text-gray-700 text-sm mb-1">From, 나의 이름</h3>
          <input
            type="text"
            value={letter.sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-gray-800 pb-1"
            placeholder="보내는 사람"
          />
        </div>
      </div>
    </div>
  );
}
