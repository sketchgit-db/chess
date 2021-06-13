import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Badge, Button, Card, Modal } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import Board, { GameResultTypes, Result } from "./Board";
import Timer from "./Timer";

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
  const history = useHistory();
  const {
    socket,
    match: { params },
  } = props;
  const { gameCode } = params;
  const [currentTurn, setCurrentTurn] = React.useState("white");
  const [whitePoints, setWhitePoints] = React.useState(0);
  const [blackPoints, setBlackPoints] = React.useState(0);
  const [moves, setMoves] = React.useState(Array<string>());
  const [blackTimePeriod, setBlackTimePeriod] = React.useState(GAME_TIME);
  const [whiteTimePeriod, setWhiteTimePeriod] = React.useState(GAME_TIME);
  const [playerColor, setPlayerColor] = React.useState("");
  const [showDrawRequest, setShowDrawRequest] = React.useState(false);
  const [player0, setPlayer0] = React.useState("");
  const [player1, setPlayer1] = React.useState("");

  /**
   * Set the piece color used by the player on socket `socket`
   */

  useEffect(() => {
    socket.emit("getColor", {
      id: socket.id,
      gameCode: gameCode,
    });
  }, []);

  /**
   * Set player's name and piece color
   */
  useEffect(() => {
    socket.on("setPlayerColor", (data) => {
      if (data.id === socket.id) {
        setPlayerColor(data.color);
      }
      if (data.position) {
        if (data.name !== "") {
          setPlayer1(data.name);
        } else {
          setPlayer1("Black");
        }
      } else {
        if (data.name !== "") {
          setPlayer0(data.name);
        } else {
          setPlayer0("White");
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.once("proposeDraw", (data) => {
      if (socket.id !== data.socket) {
        console.log(data.message);
        setShowDrawRequest(true);
      }
    });
    return () => {
      socket.off("proposeDraw");
    };
  }, [currentTurn]);

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
        <Card.Text key={`moveLine_${index / 2}`} className={(index / 2) % 2 ? "odd" : "even"}>
          {move}
        </Card.Text>
      );
    }
    return gameMoves;
  };

  const handleResign = () => {
    let result: Result = { outcome: "", message: "" };
    result.outcome = currentTurn === "white" ? GameResultTypes.BLACK : GameResultTypes.WHITE;
    result.message = "Opponent's Resignation";
    socket.emit("game-complete", {
      result: result,
      gameCode: gameCode,
      gameMoves: moves,
    });
    history.push("/");
  };

  const handleDraw = () => {
    socket.emit("propose-draw", {
      message: `${currentTurn} offered Draw`,
      gameCode: gameCode,
    });
  };

  const handleAcceptDraw = () => {
    setShowDrawRequest(false);
    let result: Result = { outcome: "", message: "" };
    result.outcome = GameResultTypes.DRAW;
    result.message = "Mutual Agreement";
    socket.emit("game-complete", {
      result: result,
      gameCode: gameCode,
      gameMoves: moves,
    });
  };

  const handleDeclineDraw = () => {
    setShowDrawRequest(false);
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
          playerColor={playerColor}
        />
      </div>
      {/* Game information such as scores, moves etc. */}
      <div className="score-panel">
        <Alert variant="success" style={{ userSelect: "none" }}>
          <Alert.Heading>Welcome to the game </Alert.Heading>
        </Alert>


        <div className="game-data">
          <div className="currentTurn">
            <Badge variant="light">
              {`${currentTurn === "white" ? player0 : player1}'s turn`}
            </Badge>
          </div>
          <div className="game-end-buttons">
            <Button className="btn" disabled={playerColor !== currentTurn} variant="success" size="lg" onClick={handleDraw}>
              Offer Draw
            </Button>
            <Button className="btn" disabled={playerColor !== currentTurn} variant="danger" size="lg" onClick={handleResign}>
              Resign
            </Button>
          </div>
          <div className="game-meta-data">
            <div className="score">
              <Card bg="dark" text="light" className="score-section" border={currentTurn === "white" ? "none" : "light"}>
                <Card.Header>
                  <Card.Title>{player1}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{`${blackPoints}`}</Card.Text>
                </Card.Body>
                {/* <Timer timePeriod={blackTimePeriod} setTimePeriod={setBlackTimePeriod} paused={currentTurn === "white"} /> */}
              </Card>
              <Card className="score-section" border={currentTurn === "white" ? "dark" : "none"}>
                <Card.Header>
                  <Card.Title>{player0}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{`${whitePoints}`}</Card.Text>
                </Card.Body>
                {/* <Timer timePeriod={whiteTimePeriod} setTimePeriod={setWhiteTimePeriod} paused={currentTurn === "black"} /> */}
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
          <Modal show={showDrawRequest}>
            <Modal.Header>
              <Modal.Title>{`${currentTurn} offered a draw`}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <Button variant="success" onClick={handleAcceptDraw}>
                Accept Draw
              </Button>
              <Button variant="danger" onClick={handleDeclineDraw}>
                Decline Draw
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Game;
