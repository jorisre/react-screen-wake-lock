import * as React from 'react';

const Supported = () => (
  <span className="support">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--highlight-green)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-check"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    &nbsp; Screen Wake Lock API supported
  </span>
);

export default Supported;
