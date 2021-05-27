import React from "react";
import Square from "./Square";
import PieceDetails from "../PieceDetails";
import Piece, { PieceProps } from "../Piece";
import Hints from "../Hints";
import "../styles.css";

export interface BoardStatusProps {
  piece: PieceProps;
  setPiece: any;
  color: string;
  setColor: any;
}

export interface BoardProps {
  currentTurn: string;
  setCurrentTurn: any;
  whitePoints: number;
  setWhitePoints: any;
  blackPoints: number;
  setBlackPoints: any;
}

const Board: React.FC<BoardProps> = (props) => {
  const PieceConfig: Array<PieceProps> = [];
  const squares: any = [];
  const dummyPiece: PieceProps = new Piece("empty-cell", null, "", -1, 0);
  const {
    currentTurn,
    setCurrentTurn,
    whitePoints,
    setWhitePoints,
    blackPoints,
    setBlackPoints,
  } = props;

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
    for (let index = 16; index < 48; index++) {
      const _piece = new Piece("empty-cell", null, "", index, 0);
      BoardConfig = [...BoardConfig, updateBoardConfig(index, _piece)];
      PieceConfig.push(BoardConfig[index].piece);
    }
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

  const BoardConfig = initBoardColors();
  const [hintCells, updateHintCells] = React.useState(Array<PieceProps>());
  const [clickedPiece, updateClickedPiece] = React.useState(dummyPiece);

  const updateScores = (from: PieceProps, to: PieceProps) => {
    if (from.pieceName?.split("-")[0] === "white") {
      setWhitePoints(whitePoints + to.value);
    } else {
      setBlackPoints(blackPoints + to.value);
    }
  };

  const capture = (from: PieceProps, to: PieceProps) => {
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

  const checkPossibleMove = (piece: PieceProps) => {
    const index = piece.position;
    return (
      piece.position !== clickedPiece.position &&
      BoardConfig[index].color === "selected"
    );
  };

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

  const renderSquares = () => {
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

  const getRanks = () => {
    const ranks = [];
    for (let index = 1; index <= 8; index++) {
      ranks.push(<div className="ranks">{index}</div>);
    }
    return ranks;
  };

  const getFiles = () => {
    const files = [];
    for (let index = 97; index <= 104; index++) {
      files.push(<div className="files">{String.fromCharCode(index)}</div>);
    }
    return files;
  };

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
