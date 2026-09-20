import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  isFirebaseConfigured,
} from '../lib/firebase';
import { AuthContextType, AuthUser } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'fraud_detection_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL,
          });
        } else {
          // Check if demo user stored locally
          const stored = localStorage.getItem(LOCAL_USER_KEY);
          if (stored) {
            try {
              setCurrentUser(JSON.parse(stored));
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Offline / Demo mode
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (auth && isFirebaseConfigured) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // Demo fallback sign-in
        const user: AuthUser = {
          uid: 'demo_' + email.replace(/[^a-zA-Z0-9]/g, '_'),
          email,
          displayName: email.split('@')[0],
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    setLoading(true);
    try {
      if (auth && isFirebaseConfigured) {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        // Demo fallback sign-up
        const user: AuthUser = {
          uid: 'demo_' + email.replace(/[^a-zA-Z0-9]/g, '_'),
          email,
          displayName: name || email.split('@')[0],
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (auth && googleProvider && isFirebaseConfigured) {
        await signInWithPopup(auth, googleProvider);
      } else {
        // Demo Google sign-in
        const user: AuthUser = {
          uid: 'google_demo_' + Date.now(),
          email: 'analyst@enterprise-fraud.com',
          displayName: 'Enterprise Security Analyst',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInDemo = async () => {
    setLoading(true);
    try {
      const user: AuthUser = {
        uid: 'demo_analyst_001',
        email: 'analyst@fraudguard.io',
        displayName: 'Risk Operations Specialist',
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (auth && isFirebaseConfigured) {
        await signOut(auth);
      }
      localStorage.removeItem(LOCAL_USER_KEY);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
