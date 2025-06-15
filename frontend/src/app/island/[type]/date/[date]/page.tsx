"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LetterStorage } from "@/services/storage/letterStorage";
import { EmotionStorage } from "@/services/storage/emotionStorage";
import Image from "next/image";
import postboxIcon from "@/assets/images/postbox-icon.png";
import localFont from "next/font/local";

const garamFont = localFont({
  src: "../../../../../assets/fonts/gaRamYeonGgoc.ttf",
});


// 데이터
// emotion 로컬스토리지
type EmotionData = {
  category: string;
  emotion: string;
  entries: {
    step2?: EntryStep;
    step3?: EntryStep;
    step4?: EntryStep;
    step5?: EntryStep;
    step6?: EntryStep;
  };
  aiFeedback?: string;
};

type EntryStep = {
  question: string;
  answer: string;
};

// letters 로컬스토리지
type LetterData = {
  userResponse?: string;
  feedbackSections?: FeedbackSections;
  highlightedParts?: string[];
  realLetterData?: RealLetterData;
};

type FeedbackSections = {
  emotionConnection?: string;
  empathyReflection?: string[];
  improvementSuggestion?: string[];
  overallComment?: string;
};

type RealLetterData = {
  answerContent: RealLetterContentItem[];  
  worryContent: RealLetterContentItem[];   
  emotion: string;
  category?: string;
  selectedAt: string;
};

type RealLetterContentItem = {
  id: string;
  text: string;
};




