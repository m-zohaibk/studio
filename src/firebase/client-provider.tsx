
'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseApp = useMemo(() => initializeFirebase().app, []);

  return <FirebaseProvider app={firebaseApp}>{children}</FirebaseProvider>;
}
