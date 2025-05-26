export const useDateNavigator = (
  baseDate: Date,
  setBaseDate: React.Dispatch<React.SetStateAction<Date>>,
  isFirstHalf: boolean
) => {
  const movePrev = () => {
    const newDate = new Date(baseDate);
    if (isFirstHalf) {
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(16);
    } else {
      newDate.setDate(1);
    }
    setBaseDate(newDate);
  };

  const moveNext = () => {
    const newDate = new Date(baseDate);
    if (isFirstHalf) {
      newDate.setDate(16);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1);
    }
    setBaseDate(newDate);
  };

  const setByCalendar = (selected: Date) => {
    const day = selected.getDate();
    const targetDate = new Date(selected);
    if (day <= 15) {
      targetDate.setDate(1);
    } else {
      targetDate.setDate(16);
    }
    setBaseDate(targetDate);
  };

  return { movePrev, moveNext, setByCalendar };
};
