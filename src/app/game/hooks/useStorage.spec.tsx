import { act, render } from '@testing-library/react';
import { useStorage } from './useStorage';

describe('useStorage', () => {
  let TestComponent: React.FC;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    TestComponent = () => {
      const [value, setValue] = useStorage('jsonKey');
      return (
        <div>
          <div data-testid="value">{JSON.stringify(value)}</div>
          <button onClick={() => setValue({ foo: 'bar' })}>Update</button>
        </div>
      );
    };
  });

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    window.localStorage = {
      getItem: vitest.fn(),
      setItem: vitest.fn(),
      removeItem: vitest.fn(),
      length: 0,
      clear: vitest.fn(),
      key: vitest.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    window.localStorage = originalLocalStorage;
  });

  it('should handle JSON-parsable values', () => {
    const { getByTestId, getByText } = render(<TestComponent />);

    act(() => {
      getByText('Update').click();
    });

    expect(getByTestId('value').textContent).toBe('{"foo":"bar"}');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'jsonKey',
      JSON.stringify({ foo: 'bar' })
    );
  });
});
