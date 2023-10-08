import React, { useEffect, useRef, useState } from 'react';
import Score from './components/Score';
import Tile from './components/Tile';
import { BoardTile, useBoard } from './hooks/useBoard';
import { useFirebaseItem } from './hooks/useFirebaseItem';
import { useStorage } from './hooks/useStorage';

interface GameStata {
  board: BoardTile[][];
  score: number;
  isGameOver: boolean;
  hostGuid: string;
}

const Board: React.FC<{ init?: BoardTile[][] }> = ({ init }) => {
  const { data, writeData } = useFirebaseItem<GameStata>('/2048-game', {
    board: init || [],
    score: 0,
    isGameOver: false,
    hostGuid: '',
  });
  const { board, score, isGameOver, boardRef, setupBoard } = useBoard();
  const [highScore, setHighScore] = useStorage('highScore', score);
  const [hostGuid, setHostGuid] = useStorage('hostGuid', '');
  const [isHost, setIsHost] = useState(true);
  const firstRun = useRef(true);

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
    if (data.score > highScore) {
      setHighScore(data.score);
    }
  }, [data.score, highScore, setHighScore]);

  useEffect(() => {
    if (!hostGuid) {
      setHostGuid(Date.now().toString());
    }
  }, [hostGuid, setHostGuid]);

  useEffect(() => {
    if (data.isLoaded) {
      if (firstRun.current) {
        setupBoard(data.board, data.score);
        setIsHost(data.hostGuid === hostGuid || !data.hostGuid);
        firstRun.current = false;
      } else {
        if (JSON.stringify(data.board) !== JSON.stringify(board) && isHost) {
          writeData({ board, score, isGameOver, ...(isHost && { hostGuid }) });
        }
      }
    }
  }, [
    board,
    data.board,
    data.hostGuid,
    data.isLoaded,
    data.score,
    hostGuid,
    isGameOver,
    isHost,
    score,
    setupBoard,
    writeData,
  ]);

  return (
    <div className="container">
      <div className="score">
        <Score label="Current Score" score={data.score} />
        <Score label="High Score" score={highScore} />
      </div>

      <div className={'game-over'}>
        {data.isGameOver ? (
          <span>Game Over</span>
        ) : isHost && data.isLoaded ? (
          <span>Game Host</span>
        ) : (
          <span>Spectator</span>
        )}
      </div>

      <div className="board" ref={boardRef}>
        {data.isLoaded &&
          data.board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} value={tile.value} />
            ))
          )}
      </div>
    </div>
  );
};

export default Board;
