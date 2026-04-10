import { useState, useEffect } from "react";

/*
  Custom Hook: useTimer

  Parameters:
  - seconds: initial time
  - onTimeUp: function to call when time = 0
  - resetKey: key to trigger timer reset
*/

const useTimer = (seconds, onTimeUp, resetKey) => {
  const [time, setTime] = useState(seconds);

  // Reset timer when key changes
  useEffect(() => {
    setTime(seconds);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (time === 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onTimeUp]);

  return time;
};

export default useTimer;