export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs > 0 ? `${hrs}hr` : ""} ${mins > 0 ? `${mins}min` : ""} ${
    secs > 0 ? `${secs}sec` : ""
  }`.trim();
};
