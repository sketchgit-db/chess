/**
 * Class representing the Chess Piece
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
   * @param {string} _type  The type (color) of the piece, 'white' (or) 'black'
   * @param {string | null} _name The name of the piece (such as white-pawn, black-rook, etc.)
   * @param {string} _label The unicode string representation of the piece
   * @param {number} _pos The index [0, 64) of the piece on the board measured from position a8
   * @param {number} _value The chess piece relative value of the `piece` \
   *                          (King is assigned value 0 for the sake of implementation)
   * @param {string} _indentifier Algebraic notation identifier for the `piece`
   * @param {number} _numMoves The number of moves this piece has made in the game
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
