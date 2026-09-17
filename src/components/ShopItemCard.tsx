import type { ShopItem } from '../types';

interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  playerCoins: number;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export default function ShopItemCard({ item, owned, equipped, playerCoins, onBuy, onEquip }: ShopItemCardProps) {
  const canAfford = playerCoins >= item.price;

  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-3.5 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud text-3xl">
        {item.icon}
      </div>
      <p className="font-display text-sm font-bold text-ink leading-tight">{item.name}</p>

      {!owned && (
        <p className="flex items-center gap-1 text-xs font-bold text-ink/60">
          🪙 {item.price}
        </p>
      )}

      {owned ? (
        <button
          onClick={() => onEquip(item)}
          disabled={equipped}
          className={`w-full rounded-xl py-2 font-display text-xs font-bold transition-all active:scale-95 ${
            equipped ? 'bg-mint/20 text-mint' : 'bg-violet text-white'
          }`}
        >
          {equipped ? '✓ Equipado' : 'Equipar'}
        </button>
      ) : (
        <button
          onClick={() => onBuy(item)}
          className={`w-full rounded-xl py-2 font-display text-xs font-bold transition-all active:scale-95 ${
            canAfford ? 'bg-coral text-white shadow-sm shadow-coral/30' : 'bg-ink/10 text-ink/40'
          }`}
        >
          Comprar
        </button>
      )}
    </div>
  );
}
