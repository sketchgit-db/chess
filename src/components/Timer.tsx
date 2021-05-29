import React, { useEffect } from "react";

export interface TimerProps {
  timePeriod: number;
  setTimePeriod: any;
  paused: boolean;
}

const Timer: React.FC<TimerProps> = (props) => {
  const { timePeriod, setTimePeriod, paused } = props;

  useEffect(() => {
    let timeInterval = setInterval(() => {
      if (paused) {
        return;
      } else if (timePeriod > 0) {
        setTimePeriod(timePeriod - 1);
      } else {
        clearInterval(timeInterval);
      }
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  });

  return (
    <div className="timer">
      {timePeriod
        ? `Time left: ${Math.floor(timePeriod / 60)}:${
            timePeriod % 60 < 10 ? `0${timePeriod % 60}` : timePeriod % 60
          }`
        : `Time Up!`}
    </div>
  );
};

export default Timer;
