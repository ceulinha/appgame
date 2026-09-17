import type { TaskCompletion } from '../types';

export interface DayReport {
  date: string; // YYYY-MM-DD
  label: string; // ex: "Seg"
  count: number;
}

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function getLast7DaysReport(completions: TaskCompletion[]): DayReport[] {
  const days: DayReport[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const count = completions.filter((c) => c.completedAt.slice(0, 10) === iso).length;
    days.push({ date: iso, label: WEEKDAY_SHORT[d.getDay()], count });
  }

  return days;
}
