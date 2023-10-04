import React from 'react';

type OwnProps = {
  score: number;
  label: string;
};

const Score: React.FC<OwnProps> = ({ score, label }) => (
  <div className="score-box">
    <span className="score-label">{label}</span>
    <span className="score-value">{score}</span>
  </div>
);

export default Score;
