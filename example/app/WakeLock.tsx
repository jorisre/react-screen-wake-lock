"use client";

import { useWakeLock } from "react-screen-wake-lock";

export function WakeLock() {
  const wakeLock = useWakeLock();

  return <span>hey</span>;
}
