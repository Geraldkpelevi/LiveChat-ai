const formatDuration = (minutes = 0) => {
  const value = Number(minutes);
  const totalSeconds = Number.isFinite(value)
    ? Math.max(0, Math.round(value * 60))
    : 0;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h.${remainingMinutes}m.${seconds}s`;
};

export default formatDuration;
