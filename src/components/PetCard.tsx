import type { Pet } from '../types';

const SPECIES_EMOJI: Record<Pet['species'], string> = {
  cachorro: '🐶',
  gato: '🐱',
  coelho: '🐰',
};

function StatBar({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-center text-base">{icon}</span>
      <div className="flex-1">
        <div className="mb-0.5 flex justify-between text-[11px] font-bold text-ink/50">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-ink/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-mint/15 text-5xl animate-bounce-slow">
          {SPECIES_EMOJI[pet.species]}
        </div>
        <div>
          <p className="font-display text-xl font-extrabold text-ink">{pet.name}</p>
          <p className="text-sm font-bold text-ink/50 capitalize">{pet.species}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <StatBar icon="❤️" label="Felicidade" value={pet.happiness} color="#E84393" />
        <StatBar icon="🍖" label="Fome" value={pet.hunger} color="#FF6B5B" />
        <StatBar icon="⚡" label="Energia" value={pet.energy} color="#FFB800" />
        <StatBar icon="🧼" label="Higiene" value={pet.hygiene} color="#2AD9B8" />
      </div>
    </div>
  );
}
