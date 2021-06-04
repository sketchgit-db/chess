import { PieceProps } from "./Piece";
import { BoardStatusProps } from "./components/Board";
import Moves from "./Moves";

/**
 * Class representing the valid movements on UI for a given piece at a given board configuration
 * Extends the base class `Moves`
 * @property {Array<BoardStatusProps>} _BoardConfig The state representing the board at the given instance
 */

class Hints extends Moves {
  /**
   * @constructor
   * @param {Array<BoardStatusProps>} _BoardConfig The state representing the board at the given instance
   */

  constructor(_BoardConfig: Array<BoardStatusProps>) {
    super(_BoardConfig);
  }

  /**
   * Public wrapper over the `showValidMoves` function
   * Get the valid moves for a given `piece`
   * @param {PieceProps} piece The piece whose valid moves are to be found
   * @returns {Array<PieceProps>} An array containing the valid Moves
   */

  public showHints = (piece: PieceProps): Array<PieceProps> => {
    if (this.getPieceType(piece) !== null) {
      const validMoves = this.showValidMoves(piece);
      validMoves.forEach((_piece) => {
        const _index = _piece.position;
        this.BoardConfig[_index].setColor("selected");
      });
      return validMoves;
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
      this.BoardConfig[index].setColor(
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
