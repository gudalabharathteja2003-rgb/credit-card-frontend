import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import { PredictionRecord, TransactionInputs } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== ''
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();

    // Verify server connectivity as recommended by Firebase skill
    getDocFromServer(doc(db, 'test', 'connection')).catch(() => {
      // Non-blocking ping check
    });
  } catch (err) {
    console.warn('Firebase initialization error, falling back to local session store:', err);
  }
}

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};

// Local storage fallback helper for offline/demo testing
const LOCAL_STORAGE_PREDICTIONS_KEY = 'fraud_detection_predictions_local';

export async function savePredictionRecord(
  userId: string,
  userEmail: string,
  inputs: TransactionInputs,
  prediction: number,
  fraudProbability: number
): Promise<string> {
  const newRecord: Omit<PredictionRecord, 'id'> = {
    userId,
    userEmail,
    modelName: 'Credit Card Fraud Detection',
    inputData: inputs,
    prediction,
    fraudProbability,
    createdAt: db ? serverTimestamp() : new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'predictions'), newRecord);
      return docRef.id;
    } catch (err) {
      console.warn('Firestore write failed, saving to local fallback storage:', err);
    }
  }

  // Fallback to local storage persistence
  const existingJson = localStorage.getItem(LOCAL_STORAGE_PREDICTIONS_KEY);
  const records: PredictionRecord[] = existingJson ? JSON.parse(existingJson) : [];
  const localId = 'pred_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fullRecord: PredictionRecord = {
    id: localId,
    ...newRecord,
    createdAt: new Date().toISOString(),
  };
  records.unshift(fullRecord);
  localStorage.setItem(LOCAL_STORAGE_PREDICTIONS_KEY, JSON.stringify(records));
  return localId;
}

export async function fetchUserPredictions(userId: string): Promise<PredictionRecord[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(
        collection(db, 'predictions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let timestamp = data.createdAt;
        if (timestamp && typeof timestamp.toDate === 'function') {
          timestamp = timestamp.toDate().toISOString();
        }
        return {
          id: docSnap.id,
          ...data,
          createdAt: timestamp,
        } as PredictionRecord;
      });
    } catch (err) {
      console.warn('Firestore read error, checking local fallback store:', err);
    }
  }

  // Fallback to local store
  const existingJson = localStorage.getItem(LOCAL_STORAGE_PREDICTIONS_KEY);
  if (!existingJson) return [];
  try {
    const records: PredictionRecord[] = JSON.parse(existingJson);
    return records.filter((r) => r.userId === userId);
  } catch (e) {
    return [];
  }
}
