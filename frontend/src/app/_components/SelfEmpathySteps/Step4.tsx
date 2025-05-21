'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SelfEmpathyLayout from './SelfEmpathyLayout';
import SelfEmpathyQuestion from './SelfEmpathyQuestion';
import nextArrow from '@/assets/icons/next-arrow.png';
import positiveIcon from '@/assets/icons/positive.png';
import neutralIcon from '@/assets/icons/neutral.png';
import negativeIcon from '@/assets/icons/negative.png';
import '@/styles/SelfEmpathyEmotion.css';

const EMOTIONS = [
  { key: 'positive', icon: positiveIcon },
  { key: 'neutral', icon: neutralIcon },
  { key: 'negative', icon: negativeIcon },
];

const EMOTION_LIST = {
  positive: [
    '감사한', '고마운', '가슴뭉클한', '감동한', '벅찬', '기대되는', '희망을 느끼는', '설레는', '긴장이 풀리는', '안심이 되는', '진정되는', '편안한', '안락한', '평화로운', '당당한', '자신있는', '떳떳한', '상쾌한', '개운한', '생기가 도는', '활력이 넘치는', '살아있는', '정겨운', '친근한', '신나는', '재미있는', '즐거운', '행복한', '기쁜', '흥분되는', '짜릿한', '통쾌한', '속 시원한', '흐뭇한', '만족스러운', '보람찬', '사랑이 가득한', '애정하는', '사랑받는', '다행스러운', '시원섭섭한'
  ],
  neutral: [
    '평온한', '조용한', '차분한', '무심한', '집중된', '알아차린', '존재감있는', '신중한', '혼란스러운', '놀란', '기대없는', '명료한', '관찰중인', '궁금한', '지루한', '긴장된', '몽롱한', '주의집중된'
  ],
  negative: [
    '걱정스러운', '겁나는', '무서운', '두려운', '불안한', '조바심나는', '초조한', '간절한', '애끓는', '주눅드는', '난처한', '곤혹스러운', '신경 쓰이는', '꺼림칙한', '불편한', '부담스러운', '미운', '원망스러운', '못마땅한', '답답한', '막막한', '당혹스러운', '어이없는', '혼란스러운', '싱숭생숭한', '괴로운', '고통스러운', '속상한', '슬픈', '서운한', '섭섭한', '억울한', '서러운', '화나는', '짜증나는', '울화가 치미는', '역겨운', '정떨어지는', '한심스러운', '실망스러운', '낙담한', '좌절감이 드는', '절망스러운', '열등감 느끼는', '부러운', '질투 나는', '부끄러운', '허탈한', '후회스러운', '아쉬운', '안타까운', '지친', '피곤한', '힘든', '무기력한', '심심한', '지겨운', '귀찮은', '우울한', '쓸쓸한', '외로운', '허전한', '허무한', '미안한', '떨리는', '고민되는', '그리운', '아련한', '초연한'
  ]
};

export default function Step4() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터의 질문 또는 localStorage에 저장된 질문을 사용
  const urlQuestion = searchParams.get('question');
  const [question, setQuestion] = useState(urlQuestion || localStorage.getItem('step4Question') || '질문을 불러올 수 없습니다.');
  
  const [selectedEmotion, setSelectedEmotion] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 이전에 저장된 데이터 불러오기
    const savedEmotionType = localStorage.getItem('step4EmotionType');
    const savedFeelings = localStorage.getItem('step4Feelings');
    
    if (savedEmotionType) {
      setSelectedEmotion(savedEmotionType as 'positive' | 'neutral' | 'negative');
    }
    
    if (savedFeelings) {
      setSelectedFeelings(JSON.parse(savedFeelings));
    }

    // URL 파라미터로 전달된 질문이 있다면 localStorage에 저장
    if (urlQuestion) {
      localStorage.setItem('step4Question', urlQuestion);
      setQuestion(urlQuestion);
    }
  }, [urlQuestion]);

  const feelings = EMOTION_LIST[selectedEmotion];

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) => {
      const newFeelings = prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling];
      
      // 로컬 스토리지에 저장
      localStorage.setItem('step4Feelings', JSON.stringify(newFeelings));
      return newFeelings;
    });
  };

  const handleNext = async () => {
    try {
      // 1. 필요한 데이터 수집
      const step2Answer = localStorage.getItem('step2Answer');
      const step3Answer = localStorage.getItem('step3Answer');
      
      if (!step2Answer || !step3Answer) {
        alert('이전 단계의 답변이 없습니다.');
        return;
      }

      // 2. 백엔드로 전송할 데이터 준비
      const requestData = {
        step2Answer,
        step3Answer,
        step4Answer: '', // step4는 감정 선택만 있으므로 빈 문자열
        step4Feelings: selectedFeelings.join(', ') // 선택된 감정들을 문자열로 변환
      };

      // 3. 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/step4-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      // 4. 응답 처리
      const data = await response.json();
      
      if (!data.question) {
        throw new Error('생성된 질문이 없습니다.');
      }

      // 5. 현재 상태 저장
      localStorage.setItem('step4EmotionType', selectedEmotion);
      localStorage.setItem('step4Feelings', JSON.stringify(selectedFeelings));
      localStorage.setItem('step5Question', data.question);

      // 6. 다음 페이지로 이동 (생성된 질문과 함께)
      router.push(`/self-empathy/5?question=${encodeURIComponent(data.question)}`);

    } catch (error) {
      console.error('Error:', error);
      alert('질문 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SelfEmpathyLayout 
      currentStep={3}
      totalStep={6}
      onBack={() => router.push('/self-empathy/3')}
    >
      <SelfEmpathyQuestion
        numbering={3}
        smallText={question}
        largeText="그때의 상황을 떠올렸을 때, 무지님이 느꼈던 감정을 모두 골라주세요"
      >
        <div className="emotion-icons-row">
          {EMOTIONS.map((item) => (
            <button
              key={item.key}
              className={`emotion-icon-btn ${item.key}${selectedEmotion === item.key ? ' selected' : ''}`}
              onClick={() => setSelectedEmotion(item.key as 'positive' | 'neutral' | 'negative')}
              type="button"
            >
              <Image src={item.icon} alt={item.key} width={48} height={48} />
            </button>
          ))}
        </div>
        <div className="feeling-list">
          {feelings.map((feeling) => (
            <button
              key={feeling}
              className={`feeling-btn${selectedFeelings.includes(feeling) ? ' selected ' + selectedEmotion : ''}`}
              onClick={() => toggleFeeling(feeling)}
              type="button"
            >
              {feeling}
            </button>
          ))}
        </div>
        <button 
          className="next-button"
          onClick={handleNext}
          disabled={selectedFeelings.length === 0}
        >
          <Image src={nextArrow} alt="다음" />
        </button>
      </SelfEmpathyQuestion>
    </SelfEmpathyLayout>
  );
} 