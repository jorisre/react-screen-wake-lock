import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useWakeLock } from '../.';

const App = () => {
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
};

ReactDOM.render(<App />, document.getElementById('root'));
