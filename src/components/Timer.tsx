// This component is currently not used in the game

import React, { useEffect } from "react";

export interface TimerProps {
  timePeriod: number; /** The period of the timer */
  setTimePeriod: React.Dispatch<React.SetStateAction<number>>; /** Callback to update the above state */
  paused: boolean; /** State representing if the timer is paused */
}

/**
 * Displays the time left for each player
 * @param {TimerProps} props Props passed by the `Game` component
 * @returns {React.ReactElement} The Timer React element
 */

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
