import React from "react";
import Square from "./Square";
import Piece from "../Piece";
import "../styles.css";

const Board = () => {
  const renderSquares = () => {
    const squares = [];
    const white_row = [
      Piece.WHITE_ROOK,
      Piece.WHITE_KNIGHT,
      Piece.WHITE_BISHOP,
      Piece.WHITE_QUEEN,
      Piece.WHITE_KING,
      Piece.WHITE_BISHOP,
      Piece.WHITE_KNIGHT,
      Piece.WHITE_ROOK,
    ];
    const black_row = [
      Piece.BLACK_ROOK,
      Piece.BLACK_KNIGHT,
      Piece.BLACK_BISHOP,
      Piece.BLACK_QUEEN,
      Piece.BLACK_KING,
      Piece.BLACK_BISHOP,
      Piece.BLACK_KNIGHT,
      Piece.BLACK_ROOK,
    ];

    for (let i = 0; i < 8; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="white-piece" piece={white_row[i]} />
        );
      } else {
        squares.push(
          <Square color="white" type="white-piece" piece={white_row[i]} />
        );
      }
    }
    for (let i = 8; i < 16; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="white-piece" piece={Piece.WHITE_PAWN} />
        );
      } else {
        squares.push(
          <Square color="white" type="white-piece" piece={Piece.WHITE_PAWN} />
        );
      }
    }
    for (let i = 16; i < 48; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(<Square color="black" type="" piece="" />);
      } else {
        squares.push(<Square color="white" type="" piece="" />);
      }
    }
    for (let i = 48; i < 56; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="black-piece" piece={Piece.BLACK_PAWN} />
        );
      } else {
        squares.push(
          <Square color="white" type="black-piece" piece={Piece.BLACK_PAWN} />
        );
      }
    }
    for (let i = 56; i < 64; i++) {
      if (parseInt(i / 8 + i) % 2) {
        squares.push(
          <Square color="black" type="black-piece" piece={black_row[i % 8]} />
        );
      } else {
        squares.push(
          <Square color="white" type="black-piece" piece={black_row[i % 8]} />
        );
      }
    }
    return squares;
  };

  return <div className="board">{renderSquares()}</div>;
};

export default Board;
