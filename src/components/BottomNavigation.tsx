export type ChildView = 'inicio' | 'missoes' | 'pet' | 'casa' | 'loja' | 'personagem';

interface BottomNavigationProps {
  active: ChildView;
  onChange: (view: ChildView) => void;
}

const ITEMS: { id: ChildView; label: string; icon: string }[] = [
  { id: 'inicio', label: 'Início', icon: '🏠' },
  { id: 'missoes', label: 'Missões', icon: '🎯' },
  { id: 'pet', label: 'Pet', icon: '🐾' },
  { id: 'casa', label: 'Casa', icon: '🛋️' },
  { id: 'loja', label: 'Loja', icon: '🛍️' },
  { id: 'personagem', label: 'Perfil', icon: '👤' },
];

export default function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-md items-stretch justify-between gap-1 border-t border-ink/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-md">
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-transform active:scale-90"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors ${
                isActive ? 'bg-violet/15' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold ${isActive ? 'text-violet' : 'text-ink/40'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
