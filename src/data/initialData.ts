import type {
  GameState,
  AppState,
  Task,
  ShopItem,
  Challenge,
  Achievement,
  FamilyChallenge,
  SeasonalEvent,
} from '../types';

export const TASKS: Task[] = [
  {
    id: 'task-cama',
    name: 'Arrumar a cama',
    icon: '🛏️',
    category: 'habito',
    frequency: 'diaria',
    xp: 20,
    coins: 30,
    money: 0.5,
    active: true,
  },
  {
    id: 'task-dentes',
    name: 'Escovar os dentes',
    icon: '🦷',
    category: 'habito',
    frequency: 'diaria',
    xp: 15,
    coins: 20,
    money: 0,
    active: true,
  },
  {
    id: 'task-lixo',
    name: 'Tirar o lixo',
    icon: '🗑️',
    category: 'responsabilidade',
    frequency: 'diaria',
    xp: 30,
    coins: 50,
    money: 1.0,
    active: true,
  },
  {
    id: 'task-louca',
    name: 'Secar a louça',
    icon: '🍽️',
    category: 'responsabilidade',
    frequency: 'diaria',
    xp: 30,
    coins: 50,
    money: 1.0,
    active: true,
  },
  {
    id: 'task-mochila',
    name: 'Organizar a mochila',
    icon: '🎒',
    category: 'habito',
    frequency: 'diaria',
    xp: 15,
    coins: 20,
    money: 0,
    active: true,
  },
  {
    id: 'task-quarto',
    name: 'Organizar o quarto',
    icon: '🧸',
    category: 'responsabilidade',
    frequency: 'semanal',
    xp: 40,
    coins: 60,
    money: 1.5,
    active: true,
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  // Roupas
  { id: 'shop-camiseta-azul', name: 'Camiseta azul', icon: '👕', category: 'roupas', price: 150, appliesTo: { field: 'outfit', value: 'camiseta_azul' } },
  { id: 'shop-camiseta-verde', name: 'Camiseta verde', icon: '👚', category: 'roupas', price: 150, appliesTo: { field: 'outfit', value: 'camiseta_verde' } },
  { id: 'shop-vestido-rosa', name: 'Vestido rosa', icon: '👗', category: 'roupas', price: 200, appliesTo: { field: 'outfit', value: 'vestido_rosa' } },
  { id: 'shop-fantasia', name: 'Fantasia de herói', icon: '🦸', category: 'roupas', price: 400, appliesTo: { field: 'outfit', value: 'fantasia_heroi' } },
  // Cabelos
  { id: 'shop-cabelo-azul', name: 'Cabelo azul', icon: '💇', category: 'cabelos', price: 250, appliesTo: { field: 'hairColor', value: 'azul' } },
  { id: 'shop-cabelo-rosa', name: 'Cabelo rosa', icon: '💇‍♀️', category: 'cabelos', price: 250, appliesTo: { field: 'hairColor', value: 'rosa' } },
  { id: 'shop-cabelo-cacheado', name: 'Cabelo cacheado', icon: '🦱', category: 'cabelos', price: 180, appliesTo: { field: 'hairStyle', value: 'cacheado' } },
  // Acessórios
  { id: 'shop-oculos', name: 'Óculos estiloso', icon: '🕶️', category: 'acessorios', price: 120, appliesTo: { field: 'accessory', value: 'oculos' } },
  { id: 'shop-bone', name: 'Boné', icon: '🧢', category: 'acessorios', price: 100, appliesTo: { field: 'accessory', value: 'bone' } },
  { id: 'shop-chapeu', name: 'Chapéu mágico', icon: '🎩', category: 'acessorios', price: 220, appliesTo: { field: 'accessory', value: 'chapeu' } },
  // Casa
  { id: 'shop-tapete', name: 'Tapete estelar', icon: '🟪', category: 'casa', price: 180 },
  { id: 'shop-luminaria', name: 'Luminária de lua', icon: '🌙', category: 'casa', price: 140 },
  { id: 'shop-estante', name: 'Estante de troféus', icon: '📚', category: 'casa', price: 300 },
  // Pet
  { id: 'shop-osso', name: 'Ossinho brilhante', icon: '🦴', category: 'pet', price: 60 },
  { id: 'shop-caminha-pet', name: 'Caminha confortável', icon: '🛌', category: 'pet', price: 220 },
  // Especiais
  { id: 'shop-baú', name: 'Baú misterioso', icon: '🎁', category: 'especiais', price: 500 },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'challenge-10-missoes',
    title: 'Maratona de missões',
    description: 'Complete 10 missões',
    goal: 10,
    progress: 7,
    rewardXp: 200,
    rewardCoins: 300,
    type: 'missoes_concluidas',
    completed: false,
  },
  {
    id: 'challenge-5-dias',
    title: 'Semana em dia',
    description: 'Jogue por 5 dias seguidos',
    goal: 5,
    progress: 3,
    rewardXp: 150,
    rewardCoins: 200,
    type: 'dias_seguidos',
    completed: false,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-primeira-missao', title: 'Primeira missão', icon: '🥇', description: 'Complete sua primeira missão', unlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'ach-10-missoes', title: '10 missões concluídas', icon: '🏆', description: 'Complete 10 missões no total', unlocked: false },
  { id: 'ach-5-dias', title: '5 dias seguidos', icon: '🔥', description: 'Jogue por 5 dias seguidos', unlocked: false },
  { id: 'ach-primeiro-item', title: 'Primeiro item comprado', icon: '🛍️', description: 'Compre seu primeiro item na loja', unlocked: false },
  { id: 'ach-primeiro-pet', title: 'Primeiro pet', icon: '🐾', description: 'Escolha seu primeiro pet', unlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'ach-nivel-5', title: 'Nível 5 alcançado', icon: '⭐', description: 'Chegue ao nível 5', unlocked: false },
];

export const FAMILY_CHALLENGES: FamilyChallenge[] = [
  {
    id: 'family-challenge-30-missoes',
    title: 'Time da casa arrumada',
    description: 'Juntos, completem 30 missões (some o total de todas as crianças)',
    goal: 30,
    progress: 0,
    rewardCoinsPerChild: 100,
    completed: false,
  },
];

// Datas em formato YYYY-MM-DD. Para editar ou criar novos eventos, altere esta lista.
export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'evento-demo-boas-vindas',
    title: 'Semana de boas-vindas',
    icon: '🎉',
    description: 'Recompensas em dobro por tempo limitado!',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    rewardMultiplier: 2,
  },
  {
    id: 'evento-natal',
    title: 'Missão de Natal',
    icon: '🎄',
    description: 'Espírito natalino: XP e moedas em dobro!',
    startDate: '2026-12-15',
    endDate: '2026-12-26',
    rewardMultiplier: 2,
  },
];

