<h1 align="center">Welcome to react-screen-wake-lock 👋</h1>
<p>
  <img alt="npm" src="https://img.shields.io/npm/v/react-screen-wake-lock?style=for-the-badge">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/jorisre/react-screen-wake-lock/CI?style=for-the-badge">
  <img alt="Codecov" src="https://img.shields.io/codecov/c/github/jorisre/react-screen-wake-lock?style=for-the-badge">
  <a href="https://github.com/jorisre/react-screen-wake-lock/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/jorisre/react-screen-wake-lock?style=for-the-badge" />
  </a>
  <a href="https://twitter.com/_jorisre" target="_blank">
    <img alt="Twitter: _jorisre" src="https://img.shields.io/twitter/follow/_jorisre.svg?style=for-the-badge" />
  </a>
</p>

> React implementation of the [Screen Wake Lock API](https://w3c.github.io/screen-wake-lock/). It provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

### 🏠 [Homepage](https://github.com/jorisre/react-screen-wake-lock#readme)

### ✨ [Demo](https://react-screen-wake-lock.vercel.app/)

## Browser support [Screen Wake Lock API](https://caniuse.com/wake-lock)

`react-screen-wake-lock` use native Screen Wake Lock API under the hood which is not supported by all browsers.

<a href="https://caniuse.com/wake-lock">
  <img src="https://caniuse.bitsofco.de/image/wake-lock.webp" width="400px"/>
</a>

## Install

```sh
npm i react-screen-wake-lock
# or
yarn add react-screen-wake-lock
```

## Usage

```jsx
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

### Options

|   Option    |                          description                          |   default   | required |
| :---------: | :-----------------------------------------------------------: | :---------: | :------: |
| `onRequest` |      called on successfully `navigator.wakeLock.request`      | `undefined` |  false   |
|  `onError`  | called when caught an error from `navigator.wakeLock.request` | `undefined` |  false   |
| `onRelease` |               called when wake lock is released               | `undefined` |  false   |

### Returns

|     Name      |                                      description                                      |   type   |
| :-----------: | :-----------------------------------------------------------------------------------: | :------: |
| `isSupported` |                     Browser support for the Screen Wake Lock API                      | boolean  |
|  `released`   | Once WakeLock is released, `released` become `true` and the value never changes again | boolean  | undefined |
|   `request`   |        Returns a promise which allows control over screen dimming and locking         | function |
|   `release`   |  Returns a promise that is resolved once the sentinel has been successfully released  | function |

## Testing

To write tests with ease, follow this [guide](https://github.com/jorisre/jest-wake-lock-mock#readme)

## Author

👤 **Joris**

- Twitter: [@\_jorisre](https://twitter.com/_jorisre)
- Github: [@jorisre](https://github.com/jorisre)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/jorisre/react-screen-wake-lock/issues). You can also take a look at the [contributing guide](https://github.com/jorisre/react-screen-wake-lock/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Joris](https://github.com/jorisre).<br />
This project is [MIT](https://github.com/jorisre/react-screen-wake-lock/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
