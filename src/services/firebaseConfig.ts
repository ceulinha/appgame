import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// ⚠️ IMPORTANTE: preencha com as chaves do SEU projeto Firebase.
// Veja o passo a passo no README ("Como configurar o Firebase") para saber
// exatamente onde pegar cada um desses valores — é tudo gratuito.
const firebaseConfig = {
  apiKey: 'COLE_AQUI_SUA_API_KEY',
  authDomain: 'COLE_AQUI_SEU_PROJETO.firebaseapp.com',
  projectId: 'COLE_AQUI_SEU_PROJETO_ID',
  storageBucket: 'COLE_AQUI_SEU_PROJETO.appspot.com',
  messagingSenderId: 'COLE_AQUI_SEU_SENDER_ID',
  appId: 'COLE_AQUI_SEU_APP_ID',
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('COLE_AQUI');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
