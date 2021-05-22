import React from "react";
import Board from "./Board";
import { Alert } from "react-bootstrap";

import "../styles.css";

const Game = (props) => {
  const { gameCode } = props.match.params;

  return (
    <div className="game">
      <div className="panel">
        <Board />
      </div>
      <div className="panel">
        <Alert variant="success">
          <Alert.Heading>Welcome to the game</Alert.Heading>
        </Alert>
      </div>
    </div>
  );
};

export default Game;
