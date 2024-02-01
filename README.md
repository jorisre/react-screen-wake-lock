<div align="center"><h1>🌗 react-screen-wake-lock</h1></div>
<p align="center">
Tiniest React implementation of the Screen Wake Lock API.<br/>
It provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.
</p><br />
<br />
<p align="center">
<a href="https://react-screen-wake-lock.joris.re/">Demo</a> 
<span> · </span>
  <a href="https://github.com/jorisre/react-screen-wake-lock#installation">Documentation</a> 
<span> · </span>
<a href="https://twitter.com/_jorisre">Twitter</a>
  <sub>Created by <a href="https://joris.re">Joris</a></sub>
</p>

## Features

- 🌐 Follows the **[W3C Screen Wake Lock API specifications](https://w3c.github.io/screen-wake-lock/)**
- 🪝 **Easy to use** - Just one react hook `useWakeLock`
- 🪶 **Lightweight & Zero Dependencies** - _Less than [650 bytes](https://bundlephobia.com/result?p=react-screen-wake-lock)_
- 🔌 **Easy integration** - _Works without additional configuration (React, Remix, Next.js, etc.)_
- 🧪 **Ready for testing** - Mocks the Screen Wake Lock with Jest, Vitest and Bun
- ⚠️ **Browser Support** - Check [Screen Wake Lock API browser support](https://caniuse.com/wake-lock)

<details>
    <summary> <code>react-screen-wake-lock</code> uses the native Screen Wake Lock API under the hood, which is not supported by all browsers.</summary>
    <a href="https://caniuse.com/wake-lock">
        <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/wake-lock.webp" width="600px">
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/wake-lock.png" width="600px">
        <img src="https://caniuse.bitsofco.de/image/wake-lock.jpg" alt="Data on support for the wake-lock feature across major browsers from caniuse.com" width="600px">
      </picture>
    </a>
</details>

### Examples ([Demo](https://react-screen-wake-lock.joris.re))

- [Basic Usage](https://github.com/jorisre/react-screen-wake-lock#usage)
- [Demo Example](https://github.com/jorisre/react-screen-wake-lock/blob/main/example/src/App.tsx)

## Installation

```sh
# Yarn
npm install react-screen-wake-lock
# NPM
yarn add react-screen-wake-lock
# Bun
bun add react-screen-wake-lock
```

## Usage

```tsx
import { useWakeLock } from "react-screen-wake-lock";

export default function Component() {
  const wakeLock = useWakeLock({
    onRequest: () => alert("Screen Wake Lock: requested!"),
    onError: () => alert("An error occurred 💥"),
    onRelease: () => alert("Screen Wake Lock: released!"),
  });

  return (
    <div>
      <p>
        Screen Wake Lock API supported: <b>{`${wakeLock.supported}`}</b>
        <br />
        Released: <b>{`${wakeLock.released}`}</b>
      </p>
      <button
        type="button"
        onClick={() =>
          wakeLock.released === false ? wakeLock.release() : wakeLock.request()
        }
      >
        {wakeLock.released === false ? "Release" : "Request"}
      </button>
    </div>
  );
}
```

## Props

| Prop                     | Description                                                                   | Default     | Required |
| ------------------------ | ----------------------------------------------------------------------------- | ----------- | -------- |
| `onRequest`              | Called on successful `navigator.wakeLock.request`                             | `undefined` | No       |
| `onError`                | Called when an error is caught from `navigator.wakeLock.request`              | `undefined` | No       |
| `onRelease`              | Called when the wake lock is released                                         | `undefined` | No       |
| `reacquireOnPageVisible` | Determines if the WakeLock should be reacquired when the page becomes visible | `false`     | No       |

### Returns

| Prop        | Description                                                                                | Type     |
| ----------- | ------------------------------------------------------------------------------------------ | -------- |
| `supported` | Browser support for the Screen Wake Lock API                                               | boolean  |
| `released`  | Once the WakeLock is released, `released` becomes `true` and the value never changes again | boolean  |
| `request`   | Returns a promise that allows control over screen dimming and locking                      | function |
| `release`   | Returns a promise that is resolved once the sentinel has been successfully released        | function |

## Testing

### Jest

To test your React components that use `react-screen-wake-lock`, you need to add `react-screen-wake-lock/jest` to your Jest configuration.

Add the following setup in your `jest.config.js` file:

````json
{
  "setupFiles": ["react-screen-wake-lock/jest"]
}


### Vitest

To configure Vitest for testing with react-screen-wake-lock, add react-screen-wake-lock/vitest to your configuration:

```json
{
  "test": {
    "setupFiles": ["react-screen-wake-lock/vitest"]
  }
}

Make sure to adjust these configurations according to your project's setup.
These setup files will ensure that react-screen-wake-lock is properly mocked during testing.

## Author

**🌈 [Joris](https://github.com/jorisre)** · [@\_jorisre](https://twitter.com/_jorisre)
````
