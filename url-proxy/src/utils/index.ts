export const resumeLongText = (
  text: string,
  groupSize: number,
  separator = "..."
) => {
  if (text.length <= groupSize * 2) {
    return text;
  }
  const start = text.slice(0, groupSize);
  const end = text.slice(-groupSize);

  return `${start}${separator}${end}`;
};

export const getRandomHEXColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;
