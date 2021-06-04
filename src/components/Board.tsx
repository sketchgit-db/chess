import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Square from "./Square";
import PieceDetails from "../PieceDetails";
import Piece, { PieceProps } from "../Piece";
import Hints from "../Hints";
import "../styles.css";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export interface BoardStatusProps {
  piece: PieceProps /** The piece under consideration */;
  setPiece: any /** The callback to update the above `piece` */;
  color: string /** The color of the board cell under consideration */;
  setColor: any /** The callback to update the above `color` */;
}

export interface BoardProps {
  currentTurn: string /** State representing the current turn, 'white' or 'black' */;
  setCurrentTurn: any /** The callback to update the above `currentTurn` */;
  whitePoints: number /** State representing the points scored by the player with white pieces */;
  setWhitePoints: any /** The callback to update the above `whitePoints` */;
  blackPoints: number /** State representing the points scored by the player with black pieces */;
  setBlackPoints: any /** The callback to update the above `blackPoints` */;
  gameMoves: Array<string> /** State representing the moves in the game so far */;
  setGameMoves: any /** The callback to update the moves in the game */;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> /** The socket for the current player */;
  gameCode: string /** The gameCode for the current Game */; 
}

/**
 * The Board component
 * Renders the board with all the pieces and handles piece movements and captures
 * @param {BoardProps} props The props passed by the `Game` component
 * @returns {React.ReactElement} React component
 */

