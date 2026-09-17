import { useState } from 'react';
import PetCard from '../components/PetCard';
import type { Pet, PetSpecies } from '../types';

interface PetPageProps {
  pet: Pet | null;
  playerCoins: number;
  onAction: (action: 'alimentar' | 'brincar' | 'banho' | 'dormir') => void;
  onChoosePet: (species: PetSpecies, name: string) => void;
}

const SPECIES_OPTIONS: { species: PetSpecies; icon: string; label: string }[] = [
  { species: 'cachorro', icon: '🐶', label: 'Cachorro' },
  { species: 'gato', icon: '🐱', label: 'Gato' },
  { species: 'coelho', icon: '🐰', label: 'Coelho' },
];

const ACTIONS: { id: 'alimentar' | 'brincar' | 'banho' | 'dormir'; icon: string; label: string; cost?: string }[] = [
  { id: 'alimentar', icon: '🍖', label: 'Alimentar', cost: '🪙 10' },
  { id: 'brincar', icon: '🎾', label: 'Brincar' },
  { id: 'banho', icon: '🛁', label: 'Dar banho' },
  { id: 'dormir', icon: '😴', label: 'Dormir' },
];

export default function PetPage({ pet, playerCoins, onAction, onChoosePet }: PetPageProps) {
  const [chosenSpecies, setChosenSpecies] = useState<PetSpecies | null>(null);
  const [name, setName] = useState('');

  if (!pet) {
    return (
      <div className="px-5 pb-28 pt-6">
        <h1 className="mb-1 font-display text-2xl font-extrabold text-ink">Escolha seu pet</h1>
        <p className="mb-5 text-sm text-ink/60">Ele vai te acompanhar na sua jornada!</p>

        <div className="grid grid-cols-3 gap-3">
          {SPECIES_OPTIONS.map((opt) => (
            <button
              key={opt.species}
              onClick={() => setChosenSpecies(opt.species)}
              className={`flex flex-col items-center gap-2 rounded-3xl p-4 shadow-sm transition-all active:scale-95 ${
                chosenSpecies === opt.species ? 'bg-violet text-white' : 'bg-white text-ink'
              }`}
            >
              <span className="text-4xl">{opt.icon}</span>
              <span className="font-display text-xs font-bold">{opt.label}</span>
            </button>
          ))}
        </div>

        {chosenSpecies && (
          <div className="mt-6">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do seu pet"
              className="w-full rounded-2xl border-2 border-violet/20 bg-white px-4 py-3 font-display font-bold text-ink outline-none focus:border-violet"
            />
            <button
              disabled={!name.trim()}
              onClick={() => onChoosePet(chosenSpecies, name.trim())}
              className="mt-3 w-full rounded-2xl bg-coral py-3 font-display font-bold text-white shadow-md shadow-coral/30 disabled:opacity-40 active:scale-95"
            >
              Adotar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">Meu Pet</h1>
      <PetCard pet={pet} />

      <h2 className="mb-3 mt-6 font-display text-base font-extrabold text-ink/70">Cuidar do {pet.name}</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => {
          const disabled = a.id === 'alimentar' && playerCoins < 10;
          return (
            <button
              key={a.id}
              onClick={() => onAction(a.id)}
              disabled={disabled}
              className="flex flex-col items-center gap-1.5 rounded-3xl bg-white p-4 shadow-sm transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="text-3xl">{a.icon}</span>
              <span className="font-display text-sm font-bold text-ink">{a.label}</span>
              {a.cost && <span className="text-[11px] font-bold text-ink/40">{a.cost}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
