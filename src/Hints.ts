import { PieceProps } from "./Piece";
import Moves from "./Moves";

/**
 * Class representing the valid movements on UI for a given piece at a given board configuration
 * Extends the base class `Moves`
 * @property {any} _cellStatus The state representing the board at the given instance
 * @property {Array<PieceProps>} _pieceStatus The state representing the Pieces at the given instance
 */

class Hints extends Moves {
  /**
   * @constructor
   * @param {any} _cellStatus The state representing the board at the given instance
   * @param {Array<PieceProps>} _pieceStatus The state representing the Pieces at the given instance
   */

  constructor(_cellStatus: any, _pieceStatus: Array<PieceProps>) {
    super(_cellStatus, _pieceStatus);
  }

  /**
   * Get the valid moves for a given `piece`
   * @param {PieceProps} piece The piece whose valid moves are to be found
   * @returns {Array<PieceProps>} An array containing the valid Moves
   */

  private showValidMoves = (piece: PieceProps) => {
    const index = piece.position;
    const pieceName = piece.pieceName?.split("-")[1];
    let validMoves: Array<PieceProps> = new Array<PieceProps>();
    switch (pieceName) {
      case "pawn":
        validMoves = this.getPawnMoves(piece);
        break;
      case "rook":
        validMoves = this.getRookMoves(piece);
        break;
      case "knight":
        validMoves = this.getKnightMoves(piece);
        break;
      case "bishop":
        validMoves = this.getBishopMoves(piece);
        break;
      case "queen":
        validMoves = this.getQueenMoves(piece);
        break;
      case "king":
        validMoves = this.getKingMoves(piece);
        break;
    }
    console.log(validMoves);
    validMoves.forEach((_piece) => {
      const _index = _piece.position;
      this.cellStatus[_index].setColor("selected");
    });
    return validMoves;
  };

  /**
   * Public wrapper over the `showValidMoves` function
   * Get the valid moves for a given `piece`
   * @param {PieceProps} piece The piece whose valid moves are to be found
   * @returns {Array<PieceProps>} An array containing the valid Moves
   */

  public showHints = (piece: PieceProps) => {
    if (piece.pieceName !== null) {
      return this.showValidMoves(piece);
    } else {
      return new Array<PieceProps>();
    }
  };

  /**
   * Hide the validMoves, usually when a move is made or a different piece is considered
   * @param {Array<PieceProps>} hintCells Array of valid moves computed using `showHints`
   */

  public hideHints = (hintCells: Array<PieceProps>) => {
    hintCells.forEach((piece) => {
      const index = piece.position;
      this.cellStatus[index].setColor(
        Math.floor(index / 8 + index) % 2 ? "black" : "white"
      );
    });
  };
}

/**
 * Interface extending Hints
 */

export interface HintProps extends Hints {}

export default Hints;
