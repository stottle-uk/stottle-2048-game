import { render, screen } from '@testing-library/react';
import { Mock } from 'vitest';
import { useStyleTimeout } from '../hooks/useStyleTimeout';
import Tile from './Tile';

// Mock the useStyleTimeout hook
vitest.mock('../hooks/useStyleTimeout', () => ({
  useStyleTimeout: vitest.fn().mockReturnValue({ elRef: { current: null } }),
}));

describe('Score', () => {
  beforeEach(() => {
    (useStyleTimeout as Mock).mockReturnValue({ elRef: { current: null } });
  });

  it('should render the score component with label and value', () => {
    const value = 42;

    render(<Tile value={value} />);

    const valueElement = screen.queryByText(value.toString());

    expect(valueElement?.innerHTML).not.toBeNull();
  });
});
