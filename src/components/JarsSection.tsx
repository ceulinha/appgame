import type { JarBalances, JarGoals } from '../types';

const JAR_CONFIG = [
  { key: 'gastar' as const, icon: '🛒', label: 'Gastar', color: '#FF6B5B' },
  { key: 'guardar' as const, icon: '🐷', label: 'Guardar', color: '#2AD9B8' },
  { key: 'compartilhar' as const, icon: '🎁', label: 'Compartilhar', color: '#F06BB0' },
];

interface JarsSectionProps {
  jars: JarBalances;
  goals: JarGoals;
}

export default function JarsSection({ jars, goals }: JarsSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {JAR_CONFIG.map((jar) => {
        const balance = jars[jar.key];
        const goal = goals[jar.key];
        const percent = goal > 0 ? Math.min(100, Math.round((balance / goal) * 100)) : null;

        return (
          <div key={jar.key} className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-sm">
            <span className="text-xl">{jar.icon}</span>
            <span className="text-[11px] font-bold text-ink/50">{jar.label}</span>
            <span className="font-display text-sm font-extrabold text-ink">
              R$ {balance.toFixed(2).replace('.', ',')}
            </span>
            {percent !== null && (
              <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${percent}%`, backgroundColor: jar.color }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
