export interface Letter {
  mockLetter: string;
  userResponse: string;
  aiFeedback: string;
  realLetterId: string;
  highlightedParts: string[];
}

export interface Letters {
  [date: string]: Letter;
}
