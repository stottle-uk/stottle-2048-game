import React, { useEffect } from 'react';
import Score from './components/Score';
import Tile from './components/Tile';
import { BoardTile, useBoard } from './hooks/useBoard';
import { useStorage } from './hooks/useStorage';

const Board: React.FC<{ init?: BoardTile[][] }> = ({ init }) => {
  const { board, score, isGameOver, boardRef } = useBoard(init);
  const [highScore, setHighScore] = useStorage('highScore', score);

  useEffect(() => {
    const ref = boardRef.current;
    if (ref) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height, width } = entry.contentRect;
          const dimension = Math.min(height, width) * 0.9 + 'px';
          ref.style.height = dimension;
          ref.style.width = dimension;
        }
      });
      ro.observe(document.documentElement);

      return () => {
        ro.unobserve(document.documentElement);
      };
    }
  }, [boardRef]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore]);

  return (
    <div className="container">
      <div className="score">
        <Score label="Current Score" score={score} />
        <Score label="High Score" score={highScore} />
      </div>

      <div className={`game-over ${isGameOver ? 'show' : 'hide'}`}>
        {isGameOver ? <span>Game Over</span> : <span>&nbsp;</span>}
      </div>

      <div className="board" ref={boardRef}>
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={tile.value} />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
