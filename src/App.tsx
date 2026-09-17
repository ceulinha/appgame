import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import BottomNavigation, { type ChildView } from './components/BottomNavigation';
import RewardAnimation from './components/RewardAnimation';
import HomePage from './pages/HomePage';
import MissionsPage from './pages/MissionsPage';
import PetPage from './pages/PetPage';
import HousePage from './pages/HousePage';
import ShopPage from './pages/ShopPage';
import CharacterPage from './pages/CharacterPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import type { ShopItem } from './types';

export default function App() {
  const {
    state,
    profiles,
    activeProfileId,
    familyChallenges,
    activeEvents,
    addProfile,
    switchProfile,
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
    isFirebaseConfigured,
    user,
    authBusy,
    authError,
    syncStatus,
    signUp,
    signIn,
    logOut,
  } = useGameState();

  const [view, setView] = useState<ChildView>('inicio');
  const [showParentArea, setShowParentArea] = useState(false);
  const [shopToast, setShopToast] = useState<string | null>(null);

  const handleBuy = (item: ShopItem) => {
    const result = buyItem(item.id);
    if (!result.success && result.missing > 0) {
      setShopToast(`Você ainda precisa de ${result.missing} moedas.`);
      setTimeout(() => setShopToast(null), 2500);
    }
  };

  const handleEquip = (item: ShopItem) => equipItem(item.id);

  if (showParentArea) {
    return (
      <ParentDashboardPage
        state={state}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSwitchProfile={switchProfile}
        onAddProfile={addProfile}
        isTaskDoneToday={isTaskDoneToday}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onUpdateGoal={updateGoal}
        onUpdateJarSplit={updateJarSplit}
        onUpdateJarGoals={updateJarGoals}
        onResetAll={resetAll}
        onBack={() => setShowParentArea(false)}
        isFirebaseConfigured={isFirebaseConfigured}
        userEmail={user?.email ?? null}
        authBusy={authBusy}
        authError={authError}
        syncStatus={syncStatus}
        onSignUp={signUp}
        onSignIn={signIn}
        onLogOut={logOut}
      />
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cloud">
      {view === 'inicio' && (
        <HomePage
          state={state}
          isTaskDoneToday={isTaskDoneToday}
          onCompleteTask={completeTask}
          onOpenParentArea={() => setShowParentArea(true)}
          activeEvents={activeEvents}
        />
      )}
      {view === 'missoes' && (
        <MissionsPage
          state={state}
          isTaskDoneToday={isTaskDoneToday}
          onCompleteTask={completeTask}
          familyChallenges={familyChallenges}
        />
      )}
      {view === 'pet' && (
        <PetPage pet={state.pet} playerCoins={state.child.coins} onAction={petAction} onChoosePet={choosePet} />
      )}
      {view === 'casa' && <HousePage state={state} onGoToShop={() => setView('loja')} />}
      {view === 'loja' && (
        <ShopPage state={state} onBuy={handleBuy} onEquip={handleEquip} toast={shopToast} />
      )}
      {view === 'personagem' && (
        <CharacterPage state={state} onUpdateAppearance={updateAppearance} />
      )}

      <BottomNavigation active={view} onChange={setView} />

      {lastReward && <RewardAnimation reward={lastReward} onClose={clearReward} />}

      {unlockedAchievement && (
        <div
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-pop-in rounded-2xl bg-ink px-4 py-3 text-center shadow-xl"
          onClick={clearAchievementBanner}
        >
          <p className="font-display text-sm font-bold text-gold">🏆 Conquista desbloqueada!</p>
          <p className="text-xs font-bold text-white">{unlockedAchievement}</p>
        </div>
      )}
    </div>
  );
}
