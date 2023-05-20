export const getPeriod = (timeline) => {
  const periodBySeconds = (Date.now() - parseInt(timeline)) / 1000;

  const period =
    periodBySeconds / 86400 > 1
      ? `${Math.trunc(periodBySeconds / 86400)} ngày`
      : periodBySeconds / 3600 > 1
      ? `${Math.trunc(periodBySeconds / 3600)} giờ`
      : periodBySeconds / 60 > 1
      ? `${Math.trunc(periodBySeconds / 60)} phút`
      : `${Math.trunc(periodBySeconds)} giây`;

  return period;
};
