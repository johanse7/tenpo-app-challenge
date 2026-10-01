import { cleanup } from '@testing-library/react-native';
import { notifyManager } from '@tanstack/react-query';

/**
 * React Query batches its notifications with `setTimeout(0)`. That macrotask
 * fires outside the test's `act` ("not wrapped in act" warning). The scheduler
 * is replaced with `queueMicrotask`: notifications resolve at the microtask
 * checkpoint —inside each test's `await act(...)`— and leave no pending timers.
 *
 * Note: a synchronous scheduler (`cb => cb()`) is not used because it re-enters
 * `notifyManager.flush` and can recurse until it hangs.
 * https://tanstack.com/query/latest/docs/framework/react/guides/testing
 */
notifyManager.setScheduler((callback) => queueMicrotask(callback));

/**
 * In RTL v14 `cleanup` is async: it unmounts the tree and releases `screen`
 * between tests. Declared explicitly (on top of RTL's auto-cleanup) so the
 * unmount happens before Jest's `clearMocks`/`restoreMocks` disable mocks
 * that a cleanup effect might still need.
 */
afterEach(async () => {
  await cleanup();
});
