import { render, screen } from '@testing-library/react';
import { Mock } from 'vitest';
import { useStyleTimeout } from '../hooks/useStyleTimeout';
import Score from './Score'; // Adjust the import path as needed

// Mock the useStyleTimeout hook
vitest.mock('../hooks/useStyleTimeout', () => ({
  useStyleTimeout: vitest.fn().mockReturnValue({ elRef: { current: null } }),
}));

describe('Score', () => {
  beforeEach(() => {
    (useStyleTimeout as Mock).mockReturnValue({ elRef: { current: null } });
  });

  it('should render the score component with label and value', () => {
    const score = 42;
    const label = 'Score Label';

    render(<Score score={score} label={label} />);

    const labelElement = screen.queryByText(label);
    const valueElement = screen.queryByText(score.toString());

    expect(labelElement?.innerHTML).not.toBeNull();
    expect(valueElement?.innerHTML).not.toBeNull();
  });
});
