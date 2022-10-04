<div align="center"><h1>🌗 react-screen-wake-lock</h1></div>
<p align="center">
Tiniest React implementation of the Screen Wake Lock API. <br/>It provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.
</p>

<br />
<p align="center">
<a href="https://react-screen-wake-lock.vercel.app/">Demo</a> 
<span> · </span>
  <a href="https://github.com/jorisre/react-screen-wake-lock#installation">Documentation</a> 
<span> · </span>
<a href="https://twitter.com/_jorisre">Twitter</a>
  <sub>Created by <a href="https://joris.re">Joris</a></sub>
</p>

## Features

- 🌐 Follows the **[W3C Screen Wake Lock API specifications](https://w3c.github.io/screen-wake-lock/)**
- 🪝 **Easy to use** - Just one react hook `useWakeLock`
- 🪶 **Lightweight & 0 Dependency** - _Less than **[650b](https://bundlephobia.com/result?p=react-screen-wake-lock)**_
- 🔌 **Easily integration** - _It works without additional configuration (React, remix, Next.js...)_
- 🧪 **Ready to test** - Mocks the Screen Wake Lock with [Jest](https://github.com/jorisre/jest-wake-lock-mock#readme)
- ⚠️ **Browser Support** - [Screen Wake Lock API](https://caniuse.com/wake-lock)

<details>
    <summary> <code>react-screen-wake-lock</code> use native Screen Wake Lock API under the hood which is not supported by all browsers.</summary>
    <a href="https://caniuse.com/wake-lock">
      <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/wake-lock.webp" width="600px">
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/wake-lock.png" width="600px">
        <img src="https://caniuse.bitsofco.de/image/wake-lock.jpg" alt="Data on support for the wake-lock feature across the major browsers from caniuse.com" width="600px">
      </picture>
    </a>
</details>

### Examples (<a href="https://react-screen-wake-lock.joris.re">Demo</a>)

- [Basic](https://github.com/jorisre/react-screen-wake-lock#usage)
- [Demo example](https://github.com/jorisre/react-screen-wake-lock/blob/main/example/src/App.tsx)

## Installation

```sh
yarn add react-screen-wake-lock
```

or

```sh
npm i react-screen-wake-lock
```

## Usage

```tsx
import { useWakeLock } from 'react-screen-wake-lock';

function Component() {
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => alert('Screen Wake Lock: requested!'),
    onError: () => alert('An error happened 💥'),
    onRelease: () => alert('Screen Wake Lock: released!'),
  });

  return (
    <div>
      <p>
        Screen Wake Lock API supported: <b>{`${isSupported}`}</b>
        <br />
        Released: <b>{`${released}`}</b>
      </p>
      <button
        type="button"
        onClick={() => (released === false ? release() : request())}
      >
        {released === false ? 'Release' : 'Request'}
      </button>
    </div>
  );
}

export default Component;
```

## Props

|    Prop     |                          description                          |   default   | required |
| :---------: | :-----------------------------------------------------------: | :---------: | :------: |
| `onRequest` |      called on successfully `navigator.wakeLock.request`      | `undefined` |  false   |
|  `onError`  | called when caught an error from `navigator.wakeLock.request` | `undefined` |  false   |
| `onRelease` |               called when wake lock is released               | `undefined` |  false   |

### Returns

|     Prop      |                                      description                                      |   type   |           |
| :-----------: | :-----------------------------------------------------------------------------------: | :------: | --------- |
| `isSupported` |                     Browser support for the Screen Wake Lock API                      | boolean  |
|  `released`   | Once WakeLock is released, `released` become `true` and the value never changes again | boolean  | undefined |
|   `request`   |        Returns a promise which allows control over screen dimming and locking         | function |
|   `release`   |  Returns a promise that is resolved once the sentinel has been successfully released  | function |

## Testing

To write tests with ease, follow this [guide](https://github.com/jorisre/jest-wake-lock-mock#readme)

## Author

**🌈 [Joris](https://github.com/jorisre)** · [@\_jorisre](https://twitter.com/_jorisre)