export const FINANCIAL_TIPS: string[] = [
  'O pote de Guardar é como uma sementinha: quanto mais tempo você deixa crescer, maior fica!',
  'Antes de gastar todas as moedas de uma vez, espera um pouco — às vezes a vontade passa.',
  'Compartilhar uma parte do que você ganha é um jeito de cuidar de quem você gosta.',
  'Comparar preços antes de comprar ajuda a fazer o dinheiro render mais.',
  'Ter uma meta (tipo "quero juntar para aquele brinquedo") ajuda a guardar sem sofrer.',
  'Gastar tudo assim que ganha é diferente de gastar com planejamento — os dois são gastar, mas um deixa você mais tranquilo depois.',
  'Trabalhar por uma recompensa (como fazer as missões) ensina que dinheiro normalmente vem de um esforço.',
];

export function createInitialGameState(): GameState {
  return {
    child: {
      id: 'child-leo',
      name: 'Léo',
      age: 8,
      level: 3,
      xp: 280,
      coins: 650,
      moneyEarned: 28.5,
      monthlyGoal: 100,
      jars: { gastar: 12, guardar: 14.5, compartilhar: 2 },
      jarSplit: { gastar: 50, guardar: 40, compartilhar: 10 },
      jarGoals: { gastar: 0, guardar: 50, compartilhar: 0 },
      streakDays: 3,
      appearance: {
        skinTone: 'media',
        hairStyle: 'curto',
        hairColor: 'castanho',
        outfit: 'camiseta_azul',
        accessory: 'nenhum',
      },
      inventory: ['shop-camiseta-azul'],
      petId: 'pet-bolt',
    },
    pet: {
      id: 'pet-bolt',
      name: 'Bolt',
      species: 'cachorro',
      happiness: 70,
      hunger: 60,
      energy: 80,
      hygiene: 75,
    },
    tasks: TASKS.map((t) => ({ ...t })),
    completions: [],
    challenges: CHALLENGES.map((c) => ({ ...c })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
    lastVisit: new Date().toISOString(),
  };
}

/** Cria um perfil novo e vazio para outra criança da família (Fase 3). */
export function createEmptyChildProfile(name: string, age: number): GameState {
  const id = `child-${Date.now()}-${Math.round(Math.random() * 1000)}`;

  return {
    child: {
      id,
      name,
      age,
      level: 1,
      xp: 0,
      coins: 0,
      moneyEarned: 0,
      monthlyGoal: 100,
      jars: { gastar: 0, guardar: 0, compartilhar: 0 },
      jarSplit: { gastar: 50, guardar: 40, compartilhar: 10 },
      jarGoals: { gastar: 0, guardar: 0, compartilhar: 0 },
      streakDays: 0,
      appearance: {
        skinTone: 'media',
        hairStyle: 'curto',
        hairColor: 'castanho',
        outfit: 'camiseta_azul',
        accessory: 'nenhum',
      },
      inventory: [],
      petId: null,
    },
    pet: null,
    tasks: TASKS.map((t) => ({ ...t })),
    completions: [],
    challenges: CHALLENGES.map((c) => ({ ...c, progress: 0, completed: false })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined })),
    lastVisit: new Date().toISOString(),
  };
}

export function createInitialAppState(): AppState {
  const leo = createInitialGameState();
  return {
    profiles: [leo],
    activeProfileId: leo.child.id,
    familyChallenges: FAMILY_CHALLENGES.map((c) => ({ ...c })),
  };
}
