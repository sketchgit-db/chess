import React from "react";
import Square from "./Square";
import PieceDetails from "../PieceDetails";
import Piece, { PieceProps } from "../Piece";
import Hints from "../Hints";
import "../styles.css";

export interface BoardStatusProps {
  color: string;
  setColor: any;
}

const Board: React.FC = () => {
  const PieceConfig: Array<PieceProps> = [];
  const squares: any = [];

  const initBoardColors = () => {
    const BoardConfig: Array<BoardStatusProps> = [];
    for (let index = 0; index < 64; index++) {
      if (Math.floor(index / 8 + index) % 2) {
        const [color, setColor] = React.useState("black");
        BoardConfig.push({
          color: color,
          setColor: setColor,
        });
      } else {
        const [color, setColor] = React.useState("white");
        BoardConfig.push({
          color: color,
          setColor: setColor,
        });
      }
    }
    return BoardConfig;
  };

  const BoardConfig = initBoardColors();
  const [hintCells, updateHintCells] = React.useState(Array<PieceProps>());

  const squareOnClickHandler = (piece: PieceProps) => {
    const moves = new Hints(BoardConfig, PieceConfig);
    moves.hideHints(hintCells);
    const validMoves = moves.showHints(piece);
    updateHintCells(validMoves);
  };

  const renderSquares = () => {
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
        index
      );
      squares.push(
        <Square
          color={BoardConfig[index].color}
          position={index}
          piece={_piece}
          onClick={squareOnClickHandler}
        />
      );
      PieceConfig.push(_piece);
    }
    for (let index = 8; index < 16; index++) {
      const _piece = new Piece(
        "white-piece",
        PieceDetails.WHITE_PAWN.pieceName,
        PieceDetails.WHITE_PAWN.label,
        index
      );
      squares.push(
        <Square
          color={BoardConfig[index].color}
          position={index}
          piece={_piece}
          onClick={squareOnClickHandler}
        />
      );
      PieceConfig.push(_piece);
    }
    for (let index = 16; index < 48; index++) {
      const _piece = new Piece("empty-cell", null, "", index);
      squares.push(
        <Square
          color={BoardConfig[index].color}
          position={index}
          piece={_piece}
          onClick={squareOnClickHandler}
        />
      );
      PieceConfig.push(_piece);
    }
    for (let index = 48; index < 56; index++) {
      const _piece = new Piece(
        "black-piece",
        PieceDetails.BLACK_PAWN.pieceName,
        PieceDetails.BLACK_PAWN.label,
        index
      );
      squares.push(
        <Square
          color={BoardConfig[index].color}
          position={index}
          piece={_piece}
          onClick={squareOnClickHandler}
        />
      );
      PieceConfig.push(_piece);
    }
    for (let index = 56; index < 64; index++) {
      const _piece = new Piece(
        "black-piece",
        black_row[index % 8].pieceName,
        black_row[index % 8].label,
        index
      );
      squares.push(
        <Square
          color={BoardConfig[index].color}
          position={index}
          piece={_piece}
          onClick={squareOnClickHandler}
        />
      );
      PieceConfig.push(_piece);
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
