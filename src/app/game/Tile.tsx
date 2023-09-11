import React from 'react';

const Tile: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div key={value} className={`tile tile-${value}`}>
      {value > 0 && value}
    </div>
  );
};

export default Tile;
