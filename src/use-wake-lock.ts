import * as React from 'react';
import warning from 'tiny-warning';

export type WakeLockOptions =
  | {
      onError?: (error: Error) => void;
      onRequest?: () => void;
    }
  | undefined;

export const useWakeLock = ({ onError, onRequest }: WakeLockOptions = {}) => {
  const [released, setReleased] = React.useState<boolean | undefined>();
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);

  // https://caniuse.com/mdn-api_wakelock
  const isSupported = 'wakeLock' in window.navigator;

  const request = React.useCallback(
    async (type: WakeLockType = 'screen') => {
      if (!isSupported) {
        warning(
          !isSupported,
          "Calling the `request` function has no effect, Wake Lock Screen API isn't supported"
        );
        return;
      }

      warning(
        wakeLock.current != null,
        '`request` called multiple times without `release`.'
      );

      try {
        wakeLock.current = await window.navigator.wakeLock.request(type);

        wakeLock.current.addEventListener('release', () => {
          // Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
          setReleased(wakeLock.current?.released ?? true);
          wakeLock.current = null;
        });

        onRequest?.();
        setReleased(wakeLock.current.released ?? false);
      } catch (error) {
        onError?.(error);
      }
    },
    [isSupported, onRequest, onError]
  );

  const release = React.useCallback(async () => {
    if (!isSupported) {
      warning(
        !isSupported,
        "Calling the `release` function has no effect, Wake Lock Screen API isn't supported"
      );
      return;
    }

    if (wakeLock.current == null) {
      warning(
        wakeLock.current == null,
        'Calling `release` before `request` has no effect.'
      );
      return;
    }

    await wakeLock.current?.release();
  }, [isSupported]);

  return {
    isSupported,
    request,
    released,
    release,
    type: wakeLock?.current?.type,
  };
};
