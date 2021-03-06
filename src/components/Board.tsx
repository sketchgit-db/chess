import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import Square from "./Square";
import Rank from "./Rank";
import File from "./File";
import PawnPromotionModal from "./PawnPromotionModal";

import PieceDetails from "../core/PieceDetails";
import Piece, { PieceProps } from "../core/Piece";
import Hints from "../utils/Hints";
import * as utils from "../utils/helpers";

import "../styles.css";

enum MoveTypes {
  MOVE = 0,
  CAPTURE = 1,
  CASTLE = 2,
  PROMOTION = 3,
}

export enum GameResultTypes {
  WHITE = "White Won",
  BLACK = "Black Won",
  DRAW = "Game Drawn",
}

export interface Result {
  outcome: string;
  message: string;
}

export interface BoardStatusProps {
  piece: PieceProps /** The piece under consideration */;
  setPiece: React.Dispatch<React.SetStateAction<PieceProps>> /** The callback to update the above `piece` */;
  color: string /** The color of the board cell under consideration */;
  setColor: React.Dispatch<React.SetStateAction<string>> /** The callback to update the above `color` */;
}

export interface BoardProps {
  currentTurn: string /** State representing the current turn, 'white' or 'black' */;
  setCurrentTurn: React.Dispatch<React.SetStateAction<string>>;
  /** The callback to update the above `currentTurn` */
  whitePoints: number /** State representing the points scored by the player with white pieces */;
  setWhitePoints: React.Dispatch<React.SetStateAction<number>>;
  /** The callback to update the above `whitePoints` */
  blackPoints: number /** State representing the points scored by the player with black pieces */;
  setBlackPoints: React.Dispatch<React.SetStateAction<number>>;
  /** The callback to update the above `blackPoints` */
  gameMoves: Array<string> /** State representing the moves in the game so far */;
  setGameMoves: React.Dispatch<React.SetStateAction<string[]>> /** The callback to update the moves in the game */;
  /** The socket for the current player */
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  gameCode: string /** The gameCode for the current Game */;
  playerColor: string /** The piece color current player is playing on */;
}

/**
 * The Board component
 * Renders the board with all the pieces and handles piece movements and captures
 * @param {BoardProps} props The props passed by the `Game` component
 * @returns {React.ReactElement} React component
 */

