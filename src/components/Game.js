import React from "react";
import Board from "./Board";
import { Alert } from "react-bootstrap";

import "../styles.css";

const Game = (props) => {
  const { gameCode } = props.match.params;
  const [show, setShow] = React.useState(true);

  return (
    <div className="game">
      <Alert 
        variant="success" 
        dismissible 
        show={show}
        onClose={() => setShow(false)}>
        Welcome to the game
      </Alert>
      <Board/>
    </div>
  );
};

export default Game;
