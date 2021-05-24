import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import GenerateCode from "../codeGenerator";

import "../styles.css";

const GAME_CODE_LENGTH = 6;

const Home: React.FC = () => {
  const history = useHistory();
  const [gameCode, setGameCode] = React.useState("");
  const [formInput, setFormInput] = React.useState("");
  const [createGame, setCreateGame] = React.useState(false);
  const [joinGame, setJoinGame] = React.useState(false);

  const showCreateGame = () => {
    setCreateGame(true);
    setGameCode(GenerateCode(GAME_CODE_LENGTH));
  };

  const cancelCreateGame = () => setCreateGame(false);
  const showJoinGame = () => setJoinGame(true);
  const cancelJoinGame = () => setJoinGame(false);

  const handleSetGameCode = (event) => {
    setFormInput(event.target.value);
  };

  const handleCreateGame = () => {
    history.push(`/${gameCode}`);
  };

  const handleJoinGame = () => {
    if (gameCode === formInput) history.push(`/${gameCode}`);
  };

  return (
    <div className="home-container">
      <Card
        className="text-center"
        border="secondary"
        style={{ width: "400px" }}
      >
        <Card.Header style={{ fontSize: "1.5em" }}>
          Let's start playing
        </Card.Header>
        <Card.Body>
          <Button variant="outline-success" size="lg" onClick={showCreateGame}>
            Create a new game
          </Button>
          <Modal show={createGame} onHide={cancelCreateGame}>
            <Modal.Header>
              <Modal.Title>Create a new game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Alert variant="success">
                {" "}
                Your Game Code is <b>{gameCode}</b>
              </Alert>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={cancelCreateGame}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCreateGame}>
                Start Game
              </Button>
            </Modal.Footer>
          </Modal>
          <hr />
          <Button variant="outline-danger" size="lg" onClick={showJoinGame}>
            Join an existing game
          </Button>

          <Modal show={joinGame} onHide={cancelJoinGame}>
            <Modal.Header>
              <Modal.Title>Join an existing game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={cancelJoinGame}>
                Close
              </Button>
              <Button variant="primary" onClick={handleJoinGame}>
                Start Game
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;
