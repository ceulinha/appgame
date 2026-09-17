import type { Task } from '../types';

// 0 = domingo ... 6 = sábado, igual ao Date.getDay()
export function getTodayWeekday(): number {
  return new Date().getDay();
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function weekdayLabel(day: number): string {
  return WEEKDAY_LABELS[day] ?? '';
}

export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

/**
 * Uma tarefa "diária" aparece todo dia.
 * Uma tarefa "semanal" aparece sempre (seção separada), sem restrição de dia.
 * Uma tarefa de "dias específicos" só aparece nos dias marcados pelos pais.
 */
export function isTaskScheduledToday(task: Task, weekday: number = getTodayWeekday()): boolean {
  if (task.frequency === 'dias_especificos') {
    return !!task.daysOfWeek && task.daysOfWeek.includes(weekday);
  }
  return true;
}
