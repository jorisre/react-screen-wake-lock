import React from 'react';

interface Props {
  disabled?: boolean;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

function Switch({ disabled, checked, onChange }: Props) {
  return (
    <label
      className="switch"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle Screen Wake Lock"
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
    </label>
  );
}

export default Switch;
