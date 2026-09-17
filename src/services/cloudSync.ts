import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebaseConfig';
import type { AppState } from '../types';

export { isFirebaseConfigured };

export function subscribeToAuth(callback: (user: User | null) => void): Unsubscribe {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signUpParent(email: string, password: string): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!auth) return { ok: false, message: 'Firebase não configurado ainda.' };
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (err) {
    return { ok: false, message: translateFirebaseError(err) };
  }
}

export async function signInParent(email: string, password: string): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!auth) return { ok: false, message: 'Firebase não configurado ainda.' };
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (err) {
    return { ok: false, message: translateFirebaseError(err) };
  }
}

export async function signOutParent(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function fetchCloudAppState(uid: string): Promise<AppState | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'families', uid));
  return snap.exists() ? (snap.data() as AppState) : null;
}

export async function saveCloudAppState(uid: string, state: AppState): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'families', uid), state);
}

export function subscribeToCloudAppState(uid: string, callback: (state: AppState, isLocalWrite: boolean) => void): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'families', uid), (snap) => {
    if (!snap.exists()) return;
    callback(snap.data() as AppState, snap.metadata.hasPendingWrites);
  });
}

function translateFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  if (code.includes('email-already-in-use')) return 'Esse e-mail já tem uma conta. Tente entrar em vez de criar.';
  if (code.includes('invalid-email')) return 'E-mail inválido.';
  if (code.includes('weak-password')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'E-mail ou senha incorretos.';
  }
  if (code.includes('network-request-failed')) return 'Sem conexão com a internet.';
  return 'Não foi possível completar a ação. Tente novamente.';
}
