import Character from '../components/Character';
import XPBar from '../components/XPBar';
import CoinDisplay from '../components/CoinDisplay';
import MoneyDisplay from '../components/MoneyDisplay';
import TaskCard from '../components/TaskCard';
import JarsSection from '../components/JarsSection';
import { getLevelProgress } from '../utils/levels';
import { isTaskScheduledToday } from '../utils/schedule';
import { getTipOfTheDay } from '../utils/tips';
import { getActiveRewardMultiplier } from '../utils/events';
import type { GameState, Task, SeasonalEvent } from '../types';

interface HomePageProps {
  state: GameState;
  isTaskDoneToday: (taskId: string) => boolean;
  onCompleteTask: (task: Task) => void;
  onOpenParentArea: () => void;
  activeEvents: SeasonalEvent[];
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomePage({ state, isTaskDoneToday, onCompleteTask, onOpenParentArea, activeEvents }: HomePageProps) {
  const { child, tasks } = state;
  const progress = getLevelProgress(child.xp);
  const todaysTasks = tasks.filter((t) => t.active && t.frequency !== 'semanal' && isTaskScheduledToday(t));
  const weeklyTasks = tasks.filter((t) => t.active && t.frequency === 'semanal');
  const doneCount = [...todaysTasks, ...weeklyTasks].filter((t) => isTaskDoneToday(t.id)).length;
  const totalCount = todaysTasks.length + weeklyTasks.length;
  const rewardMultiplier = getActiveRewardMultiplier();

  return (
    <div className="pb-28">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-grape to-violet px-5 pb-8 pt-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -left-10 top-24 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="font-body text-sm font-bold text-violet-100">{greeting()},</p>
            <h1 className="font-display text-2xl font-extrabold text-white">{child.name}! ☀️</h1>
          </div>
          <button
            onClick={onOpenParentArea}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white active:scale-95"
          >
            👪 Área dos pais
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          <Character appearance={child.appearance} size={100} bounce />
          <div className="flex-1">
            <XPBar {...progress} />
            <div className="mt-3 flex gap-2">
              <CoinDisplay coins={child.coins} size="sm" />
              <MoneyDisplay amount={child.moneyEarned} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Evento sazonal ativo */}
      {activeEvents.length > 0 && (
        <div className="px-5 pt-4">
          {activeEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-gold to-gold-light p-3.5 shadow-sm"
            >
              <span className="text-2xl">{event.icon}</span>
              <div>
                <p className="font-display text-sm font-extrabold text-ink">{event.title}</p>
                <p className="text-xs font-bold text-ink/70">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Potes de dinheiro */}
      <div className="px-5 pt-5">
        <h2 className="mb-3 font-display text-base font-extrabold text-ink/70">Meus potes</h2>
        <JarsSection jars={child.jars} goals={child.jarGoals} />
      </div>

      {/* Dica financeira do dia */}
      <div className="px-5 pt-4">
        <div className="flex items-start gap-3 rounded-2xl bg-mint/10 p-3.5">
          <span className="text-xl">💡</span>
          <p className="text-sm font-bold text-ink/70">{getTipOfTheDay()}</p>
        </div>
      </div>

      {/* Missões */}
      <div className="px-5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink">Missões de hoje</h2>
          <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
            {doneCount} / {totalCount}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {todaysTasks.map((task) => (
            <TaskCard key={task.id} task={task} done={isTaskDoneToday(task.id)} onComplete={onCompleteTask} rewardMultiplier={rewardMultiplier} />
          ))}
        </div>

        {weeklyTasks.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 font-display text-lg font-extrabold text-ink">Missões da semana</h2>
            <div className="flex flex-col gap-2.5">
              {weeklyTasks.map((task) => (
                <TaskCard key={task.id} task={task} done={isTaskDoneToday(task.id)} onComplete={onCompleteTask} rewardMultiplier={rewardMultiplier} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