const LetterDetailPage = () => {
    const { date } = useParams() as { date: string; type: string };
    const [letter, setLetter] = useState<LetterData | null>(null);
    const [emotion, setEmotion] = useState<EmotionData | null>(null);

    // 상태/탭
    const [activeTab, setActiveTab] = useState<'self' | 'letter' | 'others'>('self');
    const [contentTitle, setContentTitle] = useState<string>('하나, 이 날의 나는 이런 마음을 꺼내보았어요.');
    const [toggleTitle, setToggleTitle] = useState<string>();
    const [isToggled, setIsToggled] = useState(false); // 하단 토글 버튼 클릭 여부

    const tabTitles = {
        self: ['하나, 이 날의 나는 이런 마음을 꺼내보았어요.', '내 기록을 다시 읽어볼까요?'],
        letter: ['둘, 이 날의 나는 누군가의 마음에 답장을 보냈어요.', '내가 쓴 편지를 다시 읽어볼까요?'],
        others: ['셋, 이 문장이 이 날의 나에게 소중히 남았어요.', '온기우체부의 편지를 다시 읽어볼까요?'],
    };

    const changeTab = (tab: 'self' | 'letter' | 'others') => {
        setActiveTab(tab);
        const titles = tabTitles[tab];
        setContentTitle(titles[0]);
        setToggleTitle(titles[1]);
    };

    useEffect(() => {
        const fetch = async () => {
        const letterStorage = new LetterStorage();
        const emotionStorage = new EmotionStorage();

        const l = await letterStorage.getByDate(date);
        const e = await emotionStorage.getByDate(date);

        setLetter(l);
        setEmotion(e);
        };

        fetch();
  }, [date]);

  if (!letter && !emotion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-amber-800">기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full ${garamFont.className}`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        {/* 편지 탭 영역 */}
        <div className="w-full flex justify-end pr-3">
          <div className="flex space-x-[-8px]">
              {['self', 'letter', 'others'].map((tab) => (
              <button
                  key={tab}
                  className={`py-1 px-4 rounded-t-lg text-sm transition-colors ${
                  activeTab === tab
                      ? 'bg-[#FFDB68] text-black font-medium z-10'
                      : 'bg-[#919191] text-black active:bg-[#fee9a1]'
                  }`}
                  onClick={() => changeTab(tab as 'self' | 'letter' | 'others')}
              >
                  {tab === 'self' ? '자기공감' : tab === 'letter' ? '편지쓰기' : '타인공감'}
              </button>
              ))}
          </div>
        </div>


        {/* 편지 내부 */}
        <div id="letter-detail-scroll" className="relative z-20 bg-[#F7F4E6] w-full mx-auto p-6 h-[80vh] overflow-y-auto break-keep">
          <div className="flex flex-col items-center mb-5 relative">
            <Image
              src={postboxIcon}
              alt="편지함 아이콘"
              width={50}
              height={50}
              priority
              loading="eager"
            />

            <h3 className="text-center mt-3 font-medium text-lg text-amber-800 whitespace-pre-line">
              {date}
            </h3>
          </div>

          {/* 내용 본문 */}
          <div className="space-y-4 mt-6">
            <h4 className="text-lg text-amber-900">{contentTitle}</h4>
            {/* 자기공감 탭 클릭 시 본문*/}
            {activeTab === 'self' && (
              <p className="text-gray-700 whitespace-pre-line">
                {emotion?.aiFeedback ?? '자기공감 피드백이 없어요.'}
              </p>
            )}

            {/* 편지쓰기 탭 클릭 시 본문*/}
            {activeTab === 'letter' && (
                <div className="space-y-2 mt-4">
                    <p className="text-lg text-amber-900">무지님의 마음과 사연자의 마음은 닮아 있었어요.</p>
                    <p className="text-gray-700">
                        {letter?.feedbackSections?.emotionConnection ?? '첫번째 피드백이 없어요.'}
                    </p>

                    <p className="text-lg text-amber-900 mt-8">그리고 편지 속에 이런 한 마디를 남기셨죠.</p>
                    <p className="text-amber-800">&quot;{letter?.feedbackSections?.empathyReflection?.[0] }&quot;</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.empathyReflection?.[1] ?? '두번째 피드백이 없어요.'}</p>
                    
                    
                    <p className="text-lg text-amber-900 mt-8">마지막으로, 이런 공감을 해줄 수도 있었어요.</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.improvementSuggestion?.[0]}</p>
                    <p className="text-gray-700">{letter?.feedbackSections?.improvementSuggestion?.[1] ?? '세번째 피드백이 없어요.'}</p>
                    
                </div>
                )}
              
            {/* 타인공감 탭 클릭 시 본문*/}
            {activeTab === 'others' && (
              <div className="text-gray-700 whitespace-pre-line">
                {letter?.highlightedParts && letter.highlightedParts.length > 0 ? (
                  letter.highlightedParts.map((part, idx) => (
                    <p key={idx} className="mb-1">
                      “{part}”
                    </p>
                  ))
                ) : (
                  <p>편지에 대한 하이라이트가 없어요</p>
                )}
              </div>
            )}

          {/* 하단 토글 버튼 */}
          <div className="mt-10 flex justify-center">
            <button
              className="text-amber-700 flex items-center gap-1"
              onClick={() => {
                setIsToggled((prev) => {
                  const next = !prev;

                  if (!prev) {
                    // 다음 렌더링 후 스크롤 이동
                    setTimeout(() => {
                      const scrollable = document.querySelector('#letter-detail-scroll');
                      if (scrollable) {
                        scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: 'smooth' });
                      }
                    }, 100); // 렌더링 이후 실행
                  }

                  return next;
                });
              }}
            >
              {toggleTitle}
              <span>{isToggled ? '▲' : '▼'}</span>
            </button>
          </div>

          {isToggled && (
            <div className="mt-6 space-y-4">
              {/* 자기공감 탭: entries의 step별 question과 answer */}
              {activeTab === 'self' && emotion?.entries && (
              <>
                {Object.entries(emotion.entries).map(([stepKey, stepData]) =>
                  stepData ? (
                    <div key={stepKey} className="bg-white p-3 rounded-md shadow space-y-2">
                      {/* step2는 크게 출력 */}
                      {stepKey === 'step2' ? (
                        <p className="text-amber-800">{stepData.question}</p>
                      ) : (
                        <>
                          {/* step3 이후는 작게 출력 */}
                          <p className="text-sm text-amber-800">{stepData.question}</p>

                          {/* 보조 안내 텍스트 */}
                          {stepKey === 'step3' && (
                            <p className="text-amber-800">
                              그럼, 그 일을 마주했을 때의 구체적인 상황이나 장면을 조금 더 들려주실 수 있을까요?
                            </p>
                          )}
                          {stepKey === 'step4' && (
                            <p className="text-amber-800">
                              그때의 상황을 떠올렸을 때, 무지님이 느꼈던 감정을 모두 골라주세요.
                            </p>
                          )}
                          {stepKey === 'step5' && (
                            <p className="text-amber-800">
                              무지님의 감정에는 어떤 이유가 있었을까요? 그 안에 어떤 바람이나 기대가 담겨 있었을지도 몰라요.
                            </p>
                          )}
                          {stepKey === 'step6' && (
                            <p className="text-amber-800">
                              무지님의 감정을 이끈 마음 속 말들을 골라보세요.
                            </p>
                          )}
                        </>
                      )}

                        <p className="text-gray-700 whitespace-pre-wrap">{stepData.answer}</p>
                      </div>
                    ) : null
                  )}
                </>
              )}

              {/* 편지쓰기 탭: 고민편지 worryContent, 사용자 답장편지 userResponse */}
              {activeTab === 'letter' && letter?.realLetterData && (
                <div className="space-y-6">
                  {/* 고민편지 출력 */}
                  <div className="bg-white p-4 rounded-md shadow">
                    <h5 className="font-semibold text-amber-900 mb-2">이런 고민이 도착했어요.</h5>
                    {letter.realLetterData.worryContent.map((item, idx) => (
                      <p key={idx} className="text-gray-700 whitespace-pre-line mb-1">
                        {item.text}
                      </p>
                    ))}
                  </div>

                  {/* 사용자 모의답장 출력 */}
                  {letter.userResponse && (
                    <div className="bg-white p-4 rounded-md shadow">
                      <h5 className="font-semibold text-amber-900 mb-2">무지님은 이렇게 답장을 보냈어요.</h5>
                      <p className="text-gray-700 whitespace-pre-line">{letter.userResponse}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 타인공감 탭: 고민편지 worryContent, 온기우체부 답장편지 answerContent */}
              {activeTab === 'others' && letter?.realLetterData && (
                <div className="space-y-6">
                  {/* 고민편지 출력 */}
                  <div className="bg-white p-4 rounded-md shadow">
                    <h5 className="font-semibold text-amber-900 mb-2">이런 고민이 있었어요.</h5>
                    {letter.realLetterData.worryContent.map((item, idx) => (
                      <p key={idx} className="text-gray-700 whitespace-pre-line mb-1">
                        {item.text}
                      </p>
                    ))}
                  </div>

                  {/* 온기우체부 답장 출력 */}
                  <div className="bg-white p-4 rounded-md shadow">
                    <h5 className="font-semibold text-amber-900 mb-2">온기우체부는 이렇게 답장을 건넸어요.</h5>
                    {letter.realLetterData.answerContent.map((item, idx) => (
                      <p key={idx} className="text-gray-700 whitespace-pre-line mb-1">
                        {item.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div> 
  </div>
  );
};

export default LetterDetailPage;