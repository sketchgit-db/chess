import PieceDetails, { PieceDetailsProps } from "../core/PieceDetails";
import Piece, { PieceProps } from "../core/Piece";

/**
 * Get a new piece (often used to create an empty cell on capture)
 * @param {number} position
 * @returns {PieceProps} The required Piece
 */

export const getEmptyCell = (position: number): PieceProps => {
  return new Piece("empty-cell", null, "", position, 0, "", 0);
};

/**
 * Get a new piece
 * @param {PieceDetailsProps} data The piece metadata
 * @returns {PieceProps} The required Piece
 */

export const getNewPiece = (
  pieceType: string,
  data: PieceDetailsProps,
  position: number
) => {
  return new Piece(
    pieceType,
    data.pieceName,
    data.label,
    position,
    data.value,
    data.identifier,
    0
  );
};

/**
 * Get the x and y coordinates of the cell represented by `index`
 * @param {number} index The position of the cell (measured from board position a8)
 * @returns {[number, number]} [x, y], The x and y coordinates for `index`
 */

export const getCoordinates = (index: number): [number, number] => {
  return [Math.floor(index / 8), index % 8];
};

/**
 * Get the index of a cell represented by the coordinates [x, y]
 * @param {number} x The x coordinate of the cell
 * @param {number} y The y coordinate of the cell
 * @returns {number} The index [0, 64) of the cell measured from board position a8
 */

export const getIndex = (x: number, y: number): number => {
  return x * 8 + y;
};

/**
 * Get the color of a given `piece`
 * @param {PieceProps} piece
 * @returns {string} The color of the piece, 'white' (or) 'black'
 */

export const getPieceColor = (piece: PieceProps): string => {
  return piece.type.split("-")[0];
};

/**
 * Get the name of `piece` (pawn, rook, etc.)
 * @param {PieceProps} piece
 * @returns {string | null} The name of the piece
 */

export const getPieceName = (piece: PieceProps) => {
  if (piece.pieceName === null) {
    return null;
  } else {
    return piece.pieceName.split("-")[1];
  }
};
