import { renderHook, act } from '@testing-library/react';
import { useWakeLock } from '../src';

const noop = () => {};

test("useWakeLock returns `isSupported: false` if Screen Wake Lock API isn't supported", async () => {
  const { wakeLock, ...navigator } = window.navigator;
  //@ts-expect-error
  jest.spyOn(window, 'navigator', 'get').mockReturnValue(navigator);

  const { result } = renderHook(() => useWakeLock());

  expect(result.current.isSupported).toBe(false);
});

test('in development|test mode there are warnings displayed if `request` or `release` are called when `isSupported: false`', async () => {
  const { wakeLock, ...navigator } = window.navigator;
  //@ts-expect-error
  jest.spyOn(window, 'navigator', 'get').mockReturnValue(navigator);
  const spyedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(noop);

  const { result } = renderHook(() => useWakeLock());

  expect(result.current.isSupported).toBe(false);
  expect(result.current.released).not.toBeDefined();
  expect(result.current.type).not.toBeDefined();

  await act(async () => {
    await result.current.request();
  });

  expect(result.current.released).not.toBeDefined();
  expect(result.current.type).not.toBeDefined();
  expect(spyedConsoleWarn).toHaveBeenCalledWith(
    "[react-screen-wake-lock]: Calling the `request` function has no effect, Wake Lock Screen API isn't supported",
  );

  await act(async () => {
    await result.current.release();
  });

  expect(result.current.released).not.toBeDefined();
  expect(result.current.type).not.toBeDefined();
  expect(spyedConsoleWarn).toHaveBeenCalledWith(
    "[react-screen-wake-lock]: Calling the `release` function has no effect, Wake Lock Screen API isn't supported",
  );
});

test('useWakeLock handles request then release with success', async () => {
  const { result } = renderHook(() => useWakeLock());

  expect(result.current.isSupported).toBe(true);
  expect(result.current.type).not.toBeDefined();
  expect(result.current.released).not.toBeDefined();

  // Handle wakeLock request
  await act(async () => {
    await result.current.request();
  });

  expect(window.navigator.wakeLock.request).toHaveBeenCalledTimes(1);
  expect(window.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
  expect(result.current.type).toEqual('screen');
  expect(result.current.released).toBe(false);

  // Handle wakeLock release
  await act(async () => {
    await result.current.release();
  });

  expect(result.current.released).toBe(true);
});

test('useWakeLock handles request and throw an error', async () => {
  const requestError = new Error('An error occured during `navigator.wakeLock.request` 💥');
  const handleError = jest.fn();
  jest.spyOn(window.navigator.wakeLock, 'request').mockRejectedValueOnce(requestError);

  const { result } = renderHook(
    (props) => useWakeLock(props),
    {
      initialProps: { onError: handleError },
    },
  );

  // Handle wakeLock request
  await act(async () => {
    await result.current.request();
  });

  expect(handleError).toHaveBeenCalledWith(requestError);
  expect(window.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
  expect(result.current.isSupported).toBe(true);
  expect(result.current.type).not.toBeDefined();
  expect(result.current.released).not.toBeDefined();
});

test('in development|test mode, a warning is displayed when calling `release` before `request`', async () => {
  const spyedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(noop);

  const { result } = renderHook(() => useWakeLock());

  await act(async () => {
    await result.current.release();
  });

  expect(spyedConsoleWarn).toHaveBeenCalledWith(
    '[react-screen-wake-lock]: Calling `release` before `request` has no effect.',
  );
});

test('once WakeLock released and in development|test mode, a warning is displayed when calling `release` before `request`', async () => {
  const spyedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(noop);
  const { result } = renderHook(() => useWakeLock());

  await act(async () => {
    await result.current.request();
    await result.current.release();
    await result.current.release();
  });

  expect(spyedConsoleWarn).toHaveBeenCalledWith(
    '[react-screen-wake-lock]: Calling `release` before `request` has no effect.',
  );
});

test('useWakeLock should call `onRequest` when request done with success', async () => {
  const handleRequest = jest.fn();
  const { result } = renderHook(
    (props) => useWakeLock(props),
    {
      initialProps: { onRequest: handleRequest },
    },
  );

  await act(async () => void (await result.current.request()));

  expect(handleRequest).toHaveBeenCalled();
});

test('in development|test show a warning if `request` is called more than once without `release`', async () => {
  const spyedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(noop);
  const { result } = renderHook(() => useWakeLock());

  await act(async () => {
    await result.current.request();
    await result.current.request();
  });

  expect(spyedConsoleWarn).toHaveBeenCalledWith(
    '[react-screen-wake-lock]: Calling `request` multiple times without `release` has no effect',
  );
  expect(window.navigator.wakeLock.request).toHaveBeenCalledTimes(1);
});

test('useWakeLock should call `onRelease` when wakeLockSentinel is released', async () => {
  const handleRelease = jest.fn();
  const { result } = renderHook(
    (props) => useWakeLock(props),
    {
      initialProps: { onRelease: handleRelease },
    },
  );

  expect(handleRelease).not.toHaveBeenCalled();

  await act(async () => {
    await result.current.request();
    await result.current.release();
  });

  expect(handleRelease).toHaveBeenCalledWith(expect.any(Event));
});

test('after releasing, useWakeLock reacquires wake lock on page visibility change when `reacquireOnPageVisible` is true', async () => {
  const handleError = jest.fn();
  const { result } = renderHook(() => useWakeLock({ reacquireOnPageVisible: true, onError: handleError }));

  await act(async () => {
    await result.current.request();
  });

  expect(window.navigator.wakeLock.request).toHaveBeenCalledTimes(1);
  expect(result.current.type).toEqual('screen');
  expect(result.current.released).toBe(false);

  await act(async () => {
    await result.current.release();
  });

  expect(result.current.released).toBe(true);

  // Mock document.visibilityState to 'hidden'
  Object.defineProperty(document, 'visibilityState', {
    value: 'hidden',
    configurable: true,
  });
  document.dispatchEvent(new Event('visibilitychange'));

  // Mock document.visibilityState to 'visible'
  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    configurable: true,
  });
  await act(async () => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(window.navigator.wakeLock.request).toHaveBeenCalledTimes(2);
  expect(result.current.type).toEqual('screen');
  expect(result.current.released).toBe(false);
  expect(handleError).not.toHaveBeenCalled();
});