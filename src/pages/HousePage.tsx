import Character from '../components/Character';
import { SHOP_ITEMS } from '../data/initialData';
import { getHouseStage } from '../utils/houseStage';
import type { GameState } from '../types';

interface HousePageProps {
  state: GameState;
  onGoToShop: () => void;
}

const STAGE_BACKGROUND: Record<string, string> = {
  quarto: 'from-violet-light/20 to-mint/10',
  casa: 'from-gold/20 to-coral/10',
  mundo: 'from-mint/25 to-violet/15',
};

export default function HousePage({ state, onGoToShop }: HousePageProps) {
  const { child } = state;
  const houseItems = SHOP_ITEMS.filter((i) => i.category === 'casa');
  const ownedHouseItems = houseItems.filter((i) => child.inventory.includes(i.id));
  const stageInfo = getHouseStage(child.level);

  return (
    <div className="px-5 pb-28 pt-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xl">{stageInfo.backdropEmoji}</span>
        <h1 className="font-display text-2xl font-extrabold text-ink">{stageInfo.title}</h1>
      </div>
      <p className="mb-5 text-sm text-ink/60">{stageInfo.subtitle}</p>

      {/* Cenário */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-b p-6 ${STAGE_BACKGROUND[stageInfo.stage]}`}
        style={{ minHeight: 260 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[#D9C9A8]/40" />
        <span className="absolute right-4 top-4 text-4xl opacity-30">{stageInfo.backdropEmoji}</span>
        <div className="relative flex h-full flex-col items-center justify-end gap-3 pb-4">
          <Character appearance={child.appearance} size={110} />
          <div className="flex gap-3 text-3xl">
            {ownedHouseItems.length === 0 && (
              <span className="text-sm font-bold text-ink/40">Seu espaço está vazio por enquanto ✨</span>
            )}
            {ownedHouseItems.map((item) => (
              <span key={item.id} title={item.name}>{item.icon}</span>
            ))}
          </div>
        </div>
      </div>

      {stageInfo.nextStageLevel && (
        <p className="mt-3 text-center text-xs font-bold text-ink/40">
          No nível {stageInfo.nextStageLevel}, seu espaço evolui de novo! (nível atual: {child.level})
        </p>
      )}

      <h2 className="mb-3 mt-6 font-display text-base font-extrabold text-ink/70">Itens da casa</h2>
      <div className="grid grid-cols-3 gap-3">
        {houseItems.map((item) => {
          const owned = child.inventory.includes(item.id);
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-center ${
                owned ? 'bg-mint/15' : 'bg-white/70'
              }`}
            >
              <span className={`text-2xl ${owned ? '' : 'opacity-40'}`}>{item.icon}</span>
              <span className="text-[11px] font-bold text-ink/70">{item.name}</span>
              {!owned && <span className="text-[10px] font-bold text-ink/40">🪙 {item.price}</span>}
            </div>
          );
        })}
      </div>

      <button
        onClick={onGoToShop}
        className="mt-5 w-full rounded-2xl bg-violet py-3 font-display font-bold text-white shadow-md shadow-violet/30 active:scale-95"
      >
        Ir para a loja 🛍️
      </button>
    </div>
  );
}
