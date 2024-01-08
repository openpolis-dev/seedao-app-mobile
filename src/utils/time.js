import dayjs from 'dayjs';

export const getUTC = () => {
  const offset = dayjs().utcOffset();
  return `UTC+${offset / 60}`;
};

export const formatTime = (time, formatter) => {
  if (formatter === '-') {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  }
  return dayjs(time).format('YYYY.MM.DD HH:mm');
};

export const formatLeftTime = (targetTime) => {
  const now = Date.now();
  const leftTime = targetTime - now;
  if (leftTime <= 0) {
    return 0;
  }
  const days = Math.floor(leftTime / 86400000);
  const left = leftTime % 86400;
  return days + (left > 0 ? 1 : 0);
};

export const formatDate = (date, formatter) => {
  return dayjs(date).format(['YYYY', 'MM', 'DD'].join(formatter || '-'));
};

export const formatDeltaDate = (endTime) => {
  const now = Date.now();
  const until = endTime;
  const days = Math.abs(until - now) / 1000 / 3600 / 24;
  const day = Math.floor(days);
  const hours = (days - day) * 24;
  const hour = Math.floor(hours);
  const minutes = (hours - hour) * 60;
  let minute = Math.floor(minutes);
  const seconds = (minutes - minute) * 60;
  if (seconds) {
    minute += 1;
  }
  return { d: day, h: hour, m: minute };
};
