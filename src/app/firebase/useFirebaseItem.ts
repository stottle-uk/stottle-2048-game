import { onValue, set } from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { useFirebaseDbRef } from './useFirebaseDb';

export const useFirebaseItem = <T>(firebasePath: string, init: T) => {
  const [data, setData] = useState<T & { isLoaded: boolean }>({
    ...init,
    isLoaded: false,
  });
  const [error, setError] = useState<unknown>(null);
  const firebaseRef = useFirebaseDbRef(firebasePath);

  useEffect(() => {
    try {
      const sub = onValue(firebaseRef.current, (snapshot) => {
        setData((d) => ({ ...d, ...snapshot.val(), isLoaded: true }));
      });
      return () => sub();
    } catch (err) {
      setError(err);
    }
  }, [firebaseRef]);

  const writeData = useCallback(
    async (newData: T) => {
      try {
        set(firebaseRef.current, newData);
      } catch (err) {
        setError(err);
      }
    },
    [firebaseRef]
  );

  return { data, error, writeData };
};
