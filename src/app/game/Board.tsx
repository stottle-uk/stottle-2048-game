import React, { useEffect } from 'react';
import Tile from './Tile';
import { BoardTile, useBoard } from './hooks/useBoard';

const Board: React.FC<{ init?: BoardTile[][] }> = ({ init }) => {
  const { board, score, isGameOver, boardRef } = useBoard(init);

  useEffect(() => {
    const ref = boardRef.current;
    if (ref) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height, width } = entry.contentRect;
          const dimension = Math.min(height - 100, width) * 0.9 + 'px';
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

  return (
    <div className="container">
      <div className="score">
        <span className="score-label">Score:</span>
        <span className="score-value">{score}</span>
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
