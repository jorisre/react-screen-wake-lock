import { act, renderHook, waitFor } from "@testing-library/react";
import { useWakeLock } from "./use-wake-lock.js";
import { test, expect, vi } from "vitest";

const noop = () => {};

test("useWakeLock returns `supported: false` if Screen Wake Lock API isn't supported", async () => {
	const { wakeLock, ...navigator } = window.navigator;
	//@ts-expect-error
	vi.spyOn(window, "navigator", "get").mockReturnValue(navigator);

	const { result } = renderHook(() => useWakeLock());

	expect(result.current.supported).toBe(false);
});

test("in development|test mode there are warnings displayed if `request` or `release` are called when `supported: false`", async () => {
	const { wakeLock, ...navigator } = window.navigator;
	//@ts-expect-error
	vi.spyOn(window, "navigator", "get").mockReturnValue(navigator);
	const addEventListener = vi.spyOn(document, "addEventListener");
	const removeEventListener = vi.spyOn(document, "removeEventListener");
	const spyedConsoleWarn = vi.spyOn(console, "warn").mockImplementation(noop);

	const { result } = renderHook(() => useWakeLock());

	expect(result.current.supported).toBe(false);
	expect(result.current.released).toBeUndefined();
	expect(result.current.type).not.toBeDefined();

	await act(async () => {
		await result.current.request();
	});

	expect(result.current.released).toBeUndefined();
	expect(result.current.type).not.toBeDefined();
	expect(spyedConsoleWarn).toHaveBeenCalledWith(
		"[react-screen-wake-lock]: Calling the `request` function has no effect, Wake Lock Screen API isn't supported",
	);

	await act(async () => {
		await result.current.release();
	});

	expect(result.current.released).toBeUndefined();
	expect(result.current.type).not.toBeDefined();
	expect(spyedConsoleWarn).toHaveBeenCalledWith(
		"[react-screen-wake-lock]: Calling the `release` function has no effect, Wake Lock Screen API isn't supported",
	);

	expect(addEventListener).toHaveBeenCalledTimes(0);
	expect(removeEventListener).toHaveBeenCalledTimes(0);
});

test.only("useWakeLock handles request then release with success", async () => {
	const { result } = renderHook(() => useWakeLock());

	expect(result.current.supported).toBe(true);
	expect(result.current.type).not.toBeDefined();
	expect(result.current.released).toBeUndefined();

	// Handle wakeLock request
	await act(async () => {
		await result.current.request();
	});

	expect(window.navigator.wakeLock.request).toHaveBeenCalledTimes(1);
	expect(window.navigator.wakeLock.request).toHaveBeenCalledWith("screen");
	expect(result.current.type).toEqual("screen");
	expect(result.current.released).toBe(false);

	await act(async () => {
		await result.current.release();
	});

	await waitFor(() => expect(result.current.released).toBeTruthy());
});

test("useWakeLock handles request and throw an error", async () => {
	const requestError = new Error(
		"An error occured during `navigator.wakeLock.request` 💥",
	);
	const handleError = vi.fn();
	vi.spyOn(window.navigator.wakeLock, "request").mockRejectedValueOnce(
		requestError,
	);

	const { result } = renderHook((props) => useWakeLock(props), {
		initialProps: { onError: handleError },
	});

	// Handle wakeLock request
	await act(async () => {
		await result.current.request();
	});

	expect(handleError).toHaveBeenCalledWith(requestError);
	expect(window.navigator.wakeLock.request).toHaveBeenCalledWith("screen");
	expect(result.current.supported).toBe(true);
	expect(result.current.type).not.toBeDefined();
	expect(result.current.released).toBeUndefined();
});

test("in development|test mode, a warning is displayed when calling `release` before `request`", async () => {
	const spyedConsoleWarn = vi.spyOn(console, "warn").mockImplementation(noop);

	const { result } = renderHook(() => useWakeLock());

	await act(async () => {
		await result.current.release();
	});

	expect(spyedConsoleWarn).toHaveBeenCalledWith(
		"[react-screen-wake-lock]: Calling `release` before `request` has no effect.",
	);
});

test("once WakeLock released and in development|test mode, a warning is displayed when calling `release` before `request`", async () => {
	const spyedConsoleWarn = vi.spyOn(console, "warn").mockImplementation(noop);
	const { result } = renderHook(() => useWakeLock());

	await act(async () => {
		await result.current.request();
		await result.current.release();
		await result.current.release();
	});

	expect(spyedConsoleWarn).toHaveBeenCalledWith(
		"[react-screen-wake-lock]: Calling `release` before `request` has no effect.",
	);
});

