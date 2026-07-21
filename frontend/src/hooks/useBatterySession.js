import { useState, useCallback } from "react";

export default function useBatterySession() {
  const [sessionStatus, setSessionStatus] = useState("running");
  // running | paused | stopped

  const startSession = useCallback(() => {
    setSessionStatus("running");
  }, []);

  const pauseSession = useCallback(() => {
    setSessionStatus("paused");
  }, []);

  const resumeSession = useCallback(() => {
    setSessionStatus("running");
  }, []);

  const stopSession = useCallback(() => {
    setSessionStatus("stopped");
  }, []);

  return {
    sessionStatus,

    isRunning: sessionStatus === "running",
    isPaused: sessionStatus === "paused",
    isStopped: sessionStatus === "stopped",

    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  };
}