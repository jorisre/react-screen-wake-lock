import { WakeLockSentinel } from "./mock.js";
import { jest } from "@jest/globals";

Object.defineProperty(global.window.navigator, "wakeLock", {
	value: {
		request: jest.fn((type: WakeLockType) => WakeLockSentinel(type)),
	},
});
