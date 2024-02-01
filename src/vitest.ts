import { WakeLockSentinel } from "./mock.js";
import { vi } from "vitest";

Object.defineProperty(global.window.navigator, "wakeLock", {
	value: {
		request: vi.fn((type: WakeLockType) => WakeLockSentinel(type)),
	},
});
