import { useState, useEffect } from "react";

/*
  Custom Hook: useTimer

  Parameters:
  - seconds: initial time
  - onTimeUp: function to call when time = 0
  - resetKey: key to trigger timer reset
*/
const useTimer = (seconds, onTimeUp, resetKey) => {
  // Store remaining time
  const [time, setTime] = useState(seconds);


  useEffect(() => {
    setTime(seconds); // reset when question changes
  }, [resetKey]);

  useEffect(() => {
    // If time reaches 0 → call function
    if (time === 0) {
      onTimeUp();
      return;
    }

    // Decrease time every 1 second
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [time]);

  return time;
};

export default useTimer;