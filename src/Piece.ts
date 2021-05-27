/**
 * Class representing the Chess Piece
 * @property {string} type The type (color) of the piece, 'white' (or) 'black'
 * @property {string | null} pieceName The name of the piece (such as white-pawn, black-rook, etc.)
 * @property {string} label The unicode string representation of the piece
 * @property {number} position The index [0, 64) of the piece on the board measured from position a1
 * @property {number} value The chess piece relative value of the `piece` \
 *                          (King is assigned value 0 for the sake of implementation)
 */

class Piece {
  public type: string;
  public pieceName: string | null;
  public label: string;
  public position: number;
  public value: number;

  /**
   * @constructor
   * @param {string} _type
   * @param {string | null} _name
   * @param {string} _label
   * @param {number} _pos
   * @param {number} _value
   */
  constructor(
    _type: string,
    _name: string | null,
    _label: string,
    _pos: number,
    _value: number
  ) {
    this.type = _type;
    this.pieceName = _name;
    this.label = _label;
    this.position = _pos;
    this.value = _value;
  }
}

/**
 * Interface extending the Piece class
 */

export interface PieceProps extends Piece {}

export default Piece;