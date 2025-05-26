export const useLetterDateRange = (baseDateParam: Date) => {
  const baseDate = baseDateParam ?? new Date(); // 기준 날짜가 없으면 오늘 날짜로

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based
  const day = baseDate.getDate();

  const lastDay = new Date(year, month + 1, 0).getDate();
  const isFirstHalf = day <= 15;

  const start = isFirstHalf ? 1 : 16;
  const end = isFirstHalf ? 15 : lastDay;

  const letterDates = Array.from({ length: end - start + 1 }, (_, i) => {
    const date = new Date(Date.UTC(year, month, start + i));
    return date.toISOString().split('T')[0];
  });

  console.log(letterDates);

  return {
    year,
    month,
    start,
    end,
    isFirstHalf,
    letterDates,
    total: letterDates.length,
  };
};