import React from 'react';
import { useStyleTimeout } from '../hooks/useStyleTimeout';

interface OwnProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'className' | 'ref'> {
  value: number;
}

const Tile: React.FC<OwnProps> = ({ value, ...props }) => {
  const { elRef } = useStyleTimeout<HTMLDivElement>('tile-change', value);

  return (
    <div
      data-testid="tile"
      className={`tile tile-${value}`}
      ref={elRef}
      {...props}
    >
      {value > 0 ? <span>{value}</span> : <span>&nbsp;</span>}
    </div>
  );
};

export default Tile;
