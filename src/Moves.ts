import { PieceProps } from "./Piece";
import { BoardStatusProps } from "./components/Board";

/**
 * Class computing the valid movements for all chess pieces at a given board configuration
 * @property {Array<BoardStatusProps>} _cellStatus The state representing the board at the given instance
 */

class Moves {
  public cellStatus: Array<BoardStatusProps>;

  /**
   * @constructor
   * @param {Array<BoardStatusProps>} _cellStatus The state representing the board at the given instance
   */

  constructor(_cellStatus: Array<BoardStatusProps>) {
    this.cellStatus = _cellStatus;
  }

  /**
   * Get the color of a given `piece`
   * @param {PieceProps} piece
   * @returns {string} The color of the piece, 'white' (or) 'black'
   */

  protected getPieceColor(piece: PieceProps) {
    return piece.type.split("-")[0];
  }

  /**
   * Checks if a cell with the given coordinates exists on the board
   * If yes, checks if it is reachable by the piece
   * @param {number} x The x coordinate of the cell
   * @param {number} y The y coordinate of the cell
   * @param {string} color The color of the piece attempting to move into this cell
   * @returns {[boolean, boolean]} [possiblity of current move, possibility of next move \
   *                                 (in case the current cell has a piece)]
   */

  private checkCoordinateValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.cellStatus[index].piece.pieceName === null) {
        // empty cell
        return [true, true];
      } else if (this.getPieceColor(this.cellStatus[index].piece) !== color) {
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

  /**
   * Special function for Pawn, which moves forward only if empty cell exists
   * Checks if a cell with the given coordinates exists on the board
   * If yes, checks if it is reachable by the Pawn
   * @param {number} x The x coordinate of the cell
   * @param {number} y The y coordinate of the cell
   * @param {string} color The color of the Pawn attempting to move into this cell
   * @returns {[boolean, boolean]} [possiblity of current move, possibility of next move \
   *                                 (in case the current cell has a piece)]
   */

  private checkPawnMoveValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.cellStatus[index].piece.pieceName === null) {
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

  /**
   * Special function for Pawn, which attacks diagonally
   * Checks if a cell with the given coordinates exists on the board
   * If yes, checks if it is reachable by the Pawn
   * @param {number} x The x coordinate of the cell
   * @param {number} y The y coordinate of the cell
   * @param {string} color The color of the Pawn attempting to move into this cell
   * @returns {[boolean, boolean]} [possiblity of current move, possibility of next move \
   *                                 (in case the current cell has a piece)]
   */

  private checkPawnCaptureValidity(x: number, y: number, color: string) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (
        this.cellStatus[index].piece.pieceName !== null &&
        this.getPieceColor(this.cellStatus[index].piece) !== color
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

  /**
   * Get the x and y coordinates of the cell represented by `index`
   * @param {number} index The position of the cell (measured from board position a8)
   * @returns {[number, number]} [x, y], The x and y coordinates for `index`
   */

  private getCoordinates(index: number) {
    return [Math.floor(index / 8), index % 8];
  }

  /**
   * Get the index of a cell represented by the coordinates [x, y]
   * @param {number} x The x coordinate of the cell
   * @param {number} y The y coordinate of the cell
   * @returns {number} The index [0, 64) of the cell measured from board position a8
   */

  private getIndex(x: number, y: number) {
    return x * 8 + y;
  }

  /**
   * Get all valid moves and captures for the given Pawn `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Pawn
   */

  public getPawnMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    if (color === "white") {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x - 1, y, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x - 1, y)].piece);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x - 2, y, color);
        if (x == 6 && currMove) {
          moves.push(this.cellStatus[this.getIndex(x - 2, y)].piece);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y + 1, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x - 1, y + 1)].piece);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y - 1, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x - 1, y - 1)].piece);
      }
    } else {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x + 1, y, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x + 1, y)].piece);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x + 2, y, color);
        if (x == 1 && currMove) {
          moves.push(this.cellStatus[this.getIndex(x + 2, y)].piece);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y + 1, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x + 1, y + 1)].piece);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y - 1, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x + 1, y - 1)].piece);
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Rook `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Rook
   */

  public getRookMoves(piece: PieceProps) {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    for (let dx = 1; dx < 8 - x; dx++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx, y, color);
      if (currMove) {
        moves.push(this.cellStatus[this.getIndex(x + dx, y)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x + dx, y)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x, y + dy)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x, y + dy)].piece);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Knight `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Knight
   */

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
          this.cellStatus[this.getIndex(x + dx[index], y + dy[index])].piece
        );
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Bishop `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Bishop
   */

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
        moves.push(this.cellStatus[this.getIndex(x + index, y + index)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x + index, y + index)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x - index, y + index)].piece);
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
        moves.push(this.cellStatus[this.getIndex(x - index, y + index)].piece);
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Queen `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Queen
   */

  public getQueenMoves(piece: PieceProps) {
    let moves = new Array<PieceProps>();
    moves = [...moves, ...this.getBishopMoves(piece)];
    moves = [...moves, ...this.getRookMoves(piece)];
    return moves;
  }

  /**
   * Get all valid moves and captures for the given King `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given King
   */

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
          this.cellStatus[this.getIndex(x + dx[index], y + dy[index])].piece
        );
      }
    }
    return moves;
  }
}

export default Moves;
