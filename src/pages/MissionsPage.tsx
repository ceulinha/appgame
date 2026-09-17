import TaskCard from '../components/TaskCard';
import { getActiveRewardMultiplier } from '../utils/events';
import type { GameState, Task, FamilyChallenge } from '../types';

interface MissionsPageProps {
  state: GameState;
  isTaskDoneToday: (taskId: string) => boolean;
  onCompleteTask: (task: Task) => void;
  familyChallenges: FamilyChallenge[];
}

const CATEGORY_TITLES: Record<Task['category'], string> = {
  habito: 'Hábitos',
  responsabilidade: 'Responsabilidades',
  missao_especial: 'Missões especiais',
};

export default function MissionsPage({ state, isTaskDoneToday, onCompleteTask, familyChallenges }: MissionsPageProps) {
  const { tasks, challenges, achievements } = state;
  const categories: Task['category'][] = ['habito', 'responsabilidade', 'missao_especial'];
  const rewardMultiplier = getActiveRewardMultiplier();

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">Missões</h1>

      {categories.map((cat) => {
        const items = tasks.filter((t) => t.active && t.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="mb-3 font-display text-base font-extrabold text-ink/70">{CATEGORY_TITLES[cat]}</h2>
            <div className="flex flex-col gap-2.5">
              {items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  done={isTaskDoneToday(task.id)}
                  onComplete={onCompleteTask}
                  rewardMultiplier={rewardMultiplier}
                />
              ))}
            </div>
          </div>
        );
      })}

      <h2 className="mb-3 mt-2 font-display text-lg font-extrabold text-ink">🎯 Desafios</h2>
      <div className="flex flex-col gap-3">
        {challenges.map((c) => {
          const percent = Math.round((c.progress / c.goal) * 100);
          return (
            <div key={c.id} className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-ink">{c.title}</p>
                {c.completed && <span className="text-lg">✅</span>}
              </div>
              <p className="text-sm text-ink/60">{c.description}</p>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-violet-light transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs font-bold text-ink/50">
                <span>{c.progress} / {c.goal}</span>
                <span>⭐ +{c.rewardXp} · 🪙 +{c.rewardCoins}</span>
              </div>
            </div>
          );
        })}
      </div>

      {familyChallenges.length > 0 && (
        <>
          <h2 className="mb-3 mt-6 font-display text-lg font-extrabold text-ink">👨‍👩‍👧‍👦 Desafios da família</h2>
          <div className="flex flex-col gap-3">
            {familyChallenges.map((fc) => {
              const percent = Math.round((fc.progress / fc.goal) * 100);
              return (
                <div key={fc.id} className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-ink">{fc.title}</p>
                    {fc.completed && <span className="text-lg">✅</span>}
                  </div>
                  <p className="text-sm text-ink/60">{fc.description}</p>
                  <p className="mt-1 text-[11px] font-bold text-violet/70">Conta a soma de todos os irmãos!</p>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-coral to-coral-light transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs font-bold text-ink/50">
                    <span>{fc.progress} / {fc.goal}</span>
                    <span>🪙 +{fc.rewardCoinsPerChild} para cada um</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="mb-3 mt-6 font-display text-lg font-extrabold text-ink">🏆 Conquistas</h2>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`flex flex-col items-center gap-1.5 rounded-3xl p-4 text-center shadow-sm ${
              a.unlocked ? 'bg-white' : 'bg-white/60'
            }`}
          >
            <span className={`text-3xl ${a.unlocked ? '' : 'grayscale opacity-40'}`}>{a.icon}</span>
            <p className={`font-display text-xs font-bold ${a.unlocked ? 'text-ink' : 'text-ink/40'}`}>
              {a.title}
            </p>
            {!a.unlocked && <p className="text-[10px] text-ink/35">Bloqueada</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
