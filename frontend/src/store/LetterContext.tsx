import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Letter {
  recipient: string;
  content: string;
  sender: string;
}

interface LetterContextType {
  letter: Letter;
  setRecipient: (recipient: string) => void;
  setContent: (content: string) => void;
  setSender: (sender: string) => void;
  resetLetter: () => void;
  introStepShown: boolean;
  setIntroStepShown: (shown: boolean) => void;
}

const defaultLetter: Letter = {
  recipient: '',
  content: '',
  sender: '',
};

const LetterContext = createContext<LetterContextType | undefined>(undefined);

export function LetterProvider({ children }: { children: ReactNode }) {
  const [letter, setLetter] = useState<Letter>(defaultLetter);
  const [introStepShown, setIntroStepShown] = useState<boolean>(false);

  const setRecipient = (recipient: string) => {
    setLetter((prev) => ({ ...prev, recipient }));
  };

  const setContent = (content: string) => {
    setLetter((prev) => ({ ...prev, content }));
  };

  const setSender = (sender: string) => {
    setLetter((prev) => ({ ...prev, sender }));
  };

  const resetLetter = () => {
    setLetter(defaultLetter);
  };

  return (
    <LetterContext.Provider
      value={{
        letter,
        setRecipient,
        setContent,
        setSender,
        resetLetter,
        introStepShown,
        setIntroStepShown,
      }}
    >
      {children}
    </LetterContext.Provider>
  );
}

export function useLetter() {
  const context = useContext(LetterContext);
  if (context === undefined) {
    throw new Error('useLetter must be used within a LetterProvider');
  }
  return context;
}
