import { useEffect, useMemo, useRef, useState } from 'react';

export type BoardTile = {
  value: number;
};

type Direction = 'right' | 'left' | 'up' | 'down';

const getEmptyTiles: (
  board: BoardTile[][]
) => { row: number; col: number }[] = (board) => {
  const emptyTiles: { row: number; col: number }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col].value === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  return emptyTiles;
};

const getRandomValue: (board: BoardTile[][]) => {
  row: number;
  col: number;
  newValue: number;
} = (board: BoardTile[][]) => {
  const emptyTiles = getEmptyTiles(board);
  const tile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  return { ...tile, newValue: Math.random() < 0.9 ? 2 : 4 };
};

const initBoard: (init: BoardTile[][]) => BoardTile[][] = (init) =>
  (init.length ? [] : [getRandomValue, getRandomValue]).reduce(
    (prev, curr) => {
      const rnd = curr(prev);
      if (!rnd) {
        return prev;
      }
      prev[rnd.row][rnd.col] = { value: rnd.newValue };
      return prev;
    },
    Array.from<BoardTile>({ length: 4 })
      .fill({ value: 0 })
      .reduce<BoardTile[][]>(
        (prev, curr, colIdx) => [
          ...prev,
          Array.from<BoardTile>({ length: 4 })
            .fill({ value: curr.value })
            .map((d, rowIdx) => ({
              ...d,
              value:
                init && init[colIdx] && init[colIdx][rowIdx]
                  ? init[colIdx][rowIdx]?.value || d.value
                  : d.value,
            })),
        ],
        []
      )
  );

const hasPossibleMoves = (board: BoardTile[][]) => {
  // Iterate over the board and check for adjacent tiles with the same value
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tile = board[row][col];

      if (tile.value === 0) {
        return true; // There is an empty tile, so there are possible moves
      }

      // Check adjacent tiles (up, down, left, right)
      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ];

      for (const neighbor of neighbors) {
        const { row: nRow, col: nCol } = neighbor;
        if (nRow >= 0 && nRow < 4 && nCol >= 0 && nCol < 4) {
          const neighborTile = board[nRow][nCol];
          if (neighborTile.value === tile.value) {
            return true; // There are adjacent tiles with the same value, so there are possible moves
          }
        }
      }
    }
  }
  return false; // No empty tiles and no possible moves
};

export const useBoard = (init: BoardTile[][] = []) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<BoardTile[][]>(initBoard(init));
  const [isGameOver, setGameOver] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mapKey = (event: KeyboardEvent) =>
      new Map<KeyboardEvent['key'], Direction>([
        ['ArrowUp', 'up'],
        ['ArrowDown', 'down'],
        ['ArrowLeft', 'left'],
        ['ArrowRight', 'right'],
      ]).get(event.key);

    const handleKeyPress = (event: KeyboardEvent) => {
      const direction = mapKey(event);
      if (!direction) {
        return;
      }
      event.preventDefault();
      handleMove(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      setStartPos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const deltaX = event.changedTouches[0].clientX - startPos.x;
      const deltaY = event.changedTouches[0].clientY - startPos.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          handleMove('right');
        } else {
          handleMove('left');
        }
      } else {
        if (deltaY > 0) {
          handleMove('down');
        } else {
          handleMove('up');
        }
      }
    };

    const handleMove = (direction: Direction) => {
      const newBoard: BoardTile[][] = JSON.parse(JSON.stringify(board));

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
      } else if (!hasPossibleMoves(board)) {
        setGameOver(true);
      }
    };

    const ref = boardRef.current;
    if (ref) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          const sdsd = Math.min(cr.height, cr.width) + 'px';
          ref.style.height = sdsd;
          ref.style.width = sdsd;
        }
      });
      ro.observe(window.document.documentElement);

      window.addEventListener('keydown', handleKeyPress);
      ref.addEventListener('touchstart', handleTouchStart);
      ref.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        ref.removeEventListener('touchstart', handleTouchStart);
        ref.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [board, startPos]);

  const score = useMemo(
    () => board.flat().reduce((p, c) => p + c.value, 0),
    [board]
  );

  return { board, score, isGameOver, boardRef };
};
