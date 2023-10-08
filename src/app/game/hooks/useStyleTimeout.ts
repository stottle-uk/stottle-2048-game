import { useLayoutEffect, useRef } from 'react';

export const useStyleTimeout = <T extends HTMLElement>(
  styleName: string,
  value: number,
  timeout = 100
) => {
  const elRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (elRef.current && value > 0) {
      const tile = elRef.current;
      tile.classList.add(styleName);
      setTimeout(() => {
        tile.classList.remove(styleName);
      }, timeout);
    }
  }, [styleName, timeout, value]);

  return { elRef };
};
