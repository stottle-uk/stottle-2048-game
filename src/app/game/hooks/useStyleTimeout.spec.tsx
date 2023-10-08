import { render } from '@testing-library/react';
import React from 'react';
import { useStyleTimeout } from './useStyleTimeout';

const styleName = 'test-style';

describe('useStyleTimeout', () => {
  let TestComponent: React.FC<{ value: number }>;

  beforeEach(() => {
    TestComponent = ({ value }) => {
      const { elRef } = useStyleTimeout<HTMLDivElement>(styleName, value, 100);
      return <div ref={elRef}>Test Element</div>;
    };
  });

  beforeAll(() => {
    vitest.useFakeTimers();
  });

  afterAll(() => {
    vitest.useRealTimers();
  });

  it('should add and remove the specified style class when value is greater than 0', () => {
    const { container, rerender } = render(<TestComponent value={1} />);
    const testElement = container.querySelector('div');

    expect(testElement?.classList.contains(styleName)).toBe(true);

    vitest.advanceTimersByTime(100);

    rerender(<TestComponent value={0} />);

    expect(testElement?.classList.contains(styleName)).toBe(false);
  });

  it('should not add the style class when value is 0', () => {
    const { container } = render(<TestComponent value={0} />);
    const testElement = container.querySelector('div');

    expect(testElement?.classList.contains(styleName)).toBe(false);
  });
});
