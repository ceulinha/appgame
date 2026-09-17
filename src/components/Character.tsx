import type { CharacterAppearance } from '../types';

const SKIN_COLORS: Record<string, string> = {
  clara: '#FFDCB8',
  media: '#F0B183',
  morena: '#C97E52',
  escura: '#8A5535',
};

const HAIR_COLORS: Record<string, string> = {
  preto: '#2B1F1A',
  castanho: '#6B4226',
  loiro: '#E8C468',
  ruivo: '#D3572A',
  azul: '#4F8FE8',
  rosa: '#F06BB0',
};

const OUTFIT_COLORS: Record<string, string> = {
  camiseta_azul: '#4F8FE8',
  camiseta_verde: '#3FBF80',
  vestido_rosa: '#F06BB0',
  fantasia_heroi: '#E84393',
  pijama: '#8B7FF0',
};

const ACCESSORY_EMOJI: Record<string, string> = {
  nenhum: '',
  oculos: '🕶️',
  bone: '🧢',
  chapeu: '🎩',
  fones: '🎧',
};

interface CharacterProps {
  appearance: CharacterAppearance;
  size?: number;
  bounce?: boolean;
  className?: string;
}

export default function Character({ appearance, size = 140, bounce = false, className = '' }: CharacterProps) {
  const skin = SKIN_COLORS[appearance.skinTone] ?? SKIN_COLORS.media;
  const hair = HAIR_COLORS[appearance.hairColor] ?? HAIR_COLORS.castanho;
  const outfit = OUTFIT_COLORS[appearance.outfit] ?? OUTFIT_COLORS.camiseta_azul;
  const accessory = ACCESSORY_EMOJI[appearance.accessory] ?? '';
  const isDress = appearance.outfit === 'vestido_rosa';
  const isLongHair = appearance.hairStyle === 'longo';
  const isCurly = appearance.hairStyle === 'cacheado';
  const isMohawk = appearance.hairStyle === 'moicano';

  return (
    <div
      className={`relative ${bounce ? 'animate-bounce-slow' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* sombra */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="#00000014" />

        {/* corpo / roupa */}
        {isDress ? (
          <path d="M 70 120 Q 100 100 130 120 L 145 185 L 55 185 Z" fill={outfit} />
        ) : (
          <rect x="62" y="118" width="76" height="60" rx="22" fill={outfit} />
        )}

        {/* braços */}
        <circle cx="58" cy="140" r="14" fill={skin} />
        <circle cx="142" cy="140" r="14" fill={skin} />

        {/* cabeça */}
        <circle cx="100" cy="92" r="52" fill={skin} />

        {/* cabelo */}
        {isMohawk ? (
          <path d="M 90 30 L 100 5 L 110 30 Z" fill={hair} />
        ) : isCurly ? (
          <>
            <circle cx="60" cy="60" r="16" fill={hair} />
            <circle cx="80" cy="42" r="18" fill={hair} />
            <circle cx="105" cy="36" r="18" fill={hair} />
            <circle cx="130" cy="42" r="18" fill={hair} />
            <circle cx="145" cy="62" r="16" fill={hair} />
          </>
        ) : isLongHair ? (
          <>
            <path d="M 48 95 Q 40 55 100 40 Q 160 55 152 95 L 152 130 Q 140 110 140 90 L 140 60 L 60 60 L 60 90 Q 60 110 48 130 Z" fill={hair} />
          </>
        ) : (
          <path d="M 50 80 Q 48 35 100 32 Q 152 35 150 80 Q 130 55 100 55 Q 70 55 50 80 Z" fill={hair} />
        )}

        {/* rosto */}
        <circle cx="82" cy="95" r="5" fill="#241B3D" />
        <circle cx="118" cy="95" r="5" fill="#241B3D" />
        <path d="M 84 112 Q 100 124 116 112" stroke="#241B3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="70" cy="105" r="7" fill="#FF8C7F" opacity="0.5" />
        <circle cx="130" cy="105" r="7" fill="#FF8C7F" opacity="0.5" />
      </svg>

      {accessory && (
        <div
          className="absolute text-3xl"
          style={{ top: size * 0.06, left: '50%', transform: 'translateX(-50%)', fontSize: size * 0.22 }}
        >
          {accessory}
        </div>
      )}
    </div>
  );
}
