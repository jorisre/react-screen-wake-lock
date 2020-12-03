import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Switch from 'react-switch';
import { useWakeLock } from '../.';
import Lock from './components/Lock';
import Supported from './components/Supported';
import './style.css';
import NotSupported from './components/NotSupported';

interface Log {
  type: 'info' | 'request' | 'release' | 'error';
  message: string;
}

const addLog = (log: Log, logs: Log[]) => [log, ...logs];

const App = () => {
  const [checked, setChecked] = React.useState(false);
  const [logs, setLogs] = React.useState<Log[]>([
    { type: 'info', message: 'click to toggle between request and release' },
  ]);
  const { isSupported, request, release } = useWakeLock({
    onRequest: () =>
      setLogs((l) =>
        addLog({ type: 'request', message: 'Wake Lock is active!' }, l)
      ),
    onError: () =>
      setLogs((l) =>
        addLog({ type: 'error', message: 'An error happened' }, l)
      ),
    onRelease: () => {
      setChecked(false);
      setLogs((l) =>
        addLog({ type: 'release', message: 'Wake Lock was released!' }, l)
      );
    },
  });

  const handleChange = (value: boolean) => {
    setChecked(value);
    if (value) request();
    else release();
  };

  return (
    <main>
      <h1>react-screen-wake-lock</h1>
      <Switch
        disabled={!isSupported}
        checked={checked}
        onChange={handleChange}
        handleDiameter={40}
        height={40}
        width={90}
        offColor="#1d3146"
        onColor="#1d3146"
        offHandleColor="#637586"
        onHandleColor="#1eecb3"
        uncheckedIcon={false}
        checkedIcon={<Lock />}
      />
      <div>
        {isSupported ? <Supported /> : <NotSupported />}
        <ul>
          {logs.map((log, i) => (
            <li key={i}>
              <span className={log.type}>{log.type}</span> - {log.message}
            </li>
          ))}
        </ul>
      </div>
      <a href="https://github.com/jorisre/react-screen-wake-lock#readme">
        Documentation
      </a>
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
