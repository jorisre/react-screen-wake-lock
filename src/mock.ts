const RELEASE_EVENT_NAME = "release";
type ReleaseEventName = typeof RELEASE_EVENT_NAME;

/**
 * Create a `navigator.wakeLock.request`
 * @class
 * @classdesc Aims to reproduce Screen Wake Lock API in Jest environment
 * @link https://w3c.github.io/screen-wake-lock/
 */
class WakeLockSentinelImpl extends EventTarget implements WakeLockSentinel {
	#released: boolean;
	#type: WakeLockType;
	#onrelease: EventListener | undefined;
	#wakeLockEventTarget: EventTarget;

	constructor(type: WakeLockType) {
		super();

		this.#released = false;
		this.#type = type;
		this.#onrelease = undefined;
		this.#wakeLockEventTarget = new EventTarget();

		document.addEventListener("visibilitychange", () => {
			if (document.hidden) this.release();
		});
	}

	addEventListener(
		eventName: ReleaseEventName,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions,
	) {
		this.#wakeLockEventTarget.addEventListener(eventName, listener, options);
	}

	removeEventListener(
		eventName: ReleaseEventName,
		callback: EventListenerOrEventListenerObject | null,
		options?: EventListenerOptions | boolean,
	) {
		this.#wakeLockEventTarget.removeEventListener(eventName, callback, options);
	}

	async release() {
		this.#released = true;
		this.#wakeLockEventTarget.dispatchEvent(new Event(RELEASE_EVENT_NAME));

		return void 0;
	}

	set onrelease(listener: EventListener) {
		if (this.#onrelease) this.removeEventListener("release", this.#onrelease);
		this.addEventListener("release", listener);
		this.#onrelease = listener;
	}

	get released() {
		return this.#released;
	}

	get type() {
		return this.#type;
	}
}

export async function WakeLockSentinel(type: WakeLockType) {
	return new Promise<WakeLockSentinel>((resolve) => {
		resolve(new WakeLockSentinelImpl(type));
	});
}
