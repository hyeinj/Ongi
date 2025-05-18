import { useState, useEffect } from 'react';
import { LetterAnswer } from '@/entity/Letter';

const STORAGE_KEY = 'letterAnswer';

export function useLetterAnswer(letterId: string) {
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Record<string, LetterAnswer> = JSON.parse(saved);
        if (parsed[letterId]?.reply) {
          setAnswer(parsed[letterId].reply);
        }
      }
    }
  }, [letterId]);

  const saveAnswer = (value: string) => {
    setAnswer(value);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      let parsed: Record<string, LetterAnswer> = {};
      if (saved) {
        parsed = JSON.parse(saved);
      }
      parsed[letterId] = { reply: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
  };

  return { answer, setAnswer: saveAnswer };
}
