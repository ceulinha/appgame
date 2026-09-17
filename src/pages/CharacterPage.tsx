import Character from '../components/Character';
import { SHOP_ITEMS } from '../data/initialData';
import type { GameState, CharacterAppearance, SkinTone, HairStyle } from '../types';

interface CharacterPageProps {
  state: GameState;
  onUpdateAppearance: (field: keyof CharacterAppearance, value: string) => void;
}

const SKIN_OPTIONS: { value: SkinTone; color: string }[] = [
  { value: 'clara', color: '#FFDCB8' },
  { value: 'media', color: '#F0B183' },
  { value: 'morena', color: '#C97E52' },
  { value: 'escura', color: '#8A5535' },
];

const HAIR_STYLE_OPTIONS: { value: HairStyle; label: string }[] = [
  { value: 'curto', label: 'Curto' },
  { value: 'longo', label: 'Longo' },
  { value: 'cacheado', label: 'Cacheado' },
  { value: 'moicano', label: 'Moicano' },
];

export default function CharacterPage({ state, onUpdateAppearance }: CharacterPageProps) {
  const { child } = state;
  const ownedEquippables = SHOP_ITEMS.filter((i) => i.appliesTo && child.inventory.includes(i.id));

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">Meu Personagem</h1>

      <div className="flex flex-col items-center rounded-3xl bg-gradient-to-b from-grape to-violet py-8 shadow-md">
        <Character appearance={child.appearance} size={150} bounce />
        <p className="mt-2 font-display font-bold text-white">{child.name}</p>
      </div>

      <h2 className="mb-3 mt-6 font-display text-base font-extrabold text-ink/70">Tom de pele</h2>
      <div className="flex gap-3">
        {SKIN_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onUpdateAppearance('skinTone', opt.value)}
            className={`h-11 w-11 rounded-full transition-all active:scale-90 ${
              child.appearance.skinTone === opt.value ? 'ring-4 ring-violet ring-offset-2' : ''
            }`}
            style={{ backgroundColor: opt.color }}
          />
        ))}
      </div>

      <h2 className="mb-3 mt-6 font-display text-base font-extrabold text-ink/70">Estilo de cabelo</h2>
      <div className="flex flex-wrap gap-2">
        {HAIR_STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onUpdateAppearance('hairStyle', opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
              child.appearance.hairStyle === opt.value ? 'bg-violet text-white' : 'bg-white text-ink/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <h2 className="mb-3 mt-6 font-display text-base font-extrabold text-ink/70">Meu inventário</h2>
      {ownedEquippables.length === 0 ? (
        <p className="rounded-2xl bg-white/70 p-4 text-center text-sm font-bold text-ink/40">
          Compre itens na loja para desbloquear novos visuais!
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {ownedEquippables.map((item) => {
            const isEquipped = (child.appearance[item.appliesTo!.field] as string) === item.appliesTo!.value;
            return (
              <button
                key={item.id}
                onClick={() => onUpdateAppearance(item.appliesTo!.field, item.appliesTo!.value)}
                className={`flex flex-col items-center gap-1 rounded-2xl p-2.5 transition-all active:scale-95 ${
                  isEquipped ? 'bg-violet/15 ring-2 ring-violet' : 'bg-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-ink/60 text-center leading-tight">{item.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
