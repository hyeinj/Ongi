// import { useState, useEffect, useMemo } from 'react';
// import { EmotionType, Category } from '../../core/entities/emotion';
// import { mockRealLetters } from '../../core/entities/realLetters';
// import { EmotionStorage } from '../../services/storage/emotionStorage';
// import { LetterStorage } from '../../services/storage/letterStorage';
// import {
//   processRealLetter,
//   selectRandomLetter,
//   generateLetterTitle,
//   ProcessedLetter,
//   LetterParagraph,
// } from '../../core/utils/letterUtils';

// interface LetterTitle {
//   title: string;
//   subtitle: string;
// }

// interface UseRealLetterOptions {
//   shouldSave?: boolean; // letterExercise에서만 true로 설정
// }

// interface UseRealLetterReturn {
//   worryContent: LetterParagraph[];
//   answerContent: LetterParagraph[];
//   letterTitles: {
//     worry: LetterTitle;
//     answer: LetterTitle;
//   };
//   isLoading: boolean;
//   error: string | null;
//   userEmotion: EmotionType | null;
//   userCategory: Category | null;
// }

// export const useRealLetter = (options: UseRealLetterOptions = {}): UseRealLetterReturn => {
//   const { shouldSave = false } = options;
//   const [processedLetter, setProcessedLetter] = useState<ProcessedLetter | null>(null);
//   const [userEmotion, setUserEmotion] = useState<EmotionType | null>(null);
//   const [userCategory, setUserCategory] = useState<Category | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const emotionStorage = useMemo(() => new EmotionStorage(), []);
//   const letterStorage = useMemo(() => new LetterStorage(), []);

//   // 오늘 날짜 가져오기
//   const getCurrentDate = () => new Date().toISOString().split('T')[0];

//   // 오늘 유저의 감정 데이터 가져오기
//   useEffect(() => {
//     const fetchOrCreateLetter = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const today = getCurrentDate();

//         // 1. 먼저 저장된 RealLetter가 있는지 확인
//         const savedRealLetter = await letterStorage.getRealLetter(today);
//         if (savedRealLetter) {
//           // 저장된 편지가 있으면 재사용
//           const processedFromSaved: ProcessedLetter = {
//             worry: savedRealLetter.worryContent,
//             answer: savedRealLetter.answerContent,
//           };
//           setProcessedLetter(processedFromSaved);
//           setUserEmotion(savedRealLetter.emotion as EmotionType);
//           setUserCategory((savedRealLetter.category as Category) || null);
//           return;
//         }

//         // 2. 저장된 편지가 없으면 새로 생성
//         const emotionData = await emotionStorage.getByDate(today);
//         let selectedEmotion: EmotionType = 'peace';
//         let selectedCategory: Category | null = null;

//         if (emotionData?.emotion) {
//           selectedEmotion = emotionData.emotion;
//           selectedCategory = emotionData.category || null;
//         }

//         // 해당 감정의 편지 목록에서 랜덤 선택
//         const emotionLetters = mockRealLetters[selectedEmotion];
//         let selectedLetter = selectRandomLetter(emotionLetters);

//         if (!selectedLetter) {
//           // 해당 감정의 편지가 없는 경우 기본 감정(peace) 사용
//           const defaultLetters = mockRealLetters.peace;
//           selectedLetter = selectRandomLetter(defaultLetters);
//           selectedEmotion = 'peace';
//         }

//         if (selectedLetter) {
//           const processed = processRealLetter(selectedLetter);
//           setProcessedLetter(processed);
//           setUserEmotion(selectedEmotion);
//           setUserCategory(selectedCategory);

//           // 3. shouldSave가 true일 때만 저장 (letterExercise에서만)
//           if (shouldSave) {
//             await letterStorage.saveRealLetter(today, {
//               worryContent: processed.worry,
//               answerContent: processed.answer,
//               emotion: selectedEmotion,
//               category: selectedCategory || undefined,
//               selectedAt: new Date().toISOString(),
//             });
//           }
//         }
//       } catch (err) {
//         console.error('감정 데이터 가져오기 실패:', err);
//         setError('편지를 불러오는데 실패했습니다.');

//         // 에러 발생 시 기본 편지 사용
//         try {
//           const defaultLetters = mockRealLetters.peace;
//           const defaultLetter = selectRandomLetter(defaultLetters);
//           if (defaultLetter) {
//             const processed = processRealLetter(defaultLetter);
//             setProcessedLetter(processed);
//             setUserEmotion('peace');
//           }
//         } catch (fallbackErr) {
//           console.error('기본 편지 로드 실패:', fallbackErr);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrCreateLetter();
//   }, [emotionStorage, letterStorage, shouldSave]);

//   // 편지 제목 생성
//   const letterTitles = useMemo(() => {
//     if (!processedLetter) {
//       return {
//         worry: {
//           title: '고민을 나누어 주셔서 감사합니다.',
//           subtitle: '',
//         },
//         answer: {
//           title: '따뜻한 마음을 전해드립니다.',
//           subtitle: '※ 읽는 동안, 마음에 닿은 문장을 길게 눌러 하이라이트 해보세요.',
//         },
//       };
//     }

//     // 원본 텍스트에서 제목 생성 (첫 번째 문단 사용)
//     const worryText = processedLetter.worry[0]?.text || '';
//     const answerText = processedLetter.answer[0]?.text || '';

//     const titles = generateLetterTitle(worryText, answerText);

//     return {
//       worry: {
//         title: titles.worry,
//         subtitle: '',
//       },
//       answer: {
//         title: titles.answer,
//         subtitle: '※ 읽는 동안, 마음에 닿은 문장을 길게 눌러 하이라이트 해보세요.',
//       },
//     };
//   }, [processedLetter]);

//   return {
//     worryContent: processedLetter?.worry || [],
//     answerContent: processedLetter?.answer || [],
//     letterTitles,
//     isLoading,
//     error,
//     userEmotion,
//     userCategory,
//   };
// };
