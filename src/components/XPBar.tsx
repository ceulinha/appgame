interface XPBarProps {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export default function XPBar({ level, currentLevelXp, xpForNextLevel, progressPercent, isMaxLevel }: XPBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-display font-bold text-white text-sm tracking-tight">Nível {level}</span>
        <span className="text-violet-100 text-xs font-bold">
          {isMaxLevel ? 'Nível máximo!' : `⭐ ${currentLevelXp} / ${xpForNextLevel} XP`}
        </span>
      </div>
      <div className="h-4 w-full rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-[width] duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
