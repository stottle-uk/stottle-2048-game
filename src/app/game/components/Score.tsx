import React from 'react';
import { useStyleTimeout } from '../hooks/useStyleTimeout';

type OwnProps = {
  score: number;
  label: string;
};

const Score: React.FC<OwnProps> = ({ score, label }) => {
  const { elRef } = useStyleTimeout('score-change', score);

  return (
    <div className="score-box">
      <span className="score-label">{label}</span>
      <span className="score-value" ref={elRef}>
        {score}
      </span>
    </div>
  );
};

export default Score;
