'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import LoadingState from './LoadingState';
import nextArrow from '@/assets/icons/next-arrow.png';
import positiveIcon from '@/assets/icons/positive.png';
import neutralIcon from '@/assets/icons/neutral.png';
import negativeIcon from '@/assets/icons/negative.png';
import '@/styles/SelfEmpathyEmotion.css';
import { useEmotion } from '@/ui/hooks/useEmotion';
import { useDelayedLoading } from '@/ui/hooks/useDelayedLoading';
import LoadingSpinner from '../common/LoadingSpinner';

const EMOTIONS = [
  { key: 'positive', icon: positiveIcon },
  { key: 'neutral', icon: neutralIcon },
  { key: 'negative', icon: negativeIcon },
];

const EMOTION_LIST = {
  positive: [
    '감사한',
    '고마운',
    '가슴뭉클한',
    '감동한',
    '벅찬',
    '기대되는',
    '희망을 느끼는',
    '설레는',
    '긴장이 풀리는',
    '안심이 되는',
    '진정되는',
    '편안한',
    '안락한',
    '평화로운',
    '당당한',
    '자신있는',
    '떳떳한',
    '상쾌한',
    '개운한',
    '생기가 도는',
    '활력이 넘치는',
    '살아있는',
    '정겨운',
    '친근한',
    '신나는',
    '재미있는',
    '즐거운',
    '행복한',
    '기쁜',
    '흥분되는',
    '짜릿한',
    '통쾌한',
    '속 시원한',
    '흐뭇한',
    '만족스러운',
    '보람찬',
    '사랑이 가득한',
    '애정하는',
    '사랑받는',
    '다행스러운',
  ],
  neutral: [
    '평온한',
    '조용한',
    '차분한',
    '무심한',
    '집중된',
    '알아차린',
    '존재감있는',
    '신중한',
    '놀란',
    '기대없는',
    '명료한',
    '관찰중인',
    '궁금한',
    '지루한',
    '긴장된',
    '몽롱한',
    '주의집중된',
    '시원섭섭한',
  ],
  negative: [
    '걱정스러운',
    '겁나는',
    '무서운',
    '두려운',
    '불안한',
    '조바심나는',
    '초조한',
    '간절한',
    '애끓는',
    '주눅드는',
    '난처한',
    '곤혹스러운',
    '신경 쓰이는',
    '꺼림칙한',
    '불편한',
    '부담스러운',
    '미운',
    '원망스러운',
    '못마땅한',
    '답답한',
    '막막한',
    '당혹스러운',
    '어이없는',
    '혼란스러운',
    '싱숭생숭한',
    '괴로운',
    '고통스러운',
    '속상한',
    '슬픈',
    '서운한',
    '섭섭한',
    '억울한',
    '서러운',
    '화나는',
    '짜증나는',
    '울화가 치미는',
    '역겨운',
    '정떨어지는',
    '한심스러운',
    '실망스러운',
    '낙담한',
    '좌절감이 드는',
    '절망스러운',
    '열등감 느끼는',
    '부러운',
    '질투 나는',
    '부끄러운',
    '허탈한',
    '후회스러운',
    '아쉬운',
    '안타까운',
    '지친',
    '피곤한',
    '힘든',
    '무기력한',
    '심심한',
    '지겨운',
    '귀찮은',
    '우울한',
    '쓸쓸한',
    '외로운',
    '허전한',
    '허무한',
    '미안한',
    '떨리는',
    '고민되는',
    '그리운',
    '아련한',
    '초연한',
  ],
};

