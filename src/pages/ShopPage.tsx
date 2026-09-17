import { useState } from 'react';
import ShopItemCard from '../components/ShopItemCard';
import CoinDisplay from '../components/CoinDisplay';
import { SHOP_ITEMS } from '../data/initialData';
import type { GameState, ShopItem, ShopCategory } from '../types';

interface ShopPageProps {
  state: GameState;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  toast: string | null;
}

const CATEGORIES: { id: ShopCategory; icon: string; label: string }[] = [
  { id: 'roupas', icon: '👕', label: 'Roupas' },
  { id: 'cabelos', icon: '💇', label: 'Cabelos' },
  { id: 'acessorios', icon: '🎩', label: 'Acessórios' },
  { id: 'casa', icon: '🏠', label: 'Casa' },
  { id: 'pet', icon: '🐾', label: 'Pet' },
  { id: 'especiais', icon: '🎁', label: 'Especiais' },
];

export default function ShopPage({ state, onBuy, onEquip, toast }: ShopPageProps) {
  const [category, setCategory] = useState<ShopCategory>('roupas');
  const { child } = state;
  const items = SHOP_ITEMS.filter((i) => i.category === category);

  return (
    <div className="pb-28 pt-6">
      <div className="flex items-center justify-between px-5">
        <h1 className="font-display text-2xl font-extrabold text-ink">Loja</h1>
        <CoinDisplay coins={child.coins} />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
              category === c.id ? 'bg-violet text-white' : 'bg-white text-ink/60'
            }`}
          >
            <span>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="mx-5 mt-3 rounded-2xl bg-coral/10 px-4 py-2 text-center text-sm font-bold text-coral">
          {toast}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            owned={child.inventory.includes(item.id)}
            equipped={!!item.appliesTo && (child.appearance[item.appliesTo.field] as string) === item.appliesTo.value}
            playerCoins={child.coins}
            onBuy={onBuy}
            onEquip={onEquip}
          />
        ))}
      </div>
    </div>
  );
}
