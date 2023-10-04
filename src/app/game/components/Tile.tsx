import React, { useLayoutEffect, useRef } from 'react';

interface OwnProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'className' | 'ref'> {
  value: number;
}

const Tile: React.FC<OwnProps> = ({ value, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current && value > 0) {
      const tile = ref.current;
      tile.classList.add('tile-change');
      setTimeout(() => {
        tile.classList.remove('tile-change');
      }, 100);
    }
  }, [value]);

  return (
    <div
      data-testid="tile"
      className={`tile tile-${value}`}
      ref={ref}
      {...props}
    >
      {value > 0 ? <span>{value}</span> : <span>&nbsp;</span>}
    </div>
  );
};

export default Tile;
