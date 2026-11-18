export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';

  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  return `${paddedMins}:${paddedSecs}`;
}

export function formatTimeWithMs(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00.0';

  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((seconds % 1) * 10);

  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  return `${paddedMins}:${paddedSecs}.${ms}`;
}
