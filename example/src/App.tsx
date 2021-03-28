import React, { useState } from 'react';
import { useWakeLock } from 'react-screen-wake-lock';
import Switch from './components/Switch';
import Supported from './components/Supported';
import NotSupported from './components/NotSupported';

interface Log {
  type: 'info' | 'request' | 'release' | 'error';
  message: string;
}

const addLog = (log: Log, logs: Log[]) => [log, ...logs];

const App = () => {
  const [checked, setChecked] = useState(false);
  const [logs, setLogs] = useState<Log[]>([
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

  function handleChange(value: boolean) {
    setChecked(value);
    if (value) request();
    else release();
  }

  return (
    <main>
      <h1>react-screen-wake-lock</h1>
      <Switch
        disabled={!isSupported}
        checked={checked}
        onChange={handleChange}
      />
      <div>
        {isSupported ? <Supported /> : <NotSupported />}
        <ul>
          {logs.map((log, i) => (
            <li key={`${log.type}-${i}`}>
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

export default App;
