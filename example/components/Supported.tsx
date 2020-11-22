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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-check"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    &nbsp; Screen Wake Lock API supported
  </span>
);

export default Supported;
