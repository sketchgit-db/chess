import React, { MouseEventHandler } from "react";
import { PieceProps } from "../Piece";
import "../styles.css";

export interface SquareProps {
  color: string;
  position: number;
  piece: PieceProps;
  onClick: (piece: PieceProps) => any;
}

const Square: React.FC<SquareProps> = (props) => {
  const className: string = props.color;
  const position: number = props.position;
  const piece: PieceProps = props.piece;

  const showMoves = () => {
    props.onClick(piece);
    if (piece.pieceName !== null) {
      console.log(
        `${piece.pieceName}: ${String.fromCharCode(97 + (piece.position % 8))}${
          1 + Math.floor(piece.position / 8)
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
