
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentReference, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T extends DocumentData>(path: string) {
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }

    const docRef = doc(db, path) as DocumentReference<T>;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path]);

  return { data, loading, error };
}
