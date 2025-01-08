

import React, { useState, useEffect } from 'react';

function Timer() {

  const [countdownStarted, setCountdownStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60*60);

  const handleStartCountdown = () => {
    setCountdownStarted(true);
  }

  useEffect(() => {
    if (timeRemaining <= 0) return;


    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeRemaining]); 

  const format = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60);

    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;


  }


  return (
    <div className="main">

    <h2>{format(timeRemaining)}</h2>
   
    </div>
  );
}

export default Timer;
