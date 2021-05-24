class Piece {
  public type: string;
  public pieceName: string;
  public label: string;
  public position: number;

  constructor(_type: string, _name: string, _label: string, _pos: number) {
    this.type = _type;
    this.pieceName = _name;
    this.label = _label;
    this.position = _pos;
  }
}

export interface PieceProps extends Piece {}

export default Piece;
