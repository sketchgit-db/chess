/**
 * Class representing the Chess Piece
 * @property {string} type The type (color) of the piece, 'white' (or) 'black'
 * @property {string | null} pieceName The name of the piece (such as white-pawn, black-rook, etc.)
 * @property {string} label The unicode string representation of the piece
 * @property {number} position The index [0, 64) of the piece on the board measured from position a8
 * @property {number} value The chess piece relative value of the `piece` \
 *                          (King is assigned value 0 for the sake of implementation)
 * @property {string} identifier Algebraic notation identifier for the `piece`
 * @property {number} numMoves The number of moves this piece has made in the game
 */

class Piece {
  public type: string;
  public pieceName: string | null;
  public label: string;
  public position: number;
  public value: number;
  public identifier: string;
  public numMoves: number;

  /**
   * @constructor
   * @param {string} _type
   * @param {string | null} _name
   * @param {string} _label
   * @param {number} _pos
   * @param {number} _value
   * @param {string} _indentifier
   * @param {number} _numMoves
   */
  constructor(
    _type: string,
    _name: string | null,
    _label: string,
    _pos: number,
    _value: number,
    _indentifier: string,
    _numMoves: number
  ) {
    this.type = _type;
    this.pieceName = _name;
    this.label = _label;
    this.position = _pos;
    this.value = _value;
    this.identifier = _indentifier;
    this.numMoves = _numMoves;
  }
}

/**
 * Interface extending the Piece class
 */

export interface PieceProps extends Piece {}

export default Piece;
