import { PieceProps } from "./Piece";
import Moves from "./Moves";

class Hints extends Moves {
  public cellStatus: any;

  constructor(_cellStatus: any) {
    super();
    this.cellStatus = _cellStatus;
  }

  private showValidMoves = (piece: PieceProps) => {
    const index = piece.position;
    this.cellStatus[index].setColor("selected");
    return new Array(piece);
  };

  public showHints = (piece: PieceProps) => {
    if (piece.pieceName !== null) {
      return this.showValidMoves(piece); 
    } else {
      return new Array<PieceProps>();
    }
  };

  public hideHints = (hintCells: Array<PieceProps>) => {
    hintCells.forEach((piece) => {
      const index = piece.position;
      this.cellStatus[index].setColor(
        Math.floor(index / 8 + index) % 2 ? "black" : "white"
      );
    });
  };
}

export interface HintProps extends Hints {}

// const Hints = (pieceStatus: any, cellStatus: any) => {

//   const showValidMoves = () => {
//     cellStatus.setColor("selected");
//   };

//   showValidMoves();

//   const makeMove = () => {

//   };

//   return null;
// };

export default Hints;
