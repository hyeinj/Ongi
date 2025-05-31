import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import letterExerciseDotImage from '@/assets/images/letter-exercise-dot-img.png';
import { useLetter } from '@/ui/hooks/useLetter';
import paperPlane from '@/assets/icons/paper-plane.png';
import micIcon from '@/assets/icons/mic.png';
import micActiveIcon from '@/assets/icons/mic-active.png';

// Web Speech API 타입 정의
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function WritingStep() {
  const { saveUserResponse, getLetterData } = useLetter();
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [letterContent, setLetterContent] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  // 음성 인식 설정
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setLetterContent(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

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
  }, [currentDate, dataLoaded]);

  const handleLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterContent(e.target.value);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSendLetter = async () => {
    if (letterContent.trim()) {
      try {
        // 사용자 응답만 저장하고 즉시 다음 페이지로 이동
        const saveSuccess = await saveUserResponse(letterContent, currentDate);
        if (!saveSuccess) {
          throw new Error('답장 저장에 실패했습니다.');
        }

        // 즉시 다음 단계로 이동 (피드백 생성은 FeedbackStep에서 처리)
        router.push('/letter-exercise/3');
      } catch (error) {
        console.error('편지 저장 실패:', error);
        // TODO: 에러 메시지 표시 UI 추가
        alert(error instanceof Error ? error.message : '편지 저장에 실패했습니다.');
      }
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
            placeholder="※ 가상의 인물에게 보내지는 편지이니, 마음 편히 당신의 이야기를 꺼내보셔도 좋아요. 물론 음성으로 작성해도 좋아요!"
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
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full ${isListening ? 'bg-red-500' : 'bg-[#EEEEEE]'} active:bg-[#F4E8D1] shadow-lg transition-all duration-300 flex items-center justify-center`}
            title={isListening ? '음성 인식 중지' : '음성으로 작성'}
          >
            <Image 
              src={isListening ? micActiveIcon : micIcon} 
              alt={isListening ? '음성 인식 중지' : '음성으로 작성'} 
              width={28} 
              height={28}
              className="w-12 h-12"
            />
          </button>

          <button
            onClick={handleSendLetter}
            disabled={!letterContent.trim()}
            className="flex-1 px-6 py-3 rounded-full bg-[#EEEEEE] active:bg-[#F4E8D1] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-1">
              <Image src={paperPlane} alt="전송" width={30} height={30} />
              <span className="text-black font-medium">전송하기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
