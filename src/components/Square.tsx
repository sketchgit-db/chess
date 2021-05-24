import React from "react";
import { PieceProps } from "../Piece";
import "../styles.css";

export interface SquareProps {
  color: string;
  position: number;
  piece: PieceProps;
}

const Square: React.FC<SquareProps> = (props) => {
  const className: string = props.color;
  const position: number = props.position;
  const piece: PieceProps = props.piece;

  const showMoves = () => {
    if (piece.pieceName !== null) {
      const name = piece.pieceName.split("-")[1];
      const color = piece.pieceName.split("-")[0];
      console.log(
        `${piece.pieceName}: ${String.fromCharCode(97 + (position % 8))}${
          1 + Math.floor(position / 8)
        }`
      );
    }
  };

  return (
    <div className={className}>
      <button className={piece.type} onClick={showMoves}>
        {piece.label}
      </button>
    </div>
  );
};

export default Square;
