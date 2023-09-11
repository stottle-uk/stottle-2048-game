import { useEffect, useState } from 'react';
import Tile from './Tile';

type Tile = {
  value: number;
};

const getRandomValue = (board: Tile[][]) => {
  const emptyTiles: { row: number; col: number }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col].value === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  if (emptyTiles.length === 0) {
    // No empty tiles left, game over
    alert('Game Over');
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const { row, col } = emptyTiles[randomIndex];

  console.log(emptyTiles);

  const newValue = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

  return { row, col, newValue };
};

const initBoard: () => () => Tile[][] = () => () => {
  const board = Array.from<Tile>({ length: 4 })
    .fill({ value: 0 })
    .reduce<Tile[][]>(
      (prev) => [...prev, Array.from<Tile>({ length: 4 }).fill({ value: 0 })],
      []
    );

  const rnd1 = getRandomValue(board);
  const rnd2 = getRandomValue(board);

  if (rnd1 && rnd2) {
    board[rnd1.row][rnd1.col] = { value: rnd1.newValue };
    board[rnd2.row][rnd2.col] = { value: rnd2.newValue };
  }
  return board;
};

const Board = () => {
  const [board, setBoard] = useState<Tile[][]>(initBoard());
  const [score, setScore] = useState(0);

  // Handle user input (e.g., arrow key presses) using event listeners
  useEffect(() => {
    const mapKey = (event: KeyboardEvent) =>
      new Map([
        ['ArrowUp', 'up'],
        ['ArrowDown', 'down'],
        ['ArrowLeft', 'left'],
        ['ArrowRight', 'right'],
      ]).get(event.key);

    const handleKeyPress = (event: KeyboardEvent) => {
      // Update the game state based on the key pressed
      // (You can add your key handling logic here)
      const direction = mapKey(event);
      if (!direction) {
        return;
      }

      event.preventDefault();
      const newBoard: Tile[][] = JSON.parse(JSON.stringify(board));

      // Determine the order of traversal based on the direction
      const rows = direction === 'down' ? [3, 2, 1, 0] : [0, 1, 2, 3];
      const cols = direction === 'right' ? [3, 2, 1, 0] : [0, 1, 2, 3];

      let moved = false; // Flag to track if any tiles were moved

      // Move and merge tiles in the specified direction
      for (const row of rows) {
        for (const col of cols) {
          const tile = newBoard[row][col];

          if (tile.value === 0) {
            continue; // Skip empty tiles
          }

          let newRow = row;
          let newCol = col;

          // Move the tile as far as possible in the specified direction
          while (tile) {
            const nextRow =
              newRow + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
            const nextCol =
              newCol +
              (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);

            // Check if the next position is within the board boundaries
            if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) {
              break; // Tile reached the edge of the board
            }

            const nextTile = newBoard[nextRow][nextCol];

            if (nextTile.value === 0) {
              // Move the tile to the next position
              newBoard[nextRow][nextCol] = { value: tile.value };
              newBoard[newRow][newCol] = { value: 0 };
              newRow = nextRow;
              newCol = nextCol;
              moved = true;
            } else if (nextTile.value === tile.value) {
              // Merge the current tile with the next tile
              newBoard[nextRow][nextCol] = { value: tile.value * 2 };
              newBoard[newRow][newCol] = { value: 0 };
              setScore((s) => s + +tile.value * 2);
              moved = true;
              break;
            } else {
              break; // Tile cannot move further
            }
          }
        }
      }

      if (moved) {
        // Update the game board with the new state
        const rndVal = getRandomValue(newBoard);
        if (rndVal) {
          newBoard[rndVal.row][rndVal.col] = { value: rndVal.newValue };
        }
        setBoard(newBoard);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [board]);

  return (
    <>
      <div className="board">
        {/* Render the game board */}
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={tile.value} />
          ))
        )}
        {/* Display the score */}
        <div className="score">Score: {score}</div>
      </div>
      <pre>{JSON.stringify(board, undefined, 2)}</pre>
    </>
  );
};

export default Board;
