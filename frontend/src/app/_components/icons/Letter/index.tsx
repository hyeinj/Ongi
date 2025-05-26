// export default function LetterClosed({
//   className,
//   width = 60,
//   height = 42,
// }: {
//   className?: string;
//   width?: number;
//   height?: number;
// }) {
//   return (
//     <svg
//       className={className}
//       width={width}
//       height={height}
//       viewBox="0 0 60 42"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {/* 크림색 배경 */}
//       <rect width="60" height="42" rx="4" fill="#FEFDEF" />

//       {/* 아래로 휘어진 윗부분 곡선 */}
//       <path
//         d="M2 0 L30 25 58 0"
//         stroke="#CBA988"
//         strokeWidth="2"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

export default function LetterClosed({
  className,
  width = 48,
  height = 31,
  date,
}: {
  className?: string;
  width?: number;
  height?: number;
  date?: number;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 60 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="42" rx="4" fill="#FEFDEF" />
      <path d="M2 0 L30 25 58 0" stroke="#CBA988" strokeWidth="2" fill="none" />
      {date && (
        <text
          x="10"
          y="15"
          fontSize="13px"
          fill="#7A5E47"
          fontWeight="bold"
          textAnchor="middle"
        >
          {date}
        </text>
      )}
    </svg>
  );
}

