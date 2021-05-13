import React from "react";
import { Link } from "react-router-dom";

const Game = (props) => {

  const {gameCode} = props.match.params;

  return (
    <div>
      Welcome to Room {gameCode}
    </div>
  );
};

export default Game;
