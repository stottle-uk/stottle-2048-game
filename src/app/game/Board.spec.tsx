import { render, screen } from '@testing-library/react';
import Board from './Board';

describe('Board Component', () => {
  it('initializes the board with empty tiles', () => {
    render(<Board />);
    const tileElements = screen.getAllByTestId('tile');
    expect(tileElements.length).toBe(16);
    expect(tileElements.filter((d) => d.textContent !== '')).lengthOf(2);
    expect(tileElements.filter((d) => d.textContent === '')).lengthOf(14);
  });

  it('adds a random tile when initialized', () => {
    render(<Board />);
    const tileElements = screen.getAllByTestId('tile');
    const nonEmptyTiles = tileElements.filter(
      (tile) => tile.textContent !== ''
    );
    expect(nonEmptyTiles.length).toBe(2);
  });
});
