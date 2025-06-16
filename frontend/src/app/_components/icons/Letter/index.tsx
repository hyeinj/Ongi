// export default function LetterClosed({
//   className,
//   width = 48,
//   height = 31,
//   date,
// }: {
//   className?: string;
//   width?: number;
//   height?: number;
//   date?: number;
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
//       <rect width="60" height="42" rx="4" fill="#FEFDEF" />
//       <path d="M2 0 L30 25 58 0" stroke="#CBA988" strokeWidth="2" fill="none" />
//       {date && (
//         <text
//           x="10"
//           y="15"
//           fontSize="13px"
//           fill="#7A5E47"
//           fontWeight="bold"
//           textAnchor="middle"
//         >
//           {date}
//         </text>
//       )}
//     </svg>
//   );
// }

// 

export default function LetterClosed({
  className,
  width = 48,
  height = 31,
  date,
  variant = "colored",
  emotion,
}: {
  className?: string;
  width?: number;
  height?: number;
  date?: number;
  variant?: "colored" | "white" | "dashed";
  emotion?: "joy" | "peace" | "sadness" | "anger" | "anxiety";
}) {
  const emotionColors: Record<string, string> = {
    joy: "#FEE191",
    peace: "#62B067",
    sadness: "#4F69D2",
    anger: "rgba(218, 47, 47, 0.8)",
    anxiety: "#AB1EB7",
  };

  const baseColor = "#FEFDEF"; // 기본 연노란 배경
  const gradientColor = emotionColors[emotion ?? ""] ?? baseColor;
  const strokeColor =
  variant === "dashed"
    ? "#CBA988"
    : variant === "colored"
    ? "rgba(163, 132, 101, 0.8)"
    : "#CBA988";
  const strokeDasharray = variant === "dashed" ? "4 2" : "none";

  const gradientId = `gradientFill-${emotion}-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 60 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "colored" && (
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="100%">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.5" />
            <stop offset="70%" stopColor={gradientColor} stopOpacity="0.4" />
            <stop offset="90%" stopColor={gradientColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      {/* 베이스 색상 */}
      {variant !== "dashed" && (
        <rect width="60" height="42" rx="4" fill={baseColor} />
      )}

      {/* 감정 gradient 오버레이 */}
      {variant === "colored" && (
        <rect width="60" height="42" rx="4" fill={`url(#${gradientId})`} />
      )}

      {/* dashed용 반투명 오버레이 */}
      {variant === "dashed" && (
        <rect width="60" height="42" rx="4" fill="rgba(255, 248, 234, 0.51)" />
      )}

      <rect
        width="60"
        height="42"
        rx="4"
        fill="none"
        stroke={strokeColor}
        strokeDasharray={strokeDasharray}
      />

      <path
        d="M2 0 L30 25 58 0"
        stroke={strokeColor}
        strokeWidth="2"
        fill="none"
      />

      {date && (
        <text
          x="10"
          y="15"
          fontSize="14px"
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