const timeRange = {
  morning: {
    firstSessionStartTime: "07:30",
    firstSessionEndTime: "09:00",
    secondSessionStartTime: "09:30",
    secondSessionEndTime: "11:00",
  },
  evening: {
    firstSessionStartTime: "13:30",
    firstSessionEndTime: "15:00",
    secondSessionStartTime: "15:30",
    secondSessionEndTime: "17:00",
  },
  night: {
    firstSessionStartTime: "18:00",
    firstSessionEndTime: "19:30",
    secondSessionStartTime: "19:45",
    secondSessionEndTime: "21:15",
  },
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
};

export const checkSessionTime = (
  studyShift: string,
  firstSessionStartTime: string,
  firstSessionEndTime: string,
  secondSessionStartTime: string,
  secondSessionEndTime: string,
) => {
  const shiftData = timeRange[studyShift as keyof typeof timeRange];

  if (!shiftData) {
    return false;
  }

  const inputFirstStart = timeToMinutes(firstSessionStartTime);
  const inputFirstEnd = timeToMinutes(firstSessionEndTime);
  const inputSecondStart = timeToMinutes(secondSessionStartTime);
  const inputSecondEnd = timeToMinutes(secondSessionEndTime);

  const actualFirstStart = timeToMinutes(shiftData.firstSessionStartTime);
  const actualFirstEnd = timeToMinutes(shiftData.firstSessionEndTime);
  const actualSecondStart = timeToMinutes(shiftData.secondSessionStartTime);
  const actualSecondEnd = timeToMinutes(shiftData.secondSessionEndTime);

  const firstSessionMatches =
    inputFirstStart === actualFirstStart && inputFirstEnd === actualFirstEnd;

  const secondSessionMatches =
    inputSecondStart === actualSecondStart &&
    inputSecondEnd === actualSecondEnd;

  return firstSessionMatches && secondSessionMatches;
};
