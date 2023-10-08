import { onValue, query } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useFirebaseDbRef } from './useFirebaseDb';

export const useFirebaseList = (firebasePath: string) => {
  const [data, setData] = useState<{ isLoaded: boolean; gameIds: string[] }>({
    gameIds: [],
    isLoaded: false,
  });
  const [error, setError] = useState<unknown>(null);
  const firebaseRef = useFirebaseDbRef(firebasePath);

  useEffect(() => {
    try {
      onValue(query(firebaseRef.current), (snapshot) => {
        setData({
          isLoaded: true,
          gameIds: Object.keys(snapshot.val() || []),
        });
      });
    } catch (err) {
      setError(err);
    }
  }, [firebaseRef]);

  return { data, error };
};
