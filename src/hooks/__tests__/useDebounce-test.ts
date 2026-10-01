import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from '@/hooks/useDebounce';

const DELAY_MS = 300;

async function advance(ms: number) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('devuelve el valor inicial sin esperar el delay', async () => {
    const { result } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 'inicial' } },
    );

    expect(result.current).toBe('inicial');
  });

  it('no actualiza antes del delay y actualiza al cumplirse', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 'a' } },
    );

    await rerender({ value: 'b' });
    expect(result.current).toBe('a');

    await advance(DELAY_MS - 1);
    expect(result.current).toBe('a');

    await advance(1);
    expect(result.current).toBe('b');
  });

  it('reinicia el temporizador si el valor cambia antes del debounce', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 'a' } },
    );

    await rerender({ value: 'b' });
    await advance(200);

    await rerender({ value: 'c' });
    await advance(200);
    // 200ms tras el último cambio aún no cumplen los 300ms
    expect(result.current).toBe('a');

    await advance(100);
    expect(result.current).toBe('c');
  });

  it('propaga el último valor tras cambios sucesivos', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: number }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 1 } },
    );

    await rerender({ value: 2 });
    await rerender({ value: 3 });
    await rerender({ value: 4 });
    await advance(DELAY_MS);

    expect(result.current).toBe(4);
  });

  it('no propaga nada si el valor vuelve al anterior antes del delay', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 'a' } },
    );

    await rerender({ value: 'b' });
    await advance(100);
    await rerender({ value: 'a' });
    await advance(DELAY_MS);

    expect(result.current).toBe('a');
  });

  it('refleja un delayMs dinámico si cambia', async () => {
    const { result, rerender } = await renderHook(
      ({ value, delayMs }: { value: string; delayMs: number }) =>
        useDebounce(value, delayMs),
      { initialProps: { value: 'a', delayMs: DELAY_MS } },
    );

    await rerender({ value: 'b', delayMs: 1000 });
    await advance(DELAY_MS);
    expect(result.current).toBe('a');

    await advance(1000 - DELAY_MS);
    expect(result.current).toBe('b');
  });

  it('limpia el timeout al desmontar', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { rerender, unmount } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, DELAY_MS),
      { initialProps: { value: 'a' } },
    );

    await rerender({ value: 'b' });
    await unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Avanzar tras el desmontaje no debe provocar actualizaciones de estado
    await advance(DELAY_MS * 2);
  });
});