const Board: React.FC<BoardProps> = (props) => {
  const history = useHistory();
  /**
   * A dummy Piece representing an empty cell for capture moves
   */
  const dummyPiece: PieceProps = new Piece("empty-cell", null, "", -1, 0, "", 0);

  /**
   * State storing whether the game is in progress or has completed
   */
  const [gameComplete, setGameComplete] = React.useState(false);

  /**
   * State storing the color of the winning side
   */
  const [winningColor, setWinningColor] = React.useState("");

  /**
   * The color played by the player on socket `socket`
   */
  const [playerColor, setPlayerColor] = React.useState("");

  /**
   * Destructuring props into member variables
   */
  const {
    currentTurn,
    setCurrentTurn,
    whitePoints,
    setWhitePoints,
    blackPoints,
    setBlackPoints,
    gameMoves,
    setGameMoves,
    socket,
    gameCode,
  } = props;

  /**
   * Set the piece color used by the player on socket `socket`
   */

  useEffect(() => {
    socket.emit("getColor", {
      id: socket.id,
      gameCode: gameCode
    });
  }, []);

  useEffect(() => {
    socket.on("setPlayerColor", (data) => {
      console.log("setPlayerColor ", socket.id, data, playerColor);
      if (data.id === socket.id) {
        setPlayerColor(data.color);
      }
    });
  }, []);

  /**
   * Returns an object of type `BoardProps` for a given piece
   * @param {number} index The index of current piece
   * @param {PieceProps} _piece The current Piece
   * @returns {Object} The `BoardProps` type object
   */

  const updateBoardConfig = (index: number, _piece: PieceProps) => {
    if (Math.floor(index / 8 + index) % 2) {
      const [color, setColor] = React.useState("black");
      const [piece, setPiece] = React.useState(_piece);
      return {
        piece: piece,
        setPiece: setPiece,
        color: color,
        setColor: setColor,
      };
    } else {
      const [color, setColor] = React.useState("white");
      const [piece, setPiece] = React.useState(_piece);
      return {
        piece: piece,
        setPiece: setPiece,
        color: color,
        setColor: setColor,
      };
    }
  };

  /**
   * Initializes the Board state in `BoardConfig`
   * The board is initialized according to the following FEN rule
   * rnbqkbnr/pppppppp/8/8/8/8/RNBQKBNR/PPPPPPPP w
   * @returns {Array<BoardStatusProps>} The BoardConfig
   */

  const initBoardColors = () => {
    let BoardConfig: Array<BoardStatusProps> = [];
    const white_row = [
      PieceDetails.WHITE_ROOK,
      PieceDetails.WHITE_KNIGHT,
      PieceDetails.WHITE_BISHOP,
      PieceDetails.WHITE_QUEEN,
      PieceDetails.WHITE_KING,
      PieceDetails.WHITE_BISHOP,
      PieceDetails.WHITE_KNIGHT,
      PieceDetails.WHITE_ROOK,
    ];
    const black_row = [
      PieceDetails.BLACK_ROOK,
      PieceDetails.BLACK_KNIGHT,
      PieceDetails.BLACK_BISHOP,
      PieceDetails.BLACK_QUEEN,
      PieceDetails.BLACK_KING,
      PieceDetails.BLACK_BISHOP,
      PieceDetails.BLACK_KNIGHT,
      PieceDetails.BLACK_ROOK,
    ];

    // rnbqkbnr
    for (let index = 0; index < 8; index++) {
      const _piece = new Piece(
        "black-piece",
        black_row[index].pieceName,
        black_row[index].label,
        index,
        black_row[index].value,
        black_row[index].identifier,
        0
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    // pppppppp
    for (let index = 8; index < 16; index++) {
      const _piece = new Piece(
        "black-piece",
        PieceDetails.BLACK_PAWN.pieceName,
        PieceDetails.BLACK_PAWN.label,
        index,
        PieceDetails.BLACK_PAWN.value,
        PieceDetails.BLACK_PAWN.identifier,
        0
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    // 8/8/8/8
    for (let index = 16; index < 48; index++) {
      const _piece = new Piece("empty-cell", null, "", index, 0, "", 0);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    // PPPPPPPP
    for (let index = 48; index < 56; index++) {
      const _piece = new Piece(
        "white-piece",
        PieceDetails.WHITE_PAWN.pieceName,
        PieceDetails.WHITE_PAWN.label,
        index,
        PieceDetails.WHITE_PAWN.value,
        PieceDetails.WHITE_PAWN.identifier,
        0
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    // RNBQKBNR
    for (let index = 56; index < 64; index++) {
      const _piece = new Piece(
        "white-piece",
        white_row[index % 8].pieceName,
        white_row[index % 8].label,
        index,
        white_row[index % 8].value,
        white_row[index % 8].identifier,
        0
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    return BoardConfig;
  };

  /**
   * The Board's state at an instance
   */
  const BoardConfig = initBoardColors();
  /**
   * The list of hint cells found for a given Piece
   */
  const [hintCells, updateHintCells] = React.useState(Array<PieceProps>());
  /**
   * The last clicked piece (used to perform moves and captures)
   */
  const [clickedPiece, updateClickedPiece] = React.useState(dummyPiece);

  /**
   * Sync game status across both players
   */

  useEffect(() => {
    socket.once("nextTurn", (data) => {
      if (socket.id === data.socket) {
        console.log("+++ moveSelf +++");
      } else {
        console.log("+++ moveOpponent +++");
      }
      console.log(data, currentTurn);
      const fromPos = data.fromPos;
      const fromPiece = data.fromPiece;
      const toPos = data.toPos;
      const toPiece = data.toPiece;
      BoardConfig[fromPos].setPiece(fromPiece);
      BoardConfig[toPos].setPiece(toPiece);
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
      updateClickedPiece(dummyPiece);
      updateScores(toPiece, data.points);
    });
  }, [currentTurn]);

  /**
   * Update moves for both players
   */

  useEffect(() => {
    socket.once('updateMoveTable', (data) => {
      console.log('+++ updateMoveTable +++');
      console.log(data);
      getMoveRepresentation(
        data.fromPiece,
        data.toPiece,
        data.isCapture,
        data.ischeck,
        data.ischeckmate
      );
    });
  }, [currentTurn]);


  useEffect(() => {
    socket.once('markCheck', (data) => {
      BoardConfig[data.position].setColor(data.color);
    });
  }, [currentTurn]);

  useEffect(() => {
    socket.once("unmarkCheck", (data) => {
      BoardConfig[data.position0].setColor(data.color0);
      BoardConfig[data.position1].setColor(data.color1);
    });
  }, [currentTurn]);

  /**
   * Update game completion status for both players
   */

  useEffect(() => {
    socket.once('gameComplete', (data) => {
      console.log('+++ gameComplete +++');
      console.log(data);
      setGameComplete(true);
      // @ts-ignore
      setWinningColor(data.piece.pieceName?.split("-")[0]);
    });
  }, []);

  /**
   * Update the score for the capturing piece
   * @param {PieceProps} from The capturing piece
   * @param {number} value The value of the captured piece
   */

  const updateScores = (from: PieceProps, value: number) => {
    if (from.pieceName?.split("-")[0] === "white") {
      setWhitePoints(whitePoints + value);
    } else {
      setBlackPoints(blackPoints + value);
    }  
  };

  /**
   * Get the algebraic representaion of the current move
   * @param {PieceProps} from The source piece
   * @param {PieceProps} to The destination piece (or empty cell)
   * @param {boolean} isCapture Whether a capture of piece took place
   * @param {boolean} isCheck Whether the opponent king was given a check
   * @param {boolean} isCheckMate Whether the opponent king was checkmate
   * @returns {string} The algebraic notation of the move
   */

  const getMoveRepresentation = (
    from: PieceProps,
    to: PieceProps,
    isCapture: boolean,
    isCheck: boolean,
    isCheckMate: boolean
  ) => {
    const posTo = from.position;
    const [x, y] = [
      (8 - Math.floor(posTo / 8)).toString(),
      String.fromCharCode(97 + (posTo % 8)),
    ];
    let moveRep = from.identifier + (isCapture ? "x" : "") + y + x;
    if (isCheckMate) {
      moveRep += "#";
    } else if (isCheck) {
      moveRep += "+";
    }
    setGameMoves([...gameMoves, moveRep]);
  };

  /**
   * TODO
   * Checks if the opponent king to the attacking `piece` is in checkMate
   * @param {PieceProps} piece The latest piece which caused check
   * @param {number} kingPos The position of the opponent king
   * @returns {boolean} true if the opponent king has been checkmated, false otherwise
   */

  const isCheckMate = (
    piece: PieceProps,
    kingPos: number,
    possibleMoves: Array<PieceProps>
  ): boolean => {
    const moves = new Hints(BoardConfig);
    const validMoves = moves.getKingMoves(BoardConfig[kingPos].piece);
    const checkMate = validMoves.every((val) => possibleMoves.includes(val));
    if (checkMate) {
      socket.emit('checkmate', {
        piece: piece,
        gameCode: gameCode
      });
      return true;
    } else {
      return false;
    }
  };

  /**
   * Checks if the attacking `piece` causes a check to the opponent king
   * @param {PieceProps} piece The attacking piece
   * @returns {[boolean, boolean]} [isCheck, isCheckMate] for the opponent king
   */

  const isCheck = (piece: PieceProps): [boolean, boolean] => {
    const moves = new Hints(BoardConfig);
    const [found, selfKingPos, oppKingPos, possibleMoves] =
      moves.isCheck(piece);
    if (found) {
      socket.emit("setCheck", {
        gameCode: gameCode,
        position: oppKingPos,
        color: "check"
      });
      const ischeckMate = isCheckMate(piece, oppKingPos, possibleMoves);
      return [true, ischeckMate];
    } else {
      socket.emit("unsetCheck", {
        gameCode: gameCode,
        position0: selfKingPos,
        color0: Math.floor(selfKingPos / 8 + selfKingPos) % 2 ? "black" : "white",
        position1: oppKingPos,
        color1: Math.floor(oppKingPos / 8 + oppKingPos) % 2 ? "black" : "white"
      });
      return [false, false];
    }
  };

  /**
   * Performs the capture move
   * @param {PieceProps} from The capturing piece
   * @param {PieceProps} to The captured piece
   */

  const capture = (from: PieceProps, to: PieceProps) => {
    const posFrom = from.position, posTo = to.position;
    console.log(`Making a capture from ${posFrom} to ${posTo}`);
    dummyPiece.position = posFrom;
    from.position = posTo;
    to.position = posFrom;
    from.numMoves += 1;

    socket.emit("perform-move", {
      fromPos: posFrom,
      fromPiece: dummyPiece,
      toPos: posTo,
      toPiece: from,
      gameCode: gameCode,
      points: to.value
    });
  };

  /**
   * Perform the move (simple move (or) capture)
   * @param {PieceProps} from The piece attempting to move
   * @param {PieceProps} to The cell to which the move attempt is made
   * @returns {boolean} true if the move was a piece capture, false otherwise
   */

  const makeMove = (from: PieceProps, to: PieceProps): boolean => {
    if (to.pieceName === null) {
      const posFrom = from.position,
        posTo = to.position;
      console.log(`Making a move from ${posFrom} to ${posTo}`);
      to.position = posFrom;
      from.position = posTo;
      from.numMoves += 1;

      socket.emit("perform-move", {
        fromPos: posFrom,
        fromPiece: to,
        toPos: posTo,
        toPiece: from,
        gameCode: gameCode,
        points: 0
      });

      return false;
    } else {
      capture(from, to);
      return true;
    }
  };

  /**
   * Checks if a move is possible from the last clicked piece `clickedPiece` \
   *  to the current clicked piece `piece`
   * @param {PieceProps} piece
   * @returns {boolean} The possiblity of a move (true (or) false)
   */

  const checkPossibleMove = (piece: PieceProps): boolean => {
    const index = piece.position;
    return (
      piece.position !== clickedPiece.position &&
      BoardConfig[index].color === "selected"
    );
  };

  /**
   * onClick Handler for a given piece click
   * Checks if a move is possible and performs if a source and destination cell exists
   * @param {PieceProps} piece The piece (or an empty cell) clicked upon
   */

  const squareOnClickHandler = (piece: PieceProps) => {
    const moves = new Hints(BoardConfig);
    if (checkPossibleMove(piece)) {
      // make a move (or capture)
      const fromPiece = clickedPiece,
        toPiece = piece;
      const isCapture = makeMove(clickedPiece, piece);
      moves.hideHints(hintCells);
      // check if the move caused a check to the opponent
      const [ischeck, ischeckmate] = isCheck(clickedPiece);
      // get the move representation
      socket.emit("getMoveRepresentation", {
        fromPiece: fromPiece,
        toPiece: toPiece,
        isCapture: isCapture,
        ischeck: ischeck,
        ischeckmate: ischeckmate,
        gameCode: gameCode
      });
    } else {
      const color = piece.pieceName?.split("-")[0];
      if (color === currentTurn && color == playerColor) {
        console.log(piece);
        updateClickedPiece(piece);
        moves.hideHints(hintCells);
        const validMoves = moves.showHints(piece);
        updateHintCells(validMoves);
      }
    }
  };

  /**
   * Get the React element for each of the cell using the state computed earlier
   * @returns {Array<React.ReactElement>} The array of all cells on the board
   */

  const renderSquares = () => {
    const squares: any = [];
    for (let index = 0; index < 64; index++) {
      squares.push(
        <Square
          key={`square_${index}`}
          color={BoardConfig[index].color}
          position={index}
          piece={BoardConfig[index].piece}
          onClick={squareOnClickHandler}
        />
      );
    }
    return squares;
  };

  /**
   * Get the rank labels for the chess board
   * @param {number} side Rank direction (left or right)
   * @returns {Array<React.ReactElement>} Array of Rank divs
   */

  const getRanks = (side: number) => {
    const ranks = [];
    for (let index = 8; index >= 1; index--) {
      ranks.push(
        <div className="ranks" key={`rank${side}_${index}`}>
          {index}
        </div>
      );
    }
    return ranks;
  };

  /**
   * Get the file labels for the chess board
   * @param {number} side File direction (top or bottom)
   * @returns {Array<React.ReactElement>} Array of File divs
   */

  const getFiles = (side: number) => {
    const files = [];
    for (let index = 97; index <= 104; index++) {
      files.push(
        <div className="files" key={`file${side}_${index - 97}`}>
          {String.fromCharCode(index)}
        </div>
      );
    }
    return files;
  };

  /**
   * Returns the Board component
   * @returns {React.ReactElement} The Board React Component
   */

  return (
    <div className="outline-1">
      <div className="file-list">{getFiles(0)}</div>
      <div className="outline-2">
        <div className="rank-list">{getRanks(0)}</div>
        <div className="board">{renderSquares()}</div>
        <div className="rank-list">{getRanks(1)}</div>
      </div>
      <div className="file-list">{getFiles(1)}</div>
      <Modal show={gameComplete}>
        <Modal.Header>
          <Modal.Title>Game Over !</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`${winningColor} won by checkMate`}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              history.push("/");
            }}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Board;