test("useWakeLock should call `onRequest` when request done with success", async () => {
	const handleRequest = vi.fn();
	const { result } = renderHook((props) => useWakeLock(props), {
		initialProps: { onRequest: handleRequest },
	});

	await act(async () => void (await result.current.request()));

	expect(handleRequest).toHaveBeenCalled();
});

test("useWakeLock should call `onRelease` when wakeLockSentinel is released", async () => {
	const handleRelease = vi.fn();
	const { result } = renderHook((props) => useWakeLock(props), {
		initialProps: { onRelease: handleRelease },
	});

	expect(handleRelease).not.toHaveBeenCalled();

	await act(async () => {
		await result.current.request();
		await result.current.release();
	});

	expect(handleRelease).toHaveBeenCalledWith(expect.any(Event));
});

test("should re-request wake lock on page visibility change", async () => {
	const handleRequest = vi.fn();
	const handleRelease = vi.fn();
	const handleError = vi.fn();
	const { result } = renderHook(() =>
		useWakeLock({
			reacquireOnPageVisible: true,
			onRequest: handleRequest,
			onRelease: handleRelease,
			onError: handleError,
		}),
	);
	expect(result.current.released).toBeUndefined();

	dispatchVisibilityChange({ hidden: false });

	await act(async () => {
		await result.current.request();
	});

	expect(navigator.wakeLock.request).toHaveBeenCalledTimes(1);
	expect(handleRequest).toHaveBeenCalledTimes(1);
	expect(handleRelease).not.toHaveBeenCalled();
	expect(handleError).not.toHaveBeenCalled();
	expect(result.current.released).toBe(false);

	handleRequest.mockClear();
	handleRelease.mockClear();

	// Mock switch to another tab
	// Mock page visibility change => hidden
	dispatchVisibilityChange({ hidden: true });

	expect(result.current.released).toBe(true);
	expect(handleRequest).toHaveBeenCalledTimes(0);
	expect(handleRelease).toHaveBeenCalledTimes(1);
	expect(handleError).not.toHaveBeenCalled();

	handleRequest.mockClear();
	handleRelease.mockClear();

	// Mock page visibility change => visible
	dispatchVisibilityChange({ hidden: false });

	// await waitForValueToChange(() => result.current.released);
	expect(result.current.released).toBe(false);
	expect(handleRequest).toHaveBeenCalledTimes(1);
	expect(handleRelease).toHaveBeenCalledTimes(0);
	expect(handleError).not.toHaveBeenCalled();
});

test("should not request wake lock on page visibility change if wakelock hasn't been requested", async () => {
	const handleRequest = vi.fn();
	const handleRelease = vi.fn();
	const handleError = vi.fn();
	const addEventListener = vi.spyOn(document, "addEventListener");
	const removeEventListener = vi.spyOn(document, "removeEventListener");

	const { result } = renderHook(() =>
		useWakeLock({
			reacquireOnPageVisible: true,
			onRequest: handleRequest,
			onRelease: handleRelease,
			onError: handleError,
		}),
	);
	expect(result.current.released).toBeUndefined();

	dispatchVisibilityChange({ hidden: false });
	addEventListener.mockClear();

	await act(async () => {
		await result.current.request();
	});

	expect(addEventListener).toHaveBeenCalledTimes(2);
	expect(handleRelease).not.toHaveBeenCalled();
	expect(handleError).not.toHaveBeenCalled();
	expect(removeEventListener).toHaveBeenCalledTimes(1);
	expect(addEventListener.mock.calls[0][0]).toBe("visibilitychange");

	addEventListener.mockClear();
	removeEventListener.mockClear();

	await act(async () => {
		await result.current.release();
	});

	expect(addEventListener).toHaveBeenCalledTimes(0);
	expect(removeEventListener).toHaveBeenCalledTimes(1);
});

function dispatchVisibilityChange({ hidden }: { hidden: boolean }) {
	act(() => {
		let _hidden = hidden;
		Object.defineProperty(document, "hidden", {
			configurable: true,
			get() {
				return _hidden;
			},
			set(bool) {
				_hidden = Boolean(bool);
			},
		});

		document.dispatchEvent(new Event("visibilitychange", { bubbles: true }));
	});
}
