export type HouseStage = 'quarto' | 'casa' | 'mundo';

export interface HouseStageInfo {
  stage: HouseStage;
  title: string;
  subtitle: string;
  backdropEmoji: string;
  nextStageLevel: number | null;
}

export function getHouseStage(level: number): HouseStageInfo {
  if (level >= 7) {
    return {
      stage: 'mundo',
      title: 'Meu Mundo',
      subtitle: 'Seu espaço cresceu até virar um mundo inteiro!',
      backdropEmoji: '🌍',
      nextStageLevel: null,
    };
  }
  if (level >= 4) {
    return {
      stage: 'casa',
      title: 'Minha Casa',
      subtitle: 'Seu quarto virou uma casa inteira pra decorar',
      backdropEmoji: '🏠',
      nextStageLevel: 7,
    };
  }
  return {
    stage: 'quarto',
    title: 'Meu Quarto',
    subtitle: 'Decore seu espaço com itens da loja',
    backdropEmoji: '🛏️',
    nextStageLevel: 4,
  };
}
