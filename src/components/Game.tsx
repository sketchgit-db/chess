import React from "react";
import Board from "./Board";
import { Alert, Card } from "react-bootstrap";
import { RouteComponentProps } from "react-router";

interface RouteParams {
  gameCode: string;
}

import "../styles.css";

const Game: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const { gameCode } = props.match.params;
  const [currentTurn, setCurrentTurn] = React.useState("white");
  const [whitePoints, setWhitePoints] = React.useState(0);
  const [blackPoints, setBlackPoints] = React.useState(0);

  const toSentenceCase = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  return (
    <div className="game">
      <div className="board-panel">
        <Board
          currentTurn={currentTurn}
          setCurrentTurn={setCurrentTurn}
          whitePoints={whitePoints}
          setWhitePoints={setWhitePoints}
          blackPoints={blackPoints}
          setBlackPoints={setBlackPoints}
        />
      </div>
      <div className="score-panel">
        <Alert variant="success" style={{ userSelect: "none" }}>
          <Alert.Heading>Welcome to the game </Alert.Heading>
        </Alert>

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

        <Card className="score" border="dark">
          <Card.Body>
            <Card.Title>Moves</Card.Title>
            <Card.Text></Card.Text>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Game;
