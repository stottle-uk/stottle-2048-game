import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BoardTile, useBoard } from './useBoard';

describe('useBoard Hook', () => {
  let TestComponent: React.FC<{ init?: BoardTile[][] }>;

  beforeEach(() => {
    TestComponent = ({ init }) => {
      const { boardRef, ...hookValues } = useBoard(init);
      return (
        <div ref={boardRef}>
          {Object.entries(hookValues).map(([key, value]) => (
            <div key={key} data-testid={key}>
              {JSON.stringify(value)}
            </div>
          ))}
        </div>
      );
    };
  });

  it('adds a random tile when initialized', () => {
    const { getByTestId } = render(<TestComponent />);
    const boardData = getByTestId('board');
    const board = (
      JSON.parse(boardData.textContent || '[]') as BoardTile[]
    ).flat();

    expect(board.filter((tile) => tile.value === 0)).toHaveLength(14);
    expect(board.filter((tile) => tile.value !== 0)).toHaveLength(2);
  });

  it('updates the board when a move is simulated', () => {
    const { getByTestId, container } = render(<TestComponent />);
    const boardData = getByTestId('board');
    const initialBoard = JSON.parse(boardData.textContent || '[]');

    act(() => {
      fireEvent.keyDown(container, { key: 'ArrowUp' });
    });

    const updatedBoardData = getByTestId('board');
    const updatedBoard = JSON.parse(updatedBoardData.textContent || '[]');

    expect(updatedBoard).not.toEqual(initialBoard);
  });

  it('updates the score when a move is simulated', () => {
    const { getByTestId, container } = render(<TestComponent />);
    const scoreElement = getByTestId('score');
    const initialScore = parseInt(scoreElement.textContent || '0', 10);

    act(() => {
      fireEvent.keyDown(container, { key: 'ArrowUp' });
    });

    const updatedScoreElement = getByTestId('score');
    const updatedScore = parseInt(updatedScoreElement.textContent || '0', 10);

    expect(updatedScore).not.toEqual(initialScore);
  });

  it('detects when there are no empty tiles, but still possible moves', () => {
    const initialBoard: BoardTile[][] = [
      [{ value: 2 }, { value: 4 }, { value: 2 }, { value: 2 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
      [{ value: 2 }, { value: 4 }, { value: 2 }, { value: 4 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
    ];

    const { container } = render(<TestComponent init={initialBoard} />);
    act(() => {
      fireEvent.keyDown(container, { key: 'ArrowUp' });
    });

    expect(screen.getByTestId('isGameOver').textContent).toBe('false');
  });

  it('detects game over when there are no empty tiles', () => {
    const initialBoard: BoardTile[][] = [
      [{ value: 2 }, { value: 4 }, { value: 2 }, { value: 4 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
      [{ value: 2 }, { value: 4 }, { value: 2 }, { value: 4 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
    ];

    const { container } = render(<TestComponent init={initialBoard} />);
    act(() => {
      fireEvent.keyDown(container, { key: 'ArrowUp' });
    });

    expect(screen.getByTestId('isGameOver').textContent).toBe('true');
  });

  it('detects swipe gestures and updates the board', () => {
    const { getByTestId } = render(<TestComponent />);
    const boardData = getByTestId('board');
    const initialBoard = JSON.parse(boardData.textContent || '[]');

    // Simulate a swipe gesture (e.g., right)
    act(() => {
      fireEvent.touchStart(boardData, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      fireEvent.touchEnd(boardData, {
        changedTouches: [{ clientX: 100, clientY: 0 }],
      });
    });

    const updatedBoardData = getByTestId('board');
    const updatedBoard = JSON.parse(updatedBoardData.textContent || '[]');

    expect(updatedBoard).not.toEqual(initialBoard);
  });
});
