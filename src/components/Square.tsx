import React from "react";

import { PieceProps } from "../core/Piece";

import "../styles.css";

export interface SquareProps {
  color: string /** The color of the square cell */;
  position: number /** The index [0, 64) of the square cell measured from a8 on the board */;
  piece: PieceProps /** The piece (if any) on the square cell */;
  /** The onClick handler for the piece on the square cell */
  onClick: (piece: PieceProps) => any;
}

/**
 * The Square component
 * Returns the React Component for a given square cell on the board
 * @param {BoardProps} props The props passed by the `Board` component
 * @returns {React.ReactElement} React component
 */

const Square: React.FC<SquareProps> = (props) => {
  const className: string = props.color;
  const position: number = props.position;
  const piece: PieceProps = props.piece;

  /**
   * Shows the possible moves for the current square cell's piece
   */
  const showMoves = () => {
    if (piece.pieceName !== null) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `${piece.pieceName}: ${String.fromCharCode(97 + (piece.position % 8))}${8 - Math.floor(piece.position / 8)}`
        );
      }
    }
    props.onClick(piece);
  };

  /**
   * Returns the Square component
   * @returns {React.ReactElement} The Square component
   */
  return (
    <div className={className}>
      <button className={piece.type} onClick={showMoves}>
        {piece.label}
      </button>
    </div>
  );
};

export default Square;
