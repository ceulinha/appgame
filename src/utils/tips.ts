import { FINANCIAL_TIPS } from '../data/initialData';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTipOfTheDay(): string {
  const index = dayOfYear() % FINANCIAL_TIPS.length;
  return FINANCIAL_TIPS[index];
}
