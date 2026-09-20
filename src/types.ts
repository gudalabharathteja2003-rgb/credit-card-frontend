export interface TransactionInputs {
  Time: number;
  Amount: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  V9: number;
  V10: number;
  V11: number;
  V12: number;
  V13: number;
  V14: number;
  V15: number;
  V16: number;
  V17: number;
  V18: number;
  V19: number;
  V20: number;
  V21: number;
  V22: number;
  V23: number;
  V24: number;
  V25: number;
  V26: number;
  V27: number;
  V28: number;
}

export interface PredictionResponse {
  prediction: number; // 0 = Legitimate, 1 = Fraudulent
  fraud_probability: number; // Float between 0.0 and 1.0
}

export interface PredictionRecord {
  id?: string;
  userId: string;
  userEmail: string;
  modelName: string;
  inputData: TransactionInputs;
  prediction: number;
  fraudProbability: number;
  createdAt: any;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => Promise<void>;
  logout: () => Promise<void>;
}
