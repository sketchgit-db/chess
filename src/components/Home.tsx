import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Modal, InputGroup, FormControl, Alert } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import GenerateCode from "../utils/codeGenerator";

import "../styles.css";

const GAME_CODE_LENGTH = 6;

export interface HomeProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

/**
 * The Home component
 * Renders the Home of the game which allows the player to start a new game or join an existing one
 * @returns {React.ReactElement} React component
 */

const Home: React.FC<HomeProps> = (props) => {
  const history = useHistory();
  const [gameCode, setGameCode] = React.useState("");
  const [formInput, setFormInput] = React.useState("");
  const [createGame, setCreateGame] = React.useState(false);
  const [joinGame, setJoinGame] = React.useState(false);
  const [waitingMessage, setWaitingMessage] = React.useState("");
  const [wrongCodeMessage, setWrongCodeMessage] = React.useState("");
  const [playerName, setPlayerName] = React.useState("");
  const { socket } = props;

  /**
   * Start the game for both players
   */
  useEffect(() => {
    socket.once("start-game", (gameCode) => {
      history.push(`/${gameCode}`);
    });
  }, []);

  /**
   * Creates a new game
   */
  const showCreateGameModal = () => {
    setCreateGame(true);
    setGameCode(GenerateCode(GAME_CODE_LENGTH));
  };

  const hideCreateGameModal = () => {
    setCreateGame(false);
    setWaitingMessage("");
  };

  const showJoinGameModal = () => setJoinGame(true);

  const hideJoinGameModal = () => {
    setJoinGame(false);
    setWrongCodeMessage("");
  };

  const handleSetName = (event: any) => {
    setPlayerName(event.target.value);
  };

  /**
   * Update the form input in the game state
   * @param event Form input event
   */
  const handleSetGameCode = (event: any) => {
    setFormInput(event.target.value);
  };

  /**
   * Routes the current window to the game window
   */
  const handleCreateGame = () => {
    socket.emit("createGame", {
      gameCode: gameCode,
      name: playerName,
      position: 0,
    });
    socket.once("createGameResponse", (res: any) => {
      console.log("Player 1 joined");
      console.log(res);
      setWaitingMessage("Waiting for opponent to join ...");
    });
  };

  /**
   * Checks if the gameCode entered by user matches an existing game and routes to the game
   */
  const handleJoinGame = () => {
    socket.emit("joinGame", {
      gameCode: formInput,
      name: playerName,
      position: 1,
    });
    socket.once("joinGameResponse", (res: any) => {
      if (res.response === "player joined") {
        console.log("Both players joined");
        setWaitingMessage("");
        setWrongCodeMessage("");
      } else {
        setWrongCodeMessage(res.response);
      }
      console.log(res);
    });
  };

  /**
   * Returns the Home component
   * @returns {React.ReactElement} The Home component
   */
  return (
    <div className="home-container">
      <Card className="game-input" border="secondary">
        <Card.Header style={{ fontSize: "1.5em" }}>Let's start playing</Card.Header>
        <Card.Body>
          {/* Create New Game Button */}
          <Button variant="outline-success" size="lg" onClick={showCreateGameModal}>
            Create a new game
          </Button>
          {/* Modal associated with Create New Game */}
          <Modal show={createGame} onHide={hideCreateGameModal}>
            <Modal.Header>
              <Modal.Title>Create a new game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Enter your Name"
                  aria-label="Enter your Name"
                  onChange={handleSetName}
                  type="text"
                />
              </InputGroup>
              <Alert variant="success">
                {" "}
                Your Game Code is <b>{gameCode}</b>
              </Alert>
              <Alert show={waitingMessage !== ""} variant="warning">
                {waitingMessage}
              </Alert>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={hideCreateGameModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCreateGame}>
                Start Game
              </Button>
            </Modal.Footer>
          </Modal>

          <hr />

          {/* Join Existing Game Button */}
          <Button variant="outline-danger" size="lg" onClick={showJoinGameModal}>
            Join an existing game
          </Button>
          {/* Modal associated with Join Existing Game */}
          <Modal show={joinGame} onHide={hideJoinGameModal}>
            <Modal.Header>
              <Modal.Title>Join an existing game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Enter your Name"
                  aria-label="Enter your Name"
                  onChange={handleSetName}
                  type="text"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Enter Game Code"
                  aria-label="Enter Game Code"
                  onChange={handleSetGameCode}
                  type="text"
                />
              </InputGroup>
              <Alert show={wrongCodeMessage !== ""} variant="danger">
                {wrongCodeMessage}
              </Alert>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={hideJoinGameModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleJoinGame}>
                Start Game
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
      <Alert className="instructions" variant="info">
        <Alert.Heading style={{ textAlign: "center" }}>How to Play?</Alert.Heading>
        <ol>
          <li>
            To start a new game, click <b>Create a new game</b>
          </li>
          <ul>
            <li>
              Copy the displayed Game Code, share it with your opponent and click <b>Start Game</b>
            </li>
            <li>The game starts once your opponent enters the code</li>
          </ul>
          <li>
            To join an existing game, request the Game Code from your opponent {"& "}
            click <b>Join an existing game</b>
          </li>
          <ul>
            <li>
              Enter the code and click <b>Start Game</b>
            </li>
          </ul>
        </ol>
      </Alert>
    </div>
  );
};

export default Home;
