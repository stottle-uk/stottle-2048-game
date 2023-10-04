import { SetStateAction, useCallback, useState } from 'react';

export const useStorage = <T>(
  key: string,
  initialValue: T | null = null,
  storage: Storage = window.localStorage
): [T, (item: SetStateAction<T>) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (valueToStore === null) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    },
    [key, storage, storedValue]
  );

  return [storedValue, setValue];
};
