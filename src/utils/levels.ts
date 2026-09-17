// Sistema de níveis: cada nível exige mais XP que o anterior.
// LEVELS[i] = XP total necessário para alcançar o nível i+1.

export const LEVEL_THRESHOLDS = [
  0,    // Nível 1: 0 - 100
  100,  // Nível 2: 100 - 250
  250,  // Nível 3: 250 - 450
  450,  // Nível 4: 450 - 700
  700,  // Nível 5: 700 - 1000
  1000, // Nível 6: 1000 - 1350
  1350, // Nível 7: 1350 - 1750
  1750, // Nível 8: 1750 - 2200
  2200, // Nível 9: 2200 - 2700
  2700, // Nível 10: 2700+
];

export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

export function getLevelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  isMaxLevel: boolean;
} {
  const level = getLevelFromXp(totalXp);
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;

  const floor = LEVEL_THRESHOLDS[level - 1];
  const ceiling = isMaxLevel ? floor + 1000 : LEVEL_THRESHOLDS[level];

  const currentLevelXp = totalXp - floor;
  const xpForNextLevel = ceiling - floor;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((currentLevelXp / xpForNextLevel) * 100));

  return { level, currentLevelXp, xpForNextLevel, progressPercent, isMaxLevel };
}
