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

/**
 * The Home component
 * Renders the Home of the game which allows the player to start a new game or join an existing one
 * @returns {React.ReactElement} React component
 */

const Home: React.FC = () => {
  const history = useHistory();
  /**
   * State representing the gameCode
   */
  const [gameCode, setGameCode] = React.useState("");
  /**
   * State representing the user input in case of join existing game
   */
  const [formInput, setFormInput] = React.useState("");
  /**
   * Toggle to enable / disable the create new game button
   */
  const [createGame, setCreateGame] = React.useState(false);
  /**
   * Toggle to enable / disable the join existing game button
   */
  const [joinGame, setJoinGame] = React.useState(false);

  /**
   * Creates a new game
   */
  const showCreateGame = () => {
    setCreateGame(true);
    setGameCode(GenerateCode(GAME_CODE_LENGTH));
  };

  const cancelCreateGame = () => setCreateGame(false);
  const showJoinGame = () => setJoinGame(true);
  const cancelJoinGame = () => setJoinGame(false);

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
    history.push(`/${gameCode}`);
  };

  /**
   * Checks if the gameCode entered by user matches an existing game and routes to the game
   */
  const handleJoinGame = () => {
    if (gameCode === formInput) history.push(`/${gameCode}`);
  };

  /**
   * Returns the Home component
   * @returns {React.ReactElement} The Home component
   */
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
          {/* Create New Game Button */}
          <Button variant="outline-success" size="lg" onClick={showCreateGame}>
            Create a new game
          </Button>
          {/* Modal associated with Create New Game */}
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

          {/* Join Existing Game Button */}
          <Button variant="outline-danger" size="lg" onClick={showJoinGame}>
            Join an existing game
          </Button>
          {/* Modal associated with Join Existing Game */}
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
