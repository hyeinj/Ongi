interface SelfEmpathyQuestionProps {
  smallText: string;
  largeText: string | React.ReactNode;
  children: React.ReactNode;
  numbering: number;
}

export default function SelfEmpathyQuestion({ smallText, largeText, children, numbering }: SelfEmpathyQuestionProps) {
  return (
    <>
      <div className="question-text">
        <p className="question-number">{numbering}</p>
        <p className="small-text">{smallText}</p>
        <p className="large-text">{largeText}</p>
      </div>
      {children}
    </>
  );
} 