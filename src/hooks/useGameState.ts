import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  GameState,
  AppState,
  Task,
  RewardPayload,
  CharacterAppearance,
  PetSpecies,
  JarBalances,
  JarSplit,
  JarGoals,
} from '../types';
import { createInitialAppState, createEmptyChildProfile, SHOP_ITEMS, FAMILY_CHALLENGES } from '../data/initialData';
import { loadRawState, saveAppState, resetAppState } from '../services/storage';
import { getLevelFromXp } from '../utils/levels';
import { getActiveRewardMultiplier, getActiveEvents } from '../utils/events';
import {
  isFirebaseConfigured,
  subscribeToAuth,
  signUpParent,
  signInParent,
  signOutParent,
  fetchCloudAppState,
  saveCloudAppState,
  subscribeToCloudAppState,
} from '../services/cloudSync';
import type { User } from 'firebase/auth';

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function splitMoneyIntoJars(current: JarBalances, split: JarSplit, amount: number): JarBalances {
  if (amount <= 0) return current;
  return {
    gastar: round2(current.gastar + (amount * split.gastar) / 100),
    guardar: round2(current.guardar + (amount * split.guardar) / 100),
    compartilhar: round2(current.compartilhar + (amount * split.compartilhar) / 100),
  };
}

// Garante que perfis salvos antes da Fase 2 (potes de dinheiro) continuem funcionando.
function migrateProfile(profile: GameState): GameState {
  const child = profile.child as GameState['child'] & Partial<{ jars: unknown; jarSplit: unknown; jarGoals: unknown }>;
  if (child.jars && child.jarSplit && child.jarGoals) return profile;

  return {
    ...profile,
    child: {
      ...profile.child,
      jars: profile.child.jars ?? { gastar: profile.child.moneyEarned, guardar: 0, compartilhar: 0 },
      jarSplit: profile.child.jarSplit ?? { gastar: 50, guardar: 40, compartilhar: 10 },
      jarGoals: profile.child.jarGoals ?? { gastar: 0, guardar: 0, compartilhar: 0 },
    },
  };
}

// Migra tanto o formato antigo (Fases 1/2, um perfil só) quanto o novo (Fase 3, múltiplos perfis).
function migrateToAppState(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return createInitialAppState();

  const data = raw as Partial<AppState> & Partial<GameState>;

  if (Array.isArray(data.profiles) && data.profiles.length > 0) {
    const profiles = data.profiles.map(migrateProfile);
    const activeProfileId = data.activeProfileId && profiles.some((p) => p.child.id === data.activeProfileId)
      ? data.activeProfileId
      : profiles[0].child.id;
    const familyChallenges = Array.isArray(data.familyChallenges) && data.familyChallenges.length > 0
      ? data.familyChallenges
      : FAMILY_CHALLENGES.map((c) => ({ ...c }));
    return { profiles, activeProfileId, familyChallenges };
  }

  // Formato antigo: o objeto salvo era o próprio GameState (um perfil só).
  if (data.child) {
    const migrated = migrateProfile(data as GameState);
    return { profiles: [migrated], activeProfileId: migrated.child.id, familyChallenges: FAMILY_CHALLENGES.map((c) => ({ ...c })) };
  }

  return createInitialAppState();
}

