import type { AppState } from '../types';

const STORAGE_KEY = 'mundo-leo-game-state-v1';

/** Lê o valor bruto salvo, sem validar o formato — a migração acontece no hook. */
export function loadRawState(): unknown | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Falha ao carregar dados salvos:', err);
    return null;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Falha ao salvar dados:', err);
  }
}

export function resetAppState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Falha ao resetar dados:', err);
  }
}
