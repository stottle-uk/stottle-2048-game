import React from 'react';

interface OwnProps extends Omit<React.HTMLProps<HTMLDivElement>, 'className'> {
  value: number;
}

const Tile: React.FC<OwnProps> = ({ value, ...props }) => (
  <div data-testid="tile" className={`tile tile-${value}`} {...props}>
    {value > 0 ? <span>{value}</span> : <span>&nbsp;</span>}
  </div>
);

export default Tile;
