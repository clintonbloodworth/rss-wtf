import dayjs from "dayjs";

export default date => {
  const days = dayjs().diff(date, "day");

  if (days === 0) {
    return "Today";
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "Day" : "Days"} Ago`;
  }

  if (days < 30) {
    const difference = Math.round(days / 7);
    return `${difference} ${difference === 1 ? "Week" : "Weeks"} Ago`;
  }

  if (days < 365) {
    const difference = Math.round(days / 30);
    return `${difference} ${difference === 1 ? "Month" : "Months"} Ago`;
  }

  const difference = Math.round(days / 365);
  return `${difference} ${difference === 1 ? "Year" : "Years"} Ago`;
};
