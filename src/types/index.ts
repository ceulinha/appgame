// ===== Tarefas =====

export type TaskCategory = 'habito' | 'responsabilidade' | 'missao_especial';
export type TaskFrequency = 'diaria' | 'dias_especificos' | 'semanal';

export interface Task {
  id: string;
  name: string;
  icon: string; // emoji
  category: TaskCategory;
  frequency: TaskFrequency;
  daysOfWeek?: number[]; // 0=domingo ... 6=sabado, usado se frequency = dias_especificos
  xp: number;
  coins: number;
  money: number; // em reais
  active: boolean;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  completedAt: string; // ISO date
}

// ===== Personagem =====

export type SkinTone = 'clara' | 'media' | 'morena' | 'escura';
export type HairStyle = 'curto' | 'longo' | 'cacheado' | 'moicano';
export type HairColor = 'preto' | 'castanho' | 'loiro' | 'ruivo' | 'azul' | 'rosa';
export type Outfit = 'camiseta_azul' | 'camiseta_verde' | 'vestido_rosa' | 'fantasia_heroi' | 'pijama';
export type Accessory = 'nenhum' | 'oculos' | 'bone' | 'chapeu' | 'fones';

export interface CharacterAppearance {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  outfit: Outfit;
  accessory: Accessory;
}

// ===== Inventário / Loja =====

export type ShopCategory = 'roupas' | 'cabelos' | 'acessorios' | 'casa' | 'pet' | 'especiais';

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  category: ShopCategory;
  price: number; // em moedas
  // Se o item se aplica ao personagem, referencia qual propriedade/valor ele seta
  appliesTo?: {
    field: keyof CharacterAppearance;
    value: string;
  };
}

// ===== Pet =====

export type PetSpecies = 'cachorro' | 'gato' | 'coelho';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  happiness: number; // 0-100
  hunger: number; // 0-100 (100 = cheio)
  energy: number; // 0-100
  hygiene: number; // 0-100
}

// ===== Desafios e conquistas =====

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  type: 'missoes_concluidas' | 'dias_seguidos';
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// ===== Potes de dinheiro (gastar / guardar / compartilhar) =====

export type JarType = 'gastar' | 'guardar' | 'compartilhar';

export interface JarSplit {
  gastar: number; // percentual (soma deve ser 100)
  guardar: number;
  compartilhar: number;
}

export interface JarBalances {
  gastar: number; // em reais
  guardar: number;
  compartilhar: number;
}

export interface JarGoals {
  gastar: number; // 0 = sem meta definida
  guardar: number;
  compartilhar: number;
}

// ===== Criança / Jogador =====

export interface Child {
  id: string;
  name: string;
  age: number;
  level: number;
  xp: number;
  coins: number;
  moneyEarned: number; // total simulado em reais (soma dos três potes)
  monthlyGoal: number; // meta de mesada em reais
  jars: JarBalances;
  jarSplit: JarSplit;
  jarGoals: JarGoals;
  streakDays: number;
  appearance: CharacterAppearance;
  inventory: string[]; // ids de ShopItem comprados
  petId: string | null;
}

// ===== Estado global do jogo =====

export interface GameState {
  child: Child;
  pet: Pet | null;
  tasks: Task[];
  completions: TaskCompletion[];
  challenges: Challenge[];
  achievements: Achievement[];
  lastVisit: string; // ISO date, usado para calcular streak
}

// ===== Desafios da família (compartilhados entre todos os perfis) =====

export interface FamilyChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  rewardCoinsPerChild: number;
  completed: boolean;
}

// ===== Eventos sazonais =====

export interface SeasonalEvent {
  id: string;
  title: string;
  icon: string;
  description: string;
  startDate: string; // ISO (YYYY-MM-DD)
  endDate: string; // ISO (YYYY-MM-DD)
  rewardMultiplier: number; // ex: 2 = dobra XP e moedas das missões nesse período
}

// ===== Multi-perfil (Fase 3) =====
// Cada família pode ter mais de uma criança. Cada perfil guarda seu próprio
// progresso (GameState) de forma independente.

export interface AppState {
  profiles: GameState[];
  activeProfileId: string;
  familyChallenges: FamilyChallenge[];
}

// ===== Recompensa (para animação) =====

export interface RewardPayload {
  xp: number;
  coins: number;
  money: number;
  leveledUp?: boolean;
  newLevel?: number;
}
