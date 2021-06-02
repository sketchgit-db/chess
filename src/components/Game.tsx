import React from "react";
import Board from "./Board";
import Timer from "./Timer";
import { Alert, Card } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import "../styles.css";

interface RouteParams {
  gameCode: string /** The gameCode for the current Game */;
}

export interface GameProps {
  /** The socket for the current player */
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const GAME_TIME = 300;

/**
 * The Game component
 * Renders the Game with all the Board and Game Information like scores, current turn
 * @param {GameProps} props The props passed by the `Home` component
 * @returns {React.ReactElement} React component
 */

const Game: React.FC<GameProps & RouteComponentProps<RouteParams>> = (props) => {
  const { socket,  match: { params }} = props;
  const { gameCode } = params;
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
  /**
   * State representing the time elapsed in the game for the black piece
   */
  const [blackTimePeriod, setBlackTimePeriod] = React.useState(GAME_TIME);
  /**
   * State representing the time elapsed in the game for the white piece
   */
  const [whiteTimePeriod, setWhiteTimePeriod] = React.useState(GAME_TIME);

  /**
   * Returns the moves so far in the game
   * @returns {Array<React.ReactElement>} The moves
   */

  const getMoves = () => {
    let gameMoves = [];
    for (let index = 0; index < moves.length; index += 2) {
      let move: string = "";
      move += (1 + index / 2).toString() + ". ";
      move += moves[index] + " ";
      if (index + 1 < moves.length) move += moves[index + 1] + "\n";
      gameMoves.push(
        <Card.Text
          key={`moveLine_${index / 2}`}
          className={(index / 2) % 2 ? "odd" : "even"}
        >
          {move}
        </Card.Text>
      );
    }
    return gameMoves;
  };

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
          socket={socket}
          gameCode={gameCode}
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
              <Card.Header>
                <Card.Title>Black</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>{`Score: ${blackPoints}`}</Card.Text>
              </Card.Body>
              <Timer
                timePeriod={blackTimePeriod}
                setTimePeriod={setBlackTimePeriod}
                paused={currentTurn === "white"}
              />
            </Card>
            <Card
              className="score-section"
              border={currentTurn === "white" ? "dark" : "none"}
            >
              <Card.Header>
                <Card.Title>White</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>{`Score: ${whitePoints}`}</Card.Text>
              </Card.Body>
              <Timer
                timePeriod={whiteTimePeriod}
                setTimePeriod={setWhiteTimePeriod}
                paused={currentTurn === "black"}
              />
            </Card>
          </div>

          <div className="moves-panel-outline">
            <Card className="moves-panel" border="dark">
              <Card.Header>
                <Card.Title>Moves</Card.Title>
              </Card.Header>
              <div className="moves-list">
                <div style={{ width: "100%" }}>{getMoves()}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
