import { cleanup } from '@testing-library/react-native';
import { notifyManager } from '@tanstack/react-query';

/**
 * React Query agrupa sus notificaciones con `setTimeout(0)`. Ese macrotask se
 * dispara fuera del `act` del test (aviso "not wrapped in act"). Se sustituye
 * el scheduler por `queueMicrotask`: las notificaciones se resuelven en el
 * checkpoint de microtareas —dentro del `await act(...)` de cada test— y no
 * dejan timers colgados.
 *
 * Nota: no se usa un scheduler síncrono (`cb => cb()`) porque reentra en
 * `notifyManager.flush` y puede recursar hasta colgar.
 * https://tanstack.com/query/latest/docs/framework/react/guides/testing
 */
notifyManager.setScheduler((callback) => queueMicrotask(callback));

/**
 * En RTL v14 `cleanup` es asíncrono: desmonta el árbol y libera el `screen`
 * entre tests. Se declara explícito (además del auto-cleanup de RTL) para que
 * el desmontaje ocurra antes de que `clearMocks`/`restoreMocks` de Jest
 * desactiven los mocks que algún efecto de limpieza pueda necesitar.
 */
afterEach(async () => {
  await cleanup();
});
