export interface DailyLetter {
  mockLetter: string;
  userResponse: string;
  aiFeedback: string;
  realLetterId: string;
  highlightedParts: string[];
}

export interface Letters {
  [date: string]: DailyLetter;
}
