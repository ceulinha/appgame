import type { SeasonalEvent } from '../types';
import { SEASONAL_EVENTS } from '../data/initialData';

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getActiveEvents(): SeasonalEvent[] {
  const today = todayDateOnly();
  return SEASONAL_EVENTS.filter((e) => today >= e.startDate && today <= e.endDate);
}

/** Se houver mais de um evento ativo, usa o maior multiplicador. */
export function getActiveRewardMultiplier(): number {
  const active = getActiveEvents();
  if (active.length === 0) return 1;
  return Math.max(...active.map((e) => e.rewardMultiplier));
}
