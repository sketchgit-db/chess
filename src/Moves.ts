import { PieceProps } from "./Piece";
import { BoardStatusProps } from "./components/Board";

/**
 * Class computing the valid movements for all chess pieces at a given board configuration
 * @property {Array<BoardStatusProps>} _BoardConfig The state representing the board at the given instance
 */

class Moves {
  public BoardConfig: Array<BoardStatusProps>;

  /**
   * @constructor
   * @param {Array<BoardStatusProps>} _BoardConfig The state representing the board at the given instance
   */

  constructor(_BoardConfig: Array<BoardStatusProps>) {
    this.BoardConfig = _BoardConfig;
  }

  /**
   * Get the color of a given `piece`
   * @param {PieceProps} piece
   * @returns {string} The color of the piece, 'white' (or) 'black'
   */

  protected getPieceColor(piece: PieceProps): string {
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

  private checkCoordinateValidity(x: number, y: number, color: string): [boolean, boolean] {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.BoardConfig[index].piece.pieceName === null) {
        // empty cell
        return [true, true];
      } else if (this.getPieceColor(this.BoardConfig[index].piece) !== color) {
        // opponent piece
        if (this.getPieceType(this.BoardConfig[index].piece) !== "king") {
          return [true, false];
        } else {
          return [false, false];
        }
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

  private checkPawnMoveValidity(x: number, y: number, color: string): [boolean, boolean] {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (this.BoardConfig[index].piece.pieceName === null) {
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

  private checkPawnCaptureValidity(x: number, y: number, color: string): [boolean, boolean] {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = this.getIndex(x, y);
      if (
        this.BoardConfig[index].piece.pieceName !== null &&
        this.getPieceColor(this.BoardConfig[index].piece) !== color
      ) {
        // opponent cell
        if (this.getPieceType(this.BoardConfig[index].piece) !== "king") {
          return [true, false];
        } else {
          return [false, false];
        }
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

  private getCoordinates(index: number): [number, number] {
    return [Math.floor(index / 8), index % 8];
  }

  /**
   * Get the index of a cell represented by the coordinates [x, y]
   * @param {number} x The x coordinate of the cell
   * @param {number} y The y coordinate of the cell
   * @returns {number} The index [0, 64) of the cell measured from board position a8
   */

  private getIndex(x: number, y: number): number {
    return x * 8 + y;
  }

  /**
   * Get the type of `piece`
   * @param {PieceProps} piece 
   * @returns {string | null} The type of the piece
   */

  protected getPieceType(piece: PieceProps) {
    if (piece.pieceName === null) {
      return null;
    } else {
      return piece.pieceName.split("-")[1];
    }
  }

  /**
   * Get the valid moves for a given `piece`
   * @param {PieceProps} piece The piece whose valid moves are to be found
   * @returns {Array<PieceProps>} An array containing the valid Moves
   */

   protected showValidMoves = (piece: PieceProps): Array<PieceProps> => {
    const index = piece.position;
    const pieceName = this.getPieceType(piece);
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
    return validMoves;
  };

  /**
   * Determine if the king opposite to `piece` is in check by any pieces of the color of `piece`
   * @param {PieceProps} piece
   * @returns {[boolean, number, number, Array<PieceProps>]} The position of the king in check (if any, else -1)
   */

   public isCheck(piece: PieceProps): [boolean, number, number, Array<PieceProps>] {
    const attackerColor = this.getPieceColor(piece);
    const targetPiece =
      (attackerColor === "white" ? "black" : "white") + "-king";
    let possibleMoves = new Array<PieceProps>();
    let oppKingPos = -1, selfKingPos = -1, found = false;
    for (let index = 0; index < 64; index++) {
      if (this.getPieceType(this.BoardConfig[index].piece) === null) {
        continue;
      } else if (
        this.getPieceColor(this.BoardConfig[index].piece) === attackerColor
      ) {
        if (this.getPieceType(this.BoardConfig[index].piece) === "king") {
          selfKingPos = index;
        }
        const moves = this.showValidMoves(this.BoardConfig[index].piece);
        possibleMoves = [...possibleMoves, ...moves];
        for (let pos = 0; pos < moves.length; pos++) {
          if (moves[pos].pieceName === targetPiece) {
            oppKingPos = moves[pos].position;
            found = true;
          }
        }
      } else if (this.BoardConfig[index].piece.pieceName === targetPiece) {
        oppKingPos = index;
      }
    }
    return [found, selfKingPos, oppKingPos, possibleMoves];
  }

  /**
   * Get all valid moves and captures for the given Pawn `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Pawn
   */

  public getPawnMoves(piece: PieceProps): Array<PieceProps> {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    if (color === "white") {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x - 1, y, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x - 1, y)].piece);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x - 2, y, color);
        if (x == 6 && currMove) {
          moves.push(this.BoardConfig[this.getIndex(x - 2, y)].piece);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y + 1, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x - 1, y + 1)].piece);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y - 1, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x - 1, y - 1)].piece);
      }
    } else {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x + 1, y, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x + 1, y)].piece);
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x + 2, y, color);
        if (x == 1 && currMove) {
          moves.push(this.BoardConfig[this.getIndex(x + 2, y)].piece);
        }
      }
      // Pawn capture
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y + 1, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x + 1, y + 1)].piece);
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y - 1, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x + 1, y - 1)].piece);
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Rook `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given Rook
   */

  public getRookMoves(piece: PieceProps): Array<PieceProps> {
    const color = this.getPieceColor(piece);
    const [x, y] = this.getCoordinates(piece.position);
    let moves = new Array<PieceProps>(piece);
    for (let dx = 1; dx < 8 - x; dx++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx, y, color);
      if (currMove) {
        moves.push(this.BoardConfig[this.getIndex(x + dx, y)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x + dx, y)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x, y + dy)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x, y + dy)].piece);
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

  public getKnightMoves(piece: PieceProps): Array<PieceProps> {
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
          this.BoardConfig[this.getIndex(x + dx[index], y + dy[index])].piece
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

  public getBishopMoves(piece: PieceProps): Array<PieceProps> {
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
        moves.push(this.BoardConfig[this.getIndex(x + index, y + index)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x + index, y + index)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x - index, y + index)].piece);
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
        moves.push(this.BoardConfig[this.getIndex(x - index, y + index)].piece);
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

  public getQueenMoves(piece: PieceProps): Array<PieceProps> {
    let moves = new Array<PieceProps>();
    moves = [...moves, ...this.getBishopMoves(piece)];
    moves = [...moves, ...this.getRookMoves(piece)];
    return moves;
  }

  private isSafe(position: number, attackerColor: string): boolean {
    let safe = true;
    for (let index = 0; index < 64; index++) {
      if (this.getPieceType(this.BoardConfig[index].piece) === null) {
        continue;
      } else if (this.getPieceColor(this.BoardConfig[index].piece) === attackerColor) {
        const moves = this.showValidMoves(this.BoardConfig[index].piece);
        if (moves.includes(this.BoardConfig[position].piece)) {
          return false;
        }
      }
    }
    return safe;
  }

  public isCastlePossible(fromPos: number, toPos: number): boolean {
    let isPossible = true;
    // rook should not have moved
    isPossible &&= (this.BoardConfig[toPos].piece.numMoves === 0);
    if (isPossible === false) {
      return false;
    }

    const L = Math.min(fromPos, toPos) + 1, R = Math.max(fromPos, toPos) - 1;
    // all squares between are empty
    for (let index = L; index <= R; index++) {
      isPossible &&= (this.getPieceType(this.BoardConfig[index].piece) === null);
      if (isPossible === false) {
        return false;
      }
    }

    const kingColor = this.getPieceColor(this.BoardConfig[fromPos].piece);
    const attackerColor = (kingColor === "white" ? "black" : "white");

    if (fromPos < toPos) { // kingSide
      for (let index = fromPos; index <= fromPos + 2; fromPos++) {
        isPossible &&= (this.isSafe(index, attackerColor));
        if (isPossible === false) {
          return false;
        }
      }
    } else { // queenSide
      for (let index = fromPos; index >= fromPos - 2; fromPos--) {
        isPossible &&= (this.isSafe(index, attackerColor));
        if (isPossible === false) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get the possible castling moves
   * @param {PieceProps} kingPiece The king piece for whom possible castling moves are to be found
   * @returns The possible castling moves
   */

  public getCastlingMoves(kingPiece: PieceProps): Array<PieceProps> {
    let moves = new Array<PieceProps>();
    if (kingPiece.numMoves === 0) {
      const pieceColor = this.getPieceColor(kingPiece);
      const [x, y] = this.getCoordinates(kingPiece.position);
      const kingSideCastlePos = this.getIndex(x, y + 3);
      const queenSideCastlePos = this.getIndex(x, y - 4);

      let kingSideCastleValid = true;
      // piece should be rook
      kingSideCastleValid &&= (this.BoardConfig[kingSideCastlePos].piece.pieceName === (pieceColor + "-rook"));
      kingSideCastleValid &&= this.isCastlePossible(kingPiece.position, kingSideCastlePos);

      if (kingSideCastleValid) {

      }

      let queenSideCastleValid = true;
      // piece should be rook
      queenSideCastleValid &&= (this.BoardConfig[queenSideCastlePos].piece.pieceName === (pieceColor + "-rook"));
      queenSideCastleValid &&= this.isCastlePossible(kingPiece.position, queenSideCastlePos);

      if (queenSideCastleValid) {

      }
    }

    return moves;
  }

  /**
   * Get all valid moves and captures for the given King `piece`
   * @param {PieceProps} piece
   * @returns {Array<PieceProps>} Valid moves for given King
   */

  public getKingMoves(piece: PieceProps): Array<PieceProps> {
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
          this.BoardConfig[this.getIndex(x + dx[index], y + dy[index])].piece
        );
      }
    }
    return moves;
  }
}

export default Moves;