export default function Step4() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터의 질문
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || '질문을 불러올 수 없습니다.');

  const [selectedEmotion, setSelectedEmotion] = useState<'positive' | 'neutral' | 'negative'>(
    'positive'
  );
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  // 클린 아키텍처를 통한 감정 데이터 관리
  const { isLoading, error, saveStageAnswer, emotionData, setIsLoading, getStageAnswer } = useEmotion();

  // 로딩 완료 후 지연 처리
  const shouldShowLoading = useDelayedLoading(isLoading);

  useEffect(() => {
    // 이전에 저장된 감정 데이터 불러오기
    if (emotionData?.entries.step4) {
      const step4Data = emotionData.entries.step4.answer;
      // "감정 유형: positive, 세부 감정: 기쁜, 행복한" 형태에서 파싱
      const emotionTypeMatch = step4Data.match(/감정 유형: (\w+)/);
      const feelingsMatch = step4Data.match(/세부 감정: (.+)/);

      if (emotionTypeMatch) {
        setSelectedEmotion(emotionTypeMatch[1] as 'positive' | 'neutral' | 'negative');
      }

      if (feelingsMatch) {
        const feelings = feelingsMatch[1].split(', ').filter((f) => f.trim());
        setSelectedFeelings(feelings);
      }
    }

    // URL 파라미터로 전달된 질문이 있다면 설정
    if (urlQuestion) {
      setQuestion(urlQuestion);
    }
  }, [urlQuestion, emotionData]);

  const feelings = EMOTION_LIST[selectedEmotion];

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) => {
      const newFeelings = prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling];
      return newFeelings;
    });
  };

  const handleNext = async () => {
    if (selectedFeelings.length === 0) return;

    try {
      setIsLoading(true);
      
      const step1Answer = await getStageAnswer('step2');
      const step2Answer = await getStageAnswer('step3');
      
      // 백엔드 API 호출
      const response = await fetch('/api/step4-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step1_answer: step1Answer || '',
          step2_answer: step2Answer || '',
          step3Feelings: selectedFeelings.join(', ')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      // 답변과 질문 모두 로컬스토리지에 저장
      await saveStageAnswer('step4', question, selectedFeelings.join(', '));
      await saveStageAnswer('step5', data.question, '');
      
      // Step5로 질문을 URL 파라미터로 전달
      router.push(`/self-empathy/5?question=${encodeURIComponent(data.question)}`);
    } catch (err) {
      console.error('Step4 처리 실패:', err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <SelfEmpathyLayout
        currentStep={3}
        totalStep={5}
        onBack={() => router.push('/self-empathy/3')}
      >
        <div className="error-message">
          오류가 발생했습니다: {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </SelfEmpathyLayout>
    );
  }

  // 로딩 상태 표시
  if (shouldShowLoading) {
    return (
      <SelfEmpathyLayout
        currentStep={3}
        totalStep={5}
        onBack={() => router.push('/self-empathy/3')}
      >
        <LoadingState type="question" />
      </SelfEmpathyLayout>
    );
  }

  return (
    <SelfEmpathyLayout currentStep={3} totalStep={6} onBack={() => router.push('/self-empathy/3')}>
      <SelfEmpathyQuestion
        numbering={3}
        smallText={question}
        largeText="그때의 상황을 떠올렸을 때, 무지님이 느꼈던 감정을 모두 골라주세요"
      >
        <div className="emotion-icons-row">
          {EMOTIONS.map((item) => (
            <button
              key={item.key}
              className={`emotion-icon-btn ${item.key}${
                selectedEmotion === item.key ? ' selected' : ''
              }`}
              onClick={() => setSelectedEmotion(item.key as 'positive' | 'neutral' | 'negative')}
              type="button"
              disabled={isLoading}
            >
              <Image src={item.icon} alt={item.key} width={48} height={48} />
            </button>
          ))}
        </div>
        <div className={`feeling-list ${selectedEmotion}`}>
          {feelings.map((feeling) => (
            <button
              key={feeling}
              className={`feeling-btn${
                selectedFeelings.includes(feeling) ? ' selected ' + selectedEmotion : ''
              }`}
              onClick={() => toggleFeeling(feeling)}
              type="button"
              disabled={isLoading}
            >
              {feeling}
            </button>
          ))}
        </div>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={isLoading || selectedFeelings.length === 0}
        >
          {isLoading ? <LoadingSpinner size="large" color="white" /> : <Image src={nextArrow} alt="다음" />}
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
}
