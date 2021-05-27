class Piece {
  public type: string;
  public pieceName: string | null;
  public label: string;
  public position: number;
  public value: number;

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

export interface PieceProps extends Piece {}

export default Piece;
