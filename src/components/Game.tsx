import React from "react";
import Board from "./Board";
import { Alert, Card } from "react-bootstrap";
import { RouteComponentProps } from "react-router";

interface RouteParams {
  gameCode: string /** The gameCode for the current Game */;
}

import "../styles.css";

/**
 * The Game component
 * Renders the Game with all the Board and Game Information like scores, current turn
 * @param {RouteComponentProps<RouteParams>} props The props passed by the `Home` component
 * @returns {React.ReactElement} React component
 */

const Game: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const { gameCode } = props.match.params;
  /**
   * State representing the piece which will play the current turn
   */
  const [currentTurn, setCurrentTurn] = React.useState("white");
  /**
   * State representing the points scored by the player with white pieces
   */
  const [whitePoints, setWhitePoints] = React.useState(0);
  /**
   * State representing the points scored by the player with black pieces
   */
  const [blackPoints, setBlackPoints] = React.useState(0);

  /**
   * State representing the moves in the game so far
   */
  const [moves, setMoves] = React.useState(Array<string>());

  const getMoves = () => {
    let gameMoves = [];
    for (let index = 0; index < moves.length; index += 2) {
      let move: string = "";
      move += (1 + index / 2).toString() + ". ";
      move += moves[index] + " ";
      if (index + 1 < moves.length)
        move += moves[index + 1] + "\n";
      gameMoves.push(<Card.Text className="move">{move}</Card.Text>)
    }
    return gameMoves;
  }

  /**
   * Returns the Game Component
   * @returns {React.ReactElement} The Game component
   */
  return (
    <div className="game">
      {/* The Board */}
      <div className="board-panel">
        <Board
          currentTurn={currentTurn}
          setCurrentTurn={setCurrentTurn}
          whitePoints={whitePoints}
          setWhitePoints={setWhitePoints}
          blackPoints={blackPoints}
          setBlackPoints={setBlackPoints}
          gameMoves={moves}
          setGameMoves={setMoves}
        />
      </div>
      {/* Game information such as scores, moves etc. */}
      <div className="score-panel">
        <Alert variant="success" style={{ userSelect: "none" }}>
          <Alert.Heading>Welcome to the game </Alert.Heading>
        </Alert>

        <div className="game-data">
          <div className="score">
            <Card
              className="score-section"
              border={currentTurn === "white" ? "none" : "dark"}
            >
              <Card.Body>
                <Card.Title>Black</Card.Title>
              </Card.Body>
              <Card.Footer>
                <Card.Text>{`Score: ${blackPoints}`}</Card.Text>
              </Card.Footer>
            </Card>
            <Card
              className="score-section"
              border={currentTurn === "white" ? "dark" : "none"}
            >
              <Card.Body>
                <Card.Title>White</Card.Title>
              </Card.Body>
              <Card.Footer>
                <Card.Text>{`Score: ${whitePoints}`}</Card.Text>
              </Card.Footer>
            </Card>
          </div>
          <div className="moves-panel-outline">
            <Card className="moves-panel" border="dark">
              <Card.Header>
                <Card.Title>Moves</Card.Title>
              </Card.Header>
              <Card.Body className="moves-list">
                <div>
                  {getMoves()}
                </div>
              </Card.Body>
              <Card.Footer></Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
