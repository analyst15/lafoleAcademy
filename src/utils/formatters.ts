export function formatTimeSeconds(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatHoursAndMinutes(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0 mins';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs > 0 && mins > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (hrs > 0) {
    return `${hrs}h`;
  }
  return `${mins}m`;
}

export function getProgressColor(percent: number): {
  barClass: string;
  badgeBg: string;
  textColor: string;
  borderClass: string;
} {
  if (percent >= 100) {
    return {
      barClass: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-200 dark:border-emerald-800'
    };
  }
  if (percent >= 60) {
    return {
      barClass: 'bg-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderClass: 'border-indigo-200 dark:border-indigo-800'
    };
  }
  if (percent > 0) {
    return {
      barClass: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-200 dark:border-amber-800'
    };
  }
  return {
    barClass: 'bg-slate-300 dark:bg-slate-700',
    badgeBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    textColor: 'text-slate-500 dark:text-slate-400',
    borderClass: 'border-slate-200 dark:border-slate-700'
  };
}
