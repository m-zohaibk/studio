
'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Define the shape of the context value
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

// Define the props for the provider component
interface FirebaseProviderProps {
  children: ReactNode;
  app: FirebaseApp | null;
}

// Create the provider component
export function FirebaseProvider({ children, app }: FirebaseProviderProps) {
  const auth = useMemo(() => (app ? getAuth(app) : null), [app]);
  const firestore = useMemo(() => (app ? getFirestore(app) : null), [app]);

  const value = useMemo(() => ({ app, auth, firestore }), [app, auth, firestore]);

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

// Hooks to get specific Firebase services
export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}
