import type { Task } from '../types';
import { weekdayLabel } from '../utils/schedule';

interface TaskCardProps {
  task: Task;
  done: boolean;
  onComplete: (task: Task) => void;
  rewardMultiplier?: number;
}

const CATEGORY_LABEL: Record<Task['category'], { label: string; color: string }> = {
  habito: { label: 'Hábito', color: 'bg-mint/15 text-mint' },
  responsabilidade: { label: 'Responsabilidade', color: 'bg-violet/15 text-violet' },
  missao_especial: { label: 'Missão especial', color: 'bg-gold/20 text-[#8a6200]' },
};

export default function TaskCard({ task, done, onComplete, rewardMultiplier = 1 }: TaskCardProps) {
  const cat = CATEGORY_LABEL[task.category];
  const showBonus = rewardMultiplier > 1;
  const xp = Math.round(task.xp * rewardMultiplier);
  const coins = Math.round(task.coins * rewardMultiplier);
  const money = Math.round(task.money * rewardMultiplier * 100) / 100;

  return (
    <div
      className={`flex items-center gap-3 rounded-3xl p-3.5 shadow-sm transition-all ${
        done ? 'bg-mint/10' : 'bg-white'
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
          done ? 'bg-mint/20' : 'bg-cloud'
        }`}
      >
        {task.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-display font-semibold text-ink text-[15px]">{task.name}</p>
        </div>
        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${cat.color}`}>
          {cat.label}
        </span>
        {task.frequency === 'dias_especificos' && task.daysOfWeek && task.daysOfWeek.length > 0 && (
          <span className="ml-1.5 text-[11px] font-bold text-ink/40">
            {task.daysOfWeek.map(weekdayLabel).join(', ')}
          </span>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-ink/60">
          <span>⭐ +{xp}</span>
          <span>🪙 +{coins}</span>
          {money > 0 && <span>💰 +R$ {money.toFixed(2).replace('.', ',')}</span>}
          {showBonus && (
            <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[#8a6200]">
              x{rewardMultiplier}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onComplete(task)}
        disabled={done}
        className={`shrink-0 rounded-2xl px-4 py-2.5 font-display text-sm font-bold transition-all active:scale-95 ${
          done
            ? 'bg-mint text-white'
            : 'bg-coral text-white shadow-md shadow-coral/30 hover:brightness-105'
        }`}
      >
        {done ? '✓ Feito' : 'Completei'}
      </button>
    </div>
  );
}
