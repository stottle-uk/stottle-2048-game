import { render, screen } from '@testing-library/react';
import Board from './Board';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('Board Component', () => {
  it('initializes the board with empty tiles', () => {
    render(<Board />);
    const tileElements = screen.getAllByTestId('tile');
    expect(tileElements.length).toBe(16);

    expect(
      tileElements.filter((d) => d.textContent?.charCodeAt(0) !== 160)
    ).lengthOf(2);
    expect(
      tileElements.filter((d) => d.textContent?.charCodeAt(0) === 160)
    ).lengthOf(14);
  });

  it('adds a random tile when initialized', () => {
    render(<Board />);
    const tileElements = screen.getAllByTestId('tile');
    const nonEmptyTiles = tileElements.filter(
      (tile) => tile.textContent?.charCodeAt(0) !== 160
    );
    expect(nonEmptyTiles.length).toBe(2);
  });
});
