import { PieceProps } from "./Piece";

class Moves {
  public cellStatus: any;
  public pieceStatus: Array<PieceProps>;

  constructor(_cellStatus: any, _pieceStatus: Array<PieceProps>) {
    this.cellStatus = _cellStatus;
    this.pieceStatus = _pieceStatus;
  }

  private getPieceColor(piece: PieceProps) {
    return piece.type.split("-")[0];
  }

  private checkCoordinateValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.pieceStatus[index].pieceName === null) {
        // empty cell
        return [true, true];
      } else if (this.getPieceColor(this.pieceStatus[index]) !== color) {
        // opponent piece
        return [true, false];
      } else {
        // self piece
        return [false, false];
      }
    } else {
      return [false, true];
    }
  }

  private checkPawnMoveValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.pieceStatus[index].pieceName === null) {
        // empty cell
        return [true, true];
      } else {
        // self or opponent piece in straight line
        return [false, false];
      }
    } else {
      return [false, true];
    }
  }

  private checkPawnCaptureValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (
        this.pieceStatus[index].pieceName !== null &&
        this.getPieceColor(this.pieceStatus[index]) !== color
      ) {
        // opponent cell
        return [true, true];
      } else {
        // self or empty cell
        return [false, false];
      }
    } else {
      return [false, true];
    }
  }

  private getCoordinates(index: number) {
    return [Math.floor(index / 8), index % 8];
  }

  private getIndex(x: number, y: number) {
    return x * 8 + y;
  }

  public getPawnMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    if (color === "white") {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x + 1, y, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + 1, y)]);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x + 2, y, color);
        if (x == 1 && currMove) {
          moves.push(this.pieceStatus[this.getIndex(x + 2, y)]);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y + 1, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + 1, y + 1)]);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y - 1, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + 1, y - 1)]);
      }
    } else {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x - 1, y, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x - 1, y)]);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x - 2, y, color);
        if (x == 6 && currMove) {
          moves.push(this.pieceStatus[this.getIndex(x - 2, y)]);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y + 1, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x - 1, y + 1)]);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y - 1, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x - 1, y - 1)]);
      }
    }
    return moves;
  }

  public getRookMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    for (let dx = 1; dx < 8 - x; dx++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx, y, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + dx, y)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let dx = -1; dx >= -x; dx--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx, y, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + dx, y)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let dy = 1; dy < 8 - y; dy++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x, y + dy, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x, y + dy)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let dy = -1; dy >= -y; dy--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x, y + dy, color);
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x, y + dy)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    return moves;
  }

  public getKnightMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    const dx = [2, 2, -2, -2, 1, 1, -1, -1];
    const dy = [1, -1, 1, -1, 2, -2, 2, -2];
    for (let index = 0; index < 8; index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x + dx[index],
        y + dy[index],
        color
      );
      if (currMove) {
        moves.push(
          this.pieceStatus[this.getIndex(x + dx[index], y + dy[index])]
        );
      }
    }
    return moves;
  }

  public getBishopMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    for (let index = 1; index < 8 - Math.max(x, y); index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x + index,
        y + index,
        color
      );
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + index, y + index)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = -1; index >= -Math.min(x, y); index--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x + index,
        y + index,
        color
      );
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x + index, y + index)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = 1; index <= Math.min(x, 7 - y); index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x - index,
        y + index,
        color
      );
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x - index, y + index)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = -1; index >= -Math.min(7 - x, y); index--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x - index,
        y + index,
        color
      );
      if (currMove) {
        moves.push(this.pieceStatus[this.getIndex(x - index, y + index)]);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    return moves;
  }

  public getQueenMoves(piece: PieceProps) {
    let moves = new Array<PieceProps>();
    moves = [...moves, ...this.getBishopMoves(piece)];
    moves = [...moves, ...this.getRookMoves(piece)];
    return moves;
  }

  public getKingMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    const dx = [1, 1, 1, -1, -1, -1, 0, 0];
    const dy = [0, 1, -1, 0, 1, -1, 1, -1];
    for (let index = 0; index < 8; index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(
        x + dx[index],
        y + dy[index],
        color
      );
      if (currMove) {
        moves.push(
          this.pieceStatus[this.getIndex(x + dx[index], y + dy[index])]
        );
      }
    }
    return moves;
  }
}

export default Moves;
