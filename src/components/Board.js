import React from "react";
import Square from "./Square";
import Piece from "../Piece";
import "../styles.css";

const Board = () => {
  const renderSquares = () => {
    const squares = [];
    const white_row = [
      Piece.WHITE_ROOK.label,
      Piece.WHITE_KNIGHT.label,
      Piece.WHITE_BISHOP.label,
      Piece.WHITE_QUEEN.label,
      Piece.WHITE_KING.label,
      Piece.WHITE_BISHOP.label,
      Piece.WHITE_KNIGHT.label,
      Piece.WHITE_ROOK.label,
    ];
    const black_row = [
      Piece.BLACK_ROOK.label,
      Piece.BLACK_KNIGHT.label,
      Piece.BLACK_BISHOP.label,
      Piece.BLACK_QUEEN.label,
      Piece.BLACK_KING.label,
      Piece.BLACK_BISHOP.label,
      Piece.BLACK_KNIGHT.label,
      Piece.BLACK_ROOK.label,
    ];

    for (let i = 0; i < 8; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="white-piece" position={i} piece={white_row[i]} />
        );
      } else {
        squares.push(
          <Square color="white" type="white-piece" position={i} piece={white_row[i]} />
        );
      }
    }
    for (let i = 8; i < 16; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="white-piece" position={i} piece={Piece.WHITE_PAWN.label} />
        );
      } else {
        squares.push(
          <Square color="white" type="white-piece" position={i} piece={Piece.WHITE_PAWN.label} />
        );
      }
    }
    for (let i = 16; i < 48; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(<Square color="black" type="" position={i} piece="" />);
      } else {
        squares.push(<Square color="white" type="" position={i} piece="" />);
      }
    }
    for (let i = 48; i < 56; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="black-piece" position={i} piece={Piece.BLACK_PAWN.label} />
        );
      } else {
        squares.push(
          <Square color="white" type="black-piece" position={i} piece={Piece.BLACK_PAWN.label} />
        );
      }
    }
    for (let i = 56; i < 64; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="black-piece" position={i} piece={black_row[i % 8]} />
        );
      } else {
        squares.push(
          <Square color="white" type="black-piece" position={i} piece={black_row[i % 8]} />
        );
      }
    }
    return squares;
  };

  const getRanks = () => {
    const ranks = [];
    for (let i = 1; i <= 8; i++) {
      ranks.push(<div className="ranks">{i}</div>)
    }
    return ranks;
  }

  const getFiles = () => {
    const files = [];
    for (let i = 97; i <= 104; i++) {
      files.push(<div className="files">{String.fromCharCode(i)}</div>)
    }
    return files;
  }

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
