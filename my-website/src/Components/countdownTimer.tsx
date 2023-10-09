import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime();
    const timeLeft: Record<string, number> = {};

    if (difference > 0) {
      timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      timeLeft.minutes = Math.floor((difference / (1000 * 60)) % 60);
      timeLeft.seconds = Math.floor((difference / 1000) % 60);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    
    <div className="countdown-timer">
      {timeLeft.days && <span>{timeLeft.days}d </span>}
      {timeLeft.hours && <span>{timeLeft.hours}h </span>}
      {timeLeft.minutes && <span>{timeLeft.minutes}m </span>}
      {timeLeft.seconds && <span>{timeLeft.seconds}s </span>}
      until the next fact!
    </div>
  );
};

export default CountdownTimer;
