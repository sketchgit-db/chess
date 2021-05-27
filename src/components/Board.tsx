import React from "react";
import Square from "./Square";
import PieceDetails from "../PieceDetails";
import Piece, { PieceProps } from "../Piece";
import Hints from "../Hints";
import "../styles.css";

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
}

/**
 * The Board component
 * Renders the board with all the pieces and handles piece movements and captures
 * @param {BoardProps} props The props passed by the `Game` component
 * @returns {React.ReactElement} React component
 */

const Board: React.FC<BoardProps> = (props) => {
  /**
   * Stores configuration of all pieces on the board
   */
  const PieceConfig: Array<PieceProps> = [];
  /**
   * A dummy Piece representing an empty cell for capture moves
   */
  const dummyPiece: PieceProps = new Piece("empty-cell", null, "", -1, 0);

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
  } = props;

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
   * RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w
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

    // RNBQKBNR
    for (let index = 0; index < 8; index++) {
      const _piece = new Piece(
        "white-piece",
        white_row[index].pieceName,
        white_row[index].label,
        index,
        white_row[index].value
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
    }
    // PPPPPPPP
    for (let index = 8; index < 16; index++) {
      const _piece = new Piece(
        "white-piece",
        PieceDetails.WHITE_PAWN.pieceName,
        PieceDetails.WHITE_PAWN.label,
        index,
        PieceDetails.WHITE_PAWN.value
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
    }
    // 8/8/8/8
    for (let index = 16; index < 48; index++) {
      const _piece = new Piece("empty-cell", null, "", index, 0);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
    }
    // pppppppp
    for (let index = 48; index < 56; index++) {
      const _piece = new Piece(
        "black-piece",
        PieceDetails.BLACK_PAWN.pieceName,
        PieceDetails.BLACK_PAWN.label,
        index,
        PieceDetails.BLACK_PAWN.value
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
    }
    // rnbqkbnr
    for (let index = 56; index < 64; index++) {
      const _piece = new Piece(
        "black-piece",
        black_row[index % 8].pieceName,
        black_row[index % 8].label,
        index,
        black_row[index % 8].value
      );
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
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
   * Update the score for the capturing piece
   * @param {PieceProps} from The capturing piece
   * @param {PieceProps} to The captured piece
   */
  const updateScores = (from: PieceProps, to: PieceProps) => {
    if (from.pieceName?.split("-")[0] === "white") {
      setWhitePoints(whitePoints + to.value);
    } else {
      setBlackPoints(blackPoints + to.value);
    }
  };

  /**
   * Performs the capture move
   * @param {PieceProps} from The capturing piece
   * @param {PieceProps} to The captured piece
   */

  const capture = (from: PieceProps, to: PieceProps) => {
    // TODO: Implement check and check-mate
    if (to.pieceName?.split("-")[1] === "king") {
      const posTo = to.position;
      BoardConfig[posTo].setColor("check");
    } else {
      const posFrom = from.position,
        posTo = to.position;
      dummyPiece.position = posFrom;
      from.position = posTo;
      to.position = posFrom;
      BoardConfig[posFrom].setPiece(dummyPiece);
      BoardConfig[posTo].setPiece(from);
      updateScores(from, to);
    }
  };

  /**
   * Perform the move (simple move (or) capture)
   * @param {PieceProps} from The piece attempting to move
   * @param {PieceProps} to The cell to which the move attempt is made
   */
  const makeMove = (from: PieceProps, to: PieceProps) => {
    if (to.pieceName === null) {
      const posFrom = from.position,
        posTo = to.position;
      console.log(posFrom, posTo);
      to.position = posFrom;
      from.position = posTo;
      BoardConfig[posFrom].setPiece(to);
      BoardConfig[posTo].setPiece(from);
    } else {
      capture(from, to);
    }
  };

  /**
   * Checks if a move is possible from the last clicked piece `clickedPiece` \
   *  to the current clicked piece `piece`
   * @param {PieceProps} piece
   * @returns {boolean} The possiblity of a move (true (or) false)
   */
  const checkPossibleMove = (piece: PieceProps) => {
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
    const moves = new Hints(BoardConfig, PieceConfig);
    if (checkPossibleMove(piece)) {
      makeMove(clickedPiece, piece);
      moves.hideHints(hintCells);
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
      updateClickedPiece(dummyPiece);
    } else {
      if (piece.pieceName?.split("-")[0] === currentTurn) {
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
   * @returns {Array<React.ReactElement>} Array of Rank divs
   */

  const getRanks = () => {
    const ranks = [];
    for (let index = 1; index <= 8; index++) {
      ranks.push(<div className="ranks">{index}</div>);
    }
    return ranks;
  };

  /**
   * Get the file labels for the chess board
   * @returns {Array<React.ReactElement>} Array of File divs
   */

  const getFiles = () => {
    const files = [];
    for (let index = 97; index <= 104; index++) {
      files.push(<div className="files">{String.fromCharCode(index)}</div>);
    }
    return files;
  };

  /**
   * Returns the Board component
   * @returns {React.ReactElement} The Board React Component
   */

  return (
    <div className="outline-1">
      <div className="file-list">{getFiles()}</div>
      <div className="outline-2">
        <div className="rank-list">{getRanks()}</div>
        <div className="board">{renderSquares()}</div>
        <div className="rank-list">{getRanks()}</div>
      </div>
      <div className="file-list">{getFiles()}</div>
    </div>
  );
};

export default Board;
