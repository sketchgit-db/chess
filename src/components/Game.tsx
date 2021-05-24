import React from "react";
import Board from "./Board";
import { Alert } from "react-bootstrap";
import { RouteComponentProps } from "react-router";

interface RouteParams {
  gameCode: string;
}

import "../styles.css";

const Game: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const { gameCode } = props.match.params;

  return (
    <div className="game">
      <div className="panel">
        <Board />
      </div>
      <div className="panel">
        <Alert variant="success" style={{ userSelect: "none" }}>
          <Alert.Heading>Welcome to the game </Alert.Heading>
        </Alert>
      </div>
    </div>
  );
};

export default Game;
