import React, { useState, useEffect, useRef } from 'react';

function Timer({ initialValue, onTick, visible = true }) {
  const [timeRemaining, setTimeRemaining] = useState(initialValue);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    // Always keep the timer running, regardless of visibility
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newValue = prev - 1;
        onTick?.(newValue);
        return newValue;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, onTick]);

  const format = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  // Only hide the display, but keep timer running
  return visible ? <h2>{format(timeRemaining)}</h2> : null;
}

export default Timer;
