import { PieceProps } from "./Piece";
import Moves from "./Moves";

class Hints extends Moves {
  constructor(_cellStatus: any, _pieceStatus: Array<PieceProps>) {
    super(_cellStatus, _pieceStatus);
  }

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

export default Hints;
