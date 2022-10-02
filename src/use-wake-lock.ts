import * as React from 'react';

const warn = (content: string) =>
  console.warn('[react-screen-wake-lock]: ' + content);

export interface WakeLockOptions {
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onRelease?: EventListener;
}

export const useWakeLock = ({
  onError,
  onRequest,
  onRelease,
}: WakeLockOptions | undefined = {}) => {
  const [released, setReleased] = React.useState<boolean | undefined>();
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);

  // https://caniuse.com/mdn-api_wakelock
  const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;

  const request = React.useCallback(
    async (type: WakeLockType = 'screen') => {
      const isWakeLockAlreadyDefined = wakeLock.current != null;
      if (!isSupported) {
        return warn(
          "Calling the `request` function has no effect, Wake Lock Screen API isn't supported"
        );
      }
      if (isWakeLockAlreadyDefined) {
        return warn(
          'Calling `request` multiple times without `release` has no effect'
        );
      }

      try {
        wakeLock.current = await navigator.wakeLock.request(type);

        wakeLock.current.onrelease = (e: Event) => {
          // Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
          setReleased((wakeLock.current && wakeLock.current.released) || true);
          onRelease && onRelease(e);
          wakeLock.current = null;
        };

        onRequest && onRequest();
        setReleased((wakeLock.current && wakeLock.current.released) || false);
      } catch (error: any) {
        onError && onError(error);
      }
    },
    [isSupported, onRequest, onError, onRelease]
  );

  const release = React.useCallback(async () => {
    const isWakeLockUndefined = wakeLock.current == null;
    if (!isSupported) {
      return warn(
        "Calling the `release` function has no effect, Wake Lock Screen API isn't supported"
      );
    }

    if (isWakeLockUndefined) {
      return warn('Calling `release` before `request` has no effect.');
    }

    wakeLock.current && (await wakeLock.current.release());
  }, [isSupported]);

  return {
    isSupported,
    request,
    released,
    release,
    type: (wakeLock.current && wakeLock.current.type) || undefined,
  };
};
