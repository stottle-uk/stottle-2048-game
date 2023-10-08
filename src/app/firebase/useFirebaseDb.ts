import { getDatabase, ref } from 'firebase/database';
import { useRef } from 'react';

export const useFirebaseDbRef = (firebasePath: string) =>
  useRef(ref(getDatabase(), firebasePath));
