const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad2 = (value: number) => String(value).padStart(2, '0');

const getKstDateParts = (date: Date) => {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);

  return {
    year: kstDate.getUTCFullYear(),
    month: kstDate.getUTCMonth(),
    day: kstDate.getUTCDate(),
  };
};

export const toKstDateKey = (date: Date) => {
  const { year, month, day } = getKstDateParts(date);
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
};

export const toKstMidnightDate = (date: Date) => {
  const { year, month, day } = getKstDateParts(date);
  return new Date(Date.UTC(year, month, day) - KST_OFFSET_MS);
};

export const getKstNow = () => toKstMidnightDate(new Date());
