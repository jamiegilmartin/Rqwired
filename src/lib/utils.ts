export const RandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

export const RandomNumber = (min: number, max: number) => {
  if (min > max || (min < 0 && max < 0 && max < min)) return 0;

  if ((min < 0 && max < 0) || (min >= 0 && max > 0)) {
    return Math.floor(Math.random() * max) + min;
  } else if (min < 0) {
    const shiftMax = max + Math.abs(min);
    let num = Math.floor(Math.random() * shiftMax) + 1 - max;
    // extra flip for weighted to one side
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }

  return 0;
};