export function useGameState() {
  const [appState, setAppState] = useState<AppState>(() => migrateToAppState(loadRawState()));
  const [lastReward, setLastReward] = useState<RewardPayload | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);

  // ===== Sincronização na nuvem (Fase 4) =====
  const [user, setUser] = useState<User | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const isApplyingRemoteChange = useRef(false);
  const hasHydratedFromCloud = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setSyncStatus('offline');
        hasHydratedFromCloud.current = false;
      }
    });
    return unsubscribe;
  }, []);

  // Ao logar, busca o que já existe na nuvem (se houver) e passa a escutar mudanças em tempo real.
  useEffect(() => {
    if (!user) return;

    let unsubscribeSnapshot: (() => void) | undefined;
    setSyncStatus('syncing');

    (async () => {
      try {
        const cloudData = await fetchCloudAppState(user.uid);
        if (cloudData) {
          isApplyingRemoteChange.current = true;
          setAppState(migrateToAppState(cloudData));
        } else {
          await saveCloudAppState(user.uid, appState);
        }
        hasHydratedFromCloud.current = true;
        setSyncStatus('synced');

        unsubscribeSnapshot = subscribeToCloudAppState(user.uid, (cloudState, isLocalWrite) => {
          if (isLocalWrite) return;
          isApplyingRemoteChange.current = true;
          setAppState(migrateToAppState(cloudState));
        });
      } catch {
        setSyncStatus('error');
      }
    })();

    return () => unsubscribeSnapshot?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    saveAppState(appState);

    if (user && hasHydratedFromCloud.current) {
      if (isApplyingRemoteChange.current) {
        isApplyingRemoteChange.current = false;
      } else {
        setSyncStatus('syncing');
        saveCloudAppState(user.uid, appState)
          .then(() => setSyncStatus('synced'))
          .catch(() => setSyncStatus('error'));
      }
    }
  }, [appState, user]);

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthBusy(true);
    setAuthError(null);
    const result = await signUpParent(email, password);
    setAuthBusy(false);
    if (!result.ok) setAuthError(result.message);
    return result.ok;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthBusy(true);
    setAuthError(null);
    const result = await signInParent(email, password);
    setAuthBusy(false);
    if (!result.ok) setAuthError(result.message);
    return result.ok;
  }, []);

  const logOut = useCallback(async () => {
    await signOutParent();
  }, []);

  const state = appState.profiles.find((p) => p.child.id === appState.activeProfileId) ?? appState.profiles[0];

  /** Aplica um updater apenas no perfil ativo, mantendo os demais intactos. */
  const updateActiveProfile = useCallback((updater: (prev: GameState) => GameState) => {
    setAppState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.child.id === prev.activeProfileId ? updater(p) : p)),
    }));
  }, []);

  const today = todayISO();

  const completedTodayIds = state.completions
    .filter((c) => isSameDay(c.completedAt, today))
    .map((c) => c.taskId);

  const isTaskDoneToday = useCallback(
    (taskId: string) => completedTodayIds.includes(taskId),
    [completedTodayIds]
  );

  const checkAchievements = useCallback((totalCompletions: number, level: number, inventoryLength: number) => {
    updateActiveProfile((prev) => {
      const updated = prev.achievements.map((a) => {
        if (a.unlocked) return a;
        if (a.id === 'ach-10-missoes' && totalCompletions >= 10) {
          setUnlockedAchievement(a.title);
          return { ...a, unlocked: true, unlockedAt: todayISO() };
        }
        if (a.id === 'ach-nivel-5' && level >= 5) {
          setUnlockedAchievement(a.title);
          return { ...a, unlocked: true, unlockedAt: todayISO() };
        }
        if (a.id === 'ach-primeiro-item' && inventoryLength >= 1) {
          setUnlockedAchievement(a.title);
          return { ...a, unlocked: true, unlockedAt: todayISO() };
        }
        return a;
      });
      return { ...prev, achievements: updated };
    });
  }, [updateActiveProfile]);

  const completeTask = useCallback(
    (task: Task) => {
      if (isTaskDoneToday(task.id)) return;

      const multiplier = getActiveRewardMultiplier();
      const bonusXp = Math.round(task.xp * multiplier);
      const bonusCoins = Math.round(task.coins * multiplier);
      const bonusMoney = round2(task.money * multiplier);

      let familyJustCompleted: { rewardCoinsPerChild: number } | null = null;

      setAppState((prevApp) => {
        const profiles = prevApp.profiles.map((prev) => {
          if (prev.child.id !== prevApp.activeProfileId) return prev;

          const newXp = prev.child.xp + bonusXp;
          const prevLevel = getLevelFromXp(prev.child.xp);
          const newLevel = getLevelFromXp(newXp);
          const leveledUp = newLevel > prevLevel;

          const newCompletions = [
            ...prev.completions,
            { id: `${task.id}-${Date.now()}`, taskId: task.id, completedAt: todayISO() },
          ];

          const newChallenges = prev.challenges.map((c) => {
            if (c.type === 'missoes_concluidas' && !c.completed) {
              const progress = Math.min(c.goal, c.progress + 1);
              return { ...c, progress, completed: progress >= c.goal };
            }
            return c;
          });

          setLastReward({
            xp: bonusXp,
            coins: bonusCoins,
            money: bonusMoney,
            leveledUp,
            newLevel: leveledUp ? newLevel : undefined,
          });

          const nextProfile = {
            ...prev,
            child: {
              ...prev.child,
              xp: newXp,
              level: newLevel,
              coins: prev.child.coins + bonusCoins,
              moneyEarned: round2(prev.child.moneyEarned + bonusMoney),
              jars: splitMoneyIntoJars(prev.child.jars, prev.child.jarSplit, bonusMoney),
            },
            completions: newCompletions,
            challenges: newChallenges,
          };

          checkAchievements(newCompletions.length, newLevel, nextProfile.child.inventory.length);

          return nextProfile;
        });

        // Desafios da família: contam missões de TODOS os perfis juntos.
        const familyChallenges = prevApp.familyChallenges.map((fc) => {
          if (fc.completed) return fc;
          const progress = Math.min(fc.goal, fc.progress + 1);
          const justCompleted = progress >= fc.goal;
          if (justCompleted) familyJustCompleted = { rewardCoinsPerChild: fc.rewardCoinsPerChild };
          return { ...fc, progress, completed: justCompleted };
        });

        // Se um desafio da família acabou de ser concluído, todo mundo ganha a recompensa.
        const finalProfiles = familyJustCompleted
          ? profiles.map((p) => ({ ...p, child: { ...p.child, coins: p.child.coins + familyJustCompleted!.rewardCoinsPerChild } }))
          : profiles;

        return { ...prevApp, profiles: finalProfiles, familyChallenges };
      });
    },
    [isTaskDoneToday, checkAchievements]
  );

  const buyItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return { success: false, missing: 0 };

    let result = { success: false, missing: 0 };

    updateActiveProfile((prev) => {
      if (prev.child.inventory.includes(itemId)) {
        result = { success: false, missing: 0 };
        return prev;
      }
      if (prev.child.coins < item.price) {
        result = { success: false, missing: item.price - prev.child.coins };
        return prev;
      }
      result = { success: true, missing: 0 };

      let appearance = prev.child.appearance;
      if (item.appliesTo) {
        appearance = { ...appearance, [item.appliesTo.field]: item.appliesTo.value } as CharacterAppearance;
      }

      const nextInventory = [...prev.child.inventory, itemId];
      checkAchievements(prev.completions.length, prev.child.level, nextInventory.length);

      return {
        ...prev,
        child: {
          ...prev.child,
          coins: prev.child.coins - item.price,
          inventory: nextInventory,
          appearance,
        },
      };
    });

    return result;
  }, [checkAchievements, updateActiveProfile]);

  const equipItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || !item.appliesTo) return;

    updateActiveProfile((prev) => {
      if (!prev.child.inventory.includes(itemId)) return prev;
      return {
        ...prev,
        child: {
          ...prev.child,
          appearance: { ...prev.child.appearance, [item.appliesTo!.field]: item.appliesTo!.value } as CharacterAppearance,
        },
      };
    });
  }, [updateActiveProfile]);

  const petAction = useCallback((action: 'alimentar' | 'brincar' | 'banho' | 'dormir') => {
    updateActiveProfile((prev) => {
      if (!prev.pet) return prev;
      const clamp = (v: number) => Math.max(0, Math.min(100, v));
      const pet = { ...prev.pet };
      let coinsDelta = 0;

      if (action === 'alimentar') {
        if (prev.child.coins < 10) return prev;
        pet.hunger = clamp(pet.hunger + 20);
        pet.energy = clamp(pet.energy + 5);
        coinsDelta = -10;
      } else if (action === 'brincar') {
        pet.happiness = clamp(pet.happiness + 20);
        pet.energy = clamp(pet.energy - 10);
      } else if (action === 'banho') {
        pet.hygiene = clamp(pet.hygiene + 30);
      } else if (action === 'dormir') {
        pet.energy = clamp(pet.energy + 30);
      }

      return {
        ...prev,
        pet,
        child: { ...prev.child, coins: prev.child.coins + coinsDelta },
      };
    });
  }, [updateActiveProfile]);

  const choosePet = useCallback((species: PetSpecies, name: string) => {
    updateActiveProfile((prev) => {
      const petId = `pet-${Date.now()}`;
      return {
        ...prev,
        pet: { id: petId, name, species, happiness: 80, hunger: 80, energy: 80, hygiene: 80 },
        child: { ...prev.child, petId },
      };
    });
  }, [updateActiveProfile]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'active'>) => {
    updateActiveProfile((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: `task-custom-${Date.now()}`, active: true }],
    }));
  }, [updateActiveProfile]);

  const updateTask = useCallback((taskId: string, updates: Omit<Task, 'id' | 'active'>) => {
    updateActiveProfile((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  }, [updateActiveProfile]);

  const deleteTask = useCallback((taskId: string) => {
    updateActiveProfile((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  }, [updateActiveProfile]);

  const updateAppearance = useCallback((field: keyof CharacterAppearance, value: string) => {
    updateActiveProfile((prev) => ({
      ...prev,
      child: { ...prev.child, appearance: { ...prev.child.appearance, [field]: value } as CharacterAppearance },
    }));
  }, [updateActiveProfile]);

  const updateGoal = useCallback((goal: number) => {
    updateActiveProfile((prev) => ({ ...prev, child: { ...prev.child, monthlyGoal: goal } }));
  }, [updateActiveProfile]);

  const updateJarSplit = useCallback((split: JarSplit) => {
    updateActiveProfile((prev) => ({ ...prev, child: { ...prev.child, jarSplit: split } }));
  }, [updateActiveProfile]);

  const updateJarGoals = useCallback((goals: JarGoals) => {
    updateActiveProfile((prev) => ({ ...prev, child: { ...prev.child, jarGoals: goals } }));
  }, [updateActiveProfile]);

  // ===== Multi-perfil (Fase 3) =====

  const addProfile = useCallback((name: string, age: number) => {
    const newProfile = createEmptyChildProfile(name, age);
    setAppState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.child.id,
    }));
  }, []);

  const switchProfile = useCallback((profileId: string) => {
    setAppState((prev) => (prev.profiles.some((p) => p.child.id === profileId)
      ? { ...prev, activeProfileId: profileId }
      : prev));
  }, []);

  const clearReward = useCallback(() => setLastReward(null), []);
  const clearAchievementBanner = useCallback(() => setUnlockedAchievement(null), []);

  const resetAll = useCallback(() => {
    resetAppState();
    setAppState(createInitialAppState());
  }, []);

  return {
    state,
    profiles: appState.profiles,
    activeProfileId: appState.activeProfileId,
    familyChallenges: appState.familyChallenges,
    activeEvents: getActiveEvents(),
    addProfile,
    switchProfile,
    completedTodayIds,
    isTaskDoneToday,
    completeTask,
    buyItem,
    equipItem,
    petAction,
    choosePet,
    addTask,
    updateTask,
    deleteTask,
    updateAppearance,
    updateGoal,
    updateJarSplit,
    updateJarGoals,
    resetAll,
    lastReward,
    clearReward,
    unlockedAchievement,
    clearAchievementBanner,
    // Sincronização na nuvem
    isFirebaseConfigured,
    user,
    authBusy,
    authError,
    syncStatus,
    signUp,
    signIn,
    logOut,
  };
}
