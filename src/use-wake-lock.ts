import * as React from "react";

function warn(content: string) {
	console.warn(`[react-screen-wake-lock]: ${content}`);
}

export interface WakeLockOptions {
	onError?: (error: unknown) => void;
	onRequest?: () => void;
	onRelease?: EventListener;
	reacquireOnPageVisible?: boolean;
}

/**
 * Custom hook that provides functionality for requesting and releasing a wake lock using the Wake Lock Screen API.
 *
 * @param options - Optional configuration options for the wake lock.
 * @param options.onError - Callback function to handle errors that occur during the wake lock process.
 * @param options.onRequest - Callback function to be called when the wake lock is requested.
 * @param options.onRelease - Event listener to be called when the wake lock is released.
 * @param options.reacquireOnPageVisible - Boolean indicating whether to reacquire the wake lock when the page becomes visible again.
 * @returns {Object} An object containing the following properties:
 *   - isSupported: {boolean} Boolean indicating whether the Wake Lock Screen API is supported.
 *   - request: {function} Function to request a wake lock.
 *   - released: {boolean} Boolean indicating whether the wake lock has been released.
 *   - release: {function} Function to release the wake lock.
 *   - type: {string | undefined} The type of wake lock currently active, or undefined if no wake lock is active.
 */
export function useWakeLock({
	onError,
	onRequest,
	onRelease,
	reacquireOnPageVisible,
}: WakeLockOptions | undefined = {}) {
	const [wakeLockSentinel, setWakeLockSentinel] = React.useState<
		WakeLockSentinel | undefined
	>(undefined);
	const released = wakeLockSentinel?.released;

	// https://caniuse.com/mdn-api_wakelock
	const supported = typeof window !== "undefined" && "wakeLock" in navigator;

	const request = React.useCallback(
		async (type: WakeLockType = "screen") => {
			if (!supported) {
				return warn(
					"Calling the `request` function has no effect, Wake Lock Screen API isn't supported",
				);
			}

			try {
				const sentinel = await navigator.wakeLock.request(type);

				sentinel.onrelease = (e: Event) => {
					// Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
					setWakeLockSentinel(sentinel); // Set the updated sentinel
					onRelease?.(e);
				};

				setWakeLockSentinel(sentinel);

				onRequest?.();
			} catch (error) {
				onError?.(error);
			}
		},
		[supported, onError, onRequest, onRelease],
	);

	const handleVisibilityChange = React.useCallback(async () => {
		if (wakeLockSentinel?.released && !document.hidden) {
			await request(wakeLockSentinel.type); // Re-request the wake lock if it has been released and the page is visible again
		}
	}, [wakeLockSentinel, request]);

	const release = React.useCallback(async () => {
		if (!supported) {
			return warn(
				"Calling the `release` function has no effect, Wake Lock Screen API isn't supported",
			);
		}

		if (wakeLockSentinel == null || released) {
			return warn("Calling `release` before `request` has no effect.");
		}

		await wakeLockSentinel.release();
		document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [supported, wakeLockSentinel, released, handleVisibilityChange]);

	React.useEffect(() => {
		if (reacquireOnPageVisible) {
			document.addEventListener("visibilitychange", handleVisibilityChange);
		}

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [reacquireOnPageVisible, handleVisibilityChange]);

	return {
		supported,
		request,
		released,
		release,
		type: wakeLockSentinel?.type || undefined,
	};
}