const Board: React.FC<BoardProps> = (props) => {
  const history = useHistory();
  const dummyPiece: PieceProps = utils.getEmptyCell(-1);
  const [gameComplete, setGameComplete] = React.useState(false);
  const [gameResult, setGameResult] = React.useState("");
  const [hintCells, updateHintCells] = React.useState(Array<number>());
  let pieceInCheck = -1;
  /**
   * The last clicked piece (used to perform moves and captures)
   */
  const [clickedPiece, updateClickedPiece] = React.useState(dummyPiece);
  /**
   * States storing the color of pawn promoted and positions involving the promotion
   */
  const [pawnPromotionType, setPawnPromotionType] = React.useState("");
  const [promotionPos, setPromotionPos] = React.useState([-1, -1]);

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
    playerColor,
  } = props;

  /**
   * Returns an object of type `BoardStatusProps` for a given piece
   * @param {number} index The index of current piece
   * @param {PieceProps} _piece The current Piece
   * @returns {BoardStatusProps} The `BoardStatusProps` type object
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
      const _piece = utils.getNewPiece("black-piece", black_row[index], index);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }
    // pppppppp
    for (let index = 8; index < 16; index++) {
      const _piece = utils.getNewPiece("black-piece", PieceDetails.BLACK_PAWN, index);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }
    // 8/8/8/8
    for (let index = 16; index < 48; index++) {
      const _piece = utils.getEmptyCell(index);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }
    // PPPPPPPP
    for (let index = 48; index < 56; index++) {
      const _piece = utils.getNewPiece("white-piece", PieceDetails.WHITE_PAWN, index);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }
    // RNBQKBNR
    for (let index = 56; index < 64; index++) {
      const _piece = utils.getNewPiece("white-piece", white_row[index % 8], index);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
    }

    return BoardConfig;
  };

  /**
   * The Board's state at an instance
   */
  const BoardConfig = initBoardColors();

  /**
   * Update moves table for both players
   */

  useEffect(() => {
    socket.once("updateMoveTable", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log("+++ updateMoveTable +++", data);
      }
      setGameMoves((gameMoves) => [...gameMoves, data.move]);
      if (data.checkmate || data.stalemate) {
        socket.emit("game-complete", {
          result: data.result,
          gameCode: gameCode,
          gameMoves: [...gameMoves, data.move],
        });
      }
    });
  }, [gameMoves]);

  /**
   * Peform the latest move (normal or capture) for both players
   */

  useEffect(() => {
    socket.once("nextTurn", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log(socket.id === data.socket ? "+++ moveSelf +++" : "+++ moveOpponent +++");
      }
      const [from, to, moveType, sockId] = [data.fromPiece, data.toPiece, data.moveType, data.socket];
      if (BoardConfig[data.fromPos].piece !== data.fromPiece) {
        BoardConfig[data.fromPos].setPiece(data.fromPiece);
      }
      if (BoardConfig[data.toPos].piece !== data.toPiece) {
        BoardConfig[data.toPos].setPiece(data.toPiece);
      }
      if (clickedPiece !== dummyPiece) {
        updateClickedPiece(dummyPiece);
      }
      if (sockId === socket.id && from.position !== -1 && to.position !== -1) {
        getCheckStatus(from, to, moveType);
      }
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
      updateScores(data.toPiece, data.points);
    });
    return () => {
      socket.off("nextTurn");
    };
  }, [currentTurn]);

  /**
   * Perform the special move castling for both players
   */

  useEffect(() => {
    socket.once("performCastling", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log("+++ performCastling +++", data);
      }
      const [from, to, sockId] = [data.newRookPiece, data.newKingPiece, data.socket];
      if (BoardConfig[data.oldKingPos].piece !== data.oldKingPiece) {
        BoardConfig[data.oldKingPos].setPiece(data.oldKingPiece);
      }
      if (BoardConfig[data.newKingPos].piece !== data.newKingPiece) {
        BoardConfig[data.newKingPos].setPiece(data.newKingPiece);
      }
      if (BoardConfig[data.oldRookPos].piece !== data.oldRookPiece) {
        BoardConfig[data.oldRookPos].setPiece(data.oldRookPiece);
      }
      if (BoardConfig[data.newRookPos].piece !== data.newRookPiece) {
        BoardConfig[data.newRookPos].setPiece(data.newRookPiece);
      }
      if (clickedPiece !== dummyPiece) {
        updateClickedPiece(dummyPiece);
      }
      if (sockId === socket.id && from.position !== -1 && to.position !== -1) {
        getCheckStatus(from, to, MoveTypes.CASTLE);
      }
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
    });
    return () => {
      socket.off("performCastling");
    };
  }, [currentTurn]);

  /**
   * Perform the special move Pawn Promotion for both players
   */

  useEffect(() => {
    socket.once("performPromotion", (data) => {
      const [from, to, sockId] = [data.oldPiece, data.newPiece, data.socket];
      if (BoardConfig[data.oldPiecePos].piece !== data.oldPiece) {
        BoardConfig[data.oldPiecePos].setPiece(data.oldPiece);
      }
      if (BoardConfig[data.newPiecePos].piece !== data.newPiece) {
        BoardConfig[data.newPiecePos].setPiece(data.newPiece);
      }
      if (clickedPiece !== dummyPiece) {
        updateClickedPiece(dummyPiece);
      }
      if (sockId === socket.id && from.position !== -1 && to.position !== -1) {
        getCheckStatus(from, to, MoveTypes.PROMOTION);
      }
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
    });
    return () => {
      socket.off("performPromotion");
    };
  }, [currentTurn]);

  /**
   * Mark and unmark king in check
   */
  useEffect(() => {
    socket.once("markCheck", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log("King in check", data);
      }
      BoardConfig[data.position].setColor(data.color);
      pieceInCheck = data.position;
    });
    return () => {
      socket.off("markCheck");
    };
  }, [currentTurn]);

  useEffect(() => {
    socket.once("unmarkCheck", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log("King avoided check", data);
      }
      BoardConfig[data.position].setColor(data.color);
      pieceInCheck = -1;
    });
    return () => {
      socket.off("unmarkCheck");
    };
  }, [currentTurn]);

  /**
   * Update game completion status for both players
   */

  useEffect(() => {
    socket.once("gameComplete", (data) => {
      if (process.env.NODE_ENV === "development") {
        console.log("+++ gameComplete +++", data);
      }
      setGameComplete(true);
      const message = data.result.outcome + " by " + data.result.message;
      setGameResult(message);
    });
    return () => {
      socket.off("gameComplete");
    };
  }, []);

  /**
   * Update the score for the capturing piece
   * @param {PieceProps} from The capturing piece
   * @param {number} value The value of the captured piece
   */

  const updateScores = (from: PieceProps, value: number) => {
    if (utils.getPieceColor(from) === "white") {
      setWhitePoints(whitePoints + value);
    } else {
      setBlackPoints(blackPoints + value);
    }
  };

  /**
   * Get the algebraic representaion of the current move
   * @param {PieceProps} from The source piece
   * @param {PieceProps} to The destination piece (or empty cell)
   * @param {number} moveType 0 - Normal move, 1 - capture, 2 - castling
   * @param {boolean} isCheck Whether the opponent king was given a check
   * @param {boolean} isCheckMate Whether the opponent king was checkmate
   * @returns {string} `moveRep` - The current move
   */

  const getMoveRepresentation = (
    from: PieceProps,
    to: PieceProps,
    moveType: number,
    isCheck: boolean,
    isCheckMate: boolean
  ) => {
    const posTo = to.position;
    const [x, y] = [(8 - Math.floor(posTo / 8)).toString(), String.fromCharCode(97 + (posTo % 8))];
    let moveRep = "";
    if (moveType === 2) {
      moveRep = from.position < to.position ? "0-0" : "0-0-0";
    } else {
      if (moveType === 3) {
        moveRep = y + x + "=" + to.identifier;
      } else {
        moveRep = to.identifier + (moveType === 1 ? "x" : "") + y + x;
      }
    }
    if (isCheckMate) {
      moveRep += "#";
    } else if (isCheck) {
      moveRep += "+";
    }
    // setGameMoves([...gameMoves, moveRep]);
    return moveRep;
  };

  /**
   * Get whether the king at `kingPos` is checkmate by the opponent
   * @param {PieceProps} piece The opponent piece which put the king in check
   * @param {number} kingPos The position of the king under check
   * @param {number[]} oppMoves The list of capture moves available to the opponent piece
   * @param {number[]} selfMoves The list of moves (simple move by pawn included) by the pieces of the king's type
   * @param {number[]} attacks The list of pieces putting the king in check
   * @returns {boolean} Whether the king at `kingPos` is checkmate by the opponent
   */

  const isCheckMate = (kingPos: number, oppMoves: number[], selfMoves: number[], attacks: number[]) => {
    const moves = new Hints(BoardConfig);
    const ischeckMate = moves.isCheckMate(kingPos, oppMoves, selfMoves, attacks);
    return ischeckMate;
  };

  /**
   * Checks if the attacking `piece` causes a check to the opponent king
   * @param {PieceProps} piece The attacking piece
   * @returns {[boolean, boolean]} [ischeck, ischeckmate] for the opponent king
   */

  const isCheck = (piece: PieceProps): [boolean, boolean] => {
    const moves = new Hints(BoardConfig);
    const outVal = moves.isCheck(utils.getPieceColor(piece));
    if (outVal.attackingPieces.length > 0) {
      socket.emit("setCheck", {
        gameCode: gameCode,
        position: outVal.oppKingPos,
        color: "check",
      });
      const ischeckMate = isCheckMate(
        outVal.oppKingPos,
        outVal.selfPossibleMoves,
        outVal.oppPossibleMoves,
        outVal.attackingPieces
      );
      return [true, ischeckMate];
    } else {
      if (pieceInCheck !== -1) {
        socket.emit("unsetCheck", {
          gameCode: gameCode,
          position: pieceInCheck,
          color: Math.floor(pieceInCheck / 8 + pieceInCheck) % 2 ? "black" : "white",
        });
      }
      return [false, false];
    }
  };

  const isStalemate = (piece: PieceProps) => {
    const moves = new Hints(BoardConfig);
    return moves.isStaleMate(utils.getPieceColor(piece));
  };

  /**
   * Check if pawn promotion is possible
   * @param {PieceProps} from The capturing piece
   * @param {PieceProps} to The captured piece
   * @returns {boolean} true if promotion possible, else false
   */

  const checkPromotion = (from: PieceProps, to: PieceProps): boolean => {
    let possible: boolean = true;
    possible &&= utils.getPieceName(from) === "pawn";
    let rank = Math.floor(to.position / 8);
    possible &&= rank == 0 || rank == 7;
    return possible;
  };

  /**
   * Performs a normal move
   * @param {PieceProps} from The movinb piece
   * @param {PieceProps} to The cell to move into
   */

  const performMove = (from: PieceProps, to: PieceProps) => {
    const [posFrom, posTo] = [from.position, to.position];
    if (process.env.NODE_ENV === "development") {
      console.log(`Making a move from ${posFrom} to ${posTo}`);
    }
    to.position = posFrom;
    from.position = posTo;
    from.numMoves += 1;

    socket.emit("perform-move", {
      fromPos: posFrom,
      fromPiece: to,
      toPos: posTo,
      toPiece: from,
      gameCode: gameCode,
      points: 0,
      moveType: MoveTypes.MOVE,
    });
  };

  /**
   * Performs the capture move
   * @param {PieceProps} from The capturing piece
   * @param {PieceProps} to The captured piece
   */

  const performCapture = (from: PieceProps, to: PieceProps) => {
    const [posFrom, posTo] = [from.position, to.position];
    if (process.env.NODE_ENV === "development") {
      console.log(`Making a capture from ${posFrom} to ${posTo}`);
    }
    const emptyCell = utils.getEmptyCell(posFrom);
    from.position = posTo;
    to.position = posFrom;
    from.numMoves += 1;

    socket.emit("perform-move", {
      fromPos: posFrom,
      fromPiece: emptyCell,
      toPos: posTo,
      toPiece: from,
      gameCode: gameCode,
      points: to.value,
      moveType: MoveTypes.CAPTURE,
    });
  };

  /**
   * Peforms promotion of the pawn
   * @param {PieceProps} from The promoted pawn
   * @param {PieceProps} to The piece promoted into
   */

  const performPromotion = (from: PieceProps, to: PieceProps) => {
    const newPos = [from.position, to.position];
    const color = utils.getPieceColor(from);
    setPromotionPos([...newPos]);
    setPawnPromotionType(color + "-promotion");
  };

  /**
   * Peforms castling move
   * @param {PieceProps} from The king involved in castling
   * @param {PieceProps} to The rook involved in castling
   */

  const performCastling = (from: PieceProps, to: PieceProps) => {
    const [posFrom, posTo] = [from.position, to.position];
    const emptyCell0 = utils.getEmptyCell(posFrom);
    const emptyCell1 = utils.getEmptyCell(posTo);
    let [newKingPos, newRookPos] = [posFrom, posTo];
    if (posFrom < posTo) {
      // kingSide
      newKingPos += 2;
      newRookPos -= 2;
    } else {
      // queenSide
      newKingPos -= 2;
      newRookPos += 3;
    }
    from.position = newKingPos;
    from.numMoves += 1;
    to.position = newRookPos;
    to.numMoves += 1;

    socket.emit("castle", {
      oldKingPiece: emptyCell0,
      newKingPiece: from,
      oldKingPos: posFrom,
      newKingPos: newKingPos,
      oldRookPiece: emptyCell1,
      newRookPiece: to,
      oldRookPos: posTo,
      newRookPos: newRookPos,
      gameCode: gameCode,
    });
  };

  /**
   * Perform the move (simple move (or) capture)
   * @param {PieceProps} from The piece attempting to move
   * @param {PieceProps} to The cell to which the move attempt is made
   * @returns {number} One of the move types from the enum `MoveTypes`
   */

  const makeMove = (from: PieceProps, to: PieceProps): number => {
    if (checkPromotion(from, to)) {
      performPromotion(from, to);
      return MoveTypes.PROMOTION;
    } else if (to.pieceName === null) {
      performMove(from, to);
      return MoveTypes.MOVE;
    } else if (utils.getPieceColor(to) === utils.getPieceColor(from)) {
      performCastling(from, to);
      return MoveTypes.CASTLE;
    } else {
      performCapture(from, to);
      return MoveTypes.CAPTURE;
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
    return piece.position !== clickedPiece.position && BoardConfig[index].color === "selected";
  };

  /**
   * Checks the status of game (in check, in checkmate, in stalemate) after toPiece has moved from fromPiece's position
   * @param {PieceProps} fromPiece The new piece at the original position after the move
   * @param {PieceProps} toPiece The piece after the move at its new position
   * @param {number} moveType One of the move types from the enum `MoveTypes`
   */

  const getCheckStatus = (fromPiece: PieceProps, toPiece: PieceProps, moveType: number) => {
    const color = utils.getPieceColor(toPiece);
    BoardConfig[fromPiece.position].piece = fromPiece;
    BoardConfig[toPiece.position].piece = toPiece;
    if (process.env.NODE_ENV === "development") {
      console.log("Check Status", fromPiece, toPiece, moveType);
    }

    let result: Result = { outcome: "", message: "" };

    const [ischeck, ischeckmate] = isCheck(toPiece);
    const isstalemate = isStalemate(toPiece);
    const lastMove = getMoveRepresentation(fromPiece, toPiece, moveType, ischeck, ischeckmate);

    if (ischeckmate) {
      result.outcome = color === "white" ? GameResultTypes.WHITE : GameResultTypes.BLACK;
      result.message = "Checkmate";
    }

    socket.emit("getMoveRepresentation", {
      move: lastMove,
      gameCode: gameCode,
      result: result,
      checkmate: ischeckmate,
      stalemate: isstalemate,
    });
  };

  /**
   * onClick Handler for a given piece click
   * Checks if a move is possible and performs if a source and destination cell exists
   * @param {PieceProps} piece The piece (or an empty cell) clicked upon
   */

  const squareOnClickHandler = (piece: PieceProps) => {
    const moves = new Hints(BoardConfig);
    if (checkPossibleMove(piece)) {
      const moveType = makeMove(clickedPiece, piece);
      moves.hideHints(hintCells);
    } else {
      const color = utils.getPieceColor(piece);
      if (color === currentTurn && color == playerColor) {
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
   * Returns the Board component
   * @returns {React.ReactElement} The Board React Component
   */

  return (
    <div className="outline-1">
      <File side={0} />
      <div className="outline-2">
        <Rank side={0} />
        <div className="board">{renderSquares()}</div>
        <Rank side={1} />
      </div>
      <File side={1} />
      <Modal show={gameComplete}>
        <Modal.Header>
          <Modal.Title>Game Over !</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`${gameResult}`}</Modal.Body>
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
      <PawnPromotionModal
        show={pawnPromotionType !== ""}
        setShow={setPawnPromotionType}
        socket={socket}
        promotionType={pawnPromotionType}
        fromPos={promotionPos[0]}
        toPos={promotionPos[1]}
        gameCode={gameCode}
      />
    </div>
  );
};

export default Board;
