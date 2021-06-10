import { PieceProps } from "./Piece";
import { BoardStatusProps } from "../components/Board";
import * as Utils from "../utils/helpers";

interface CheckProps {
  selfKingPos: number;
  oppKingPos: number;
  selfPossibleMoves: number[];
  oppPossibleMoves: number[];
  attackingPieces: number[];
}

enum MoveType {
  ANY = 0,
  CAPTURE = 1
}

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
      const index = Utils.getIndex(x, y);
      if (this.BoardConfig[index].piece.pieceName === null) {
        // empty cell
        return [true, true];
      } else if (Utils.getPieceColor(this.BoardConfig[index].piece) !== color) {
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

  private checkPawnMoveValidity(x: number, y: number, color: string): [boolean, boolean] {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const index = Utils.getIndex(x, y);
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
      const index = Utils.getIndex(x, y);
      if (
        this.BoardConfig[index].piece.pieceName !== null &&
        Utils.getPieceColor(this.BoardConfig[index].piece) !== color
      ) {
        // opponent cell
        return [true, false];
      } else {
        // self or empty cell
        return [false, false];
      }
    } else {
      return [false, true];
    }
  }

  /**
   * Get the valid moves for a given `piece`
   * @param {PieceProps} piece The piece whose valid moves are to be found
   * @returns {Array<number>} An array containing the valid Moves
   */

  protected showValidMoves = (piece: PieceProps, moveType: MoveType = MoveType.ANY): Array<number> => {
    const index = piece.position;
    const pieceName = Utils.getPieceName(piece);
    let validMoves: Array<number> = new Array<number>();
    switch (pieceName) {
      case "pawn":
        if (moveType === MoveType.CAPTURE) {
          validMoves = this.getPawnCaptureMoves(piece);
        } else {
          validMoves = this.getPawnMoves(piece);
        }
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
   * Check if a move by king at `pos0` to `pos1` doesn't cause it check
   * @param {number} pos0 The starting position of the king
   * @param {number} pos1 The destination of the king
   * @param {string} attackerColor The color of the piece opposite to the king
   * @returns {boolean} Whether the move from pos0 to pos1 is safe
   */

  public checkSafeAttack(pos0: number, pos1: number, attackerColor: string): boolean {
    // king tries to capture
    const [oldKingPos, oldKingType, oldKingName] = [
      pos0,
      this.BoardConfig[pos0].piece.type,
      this.BoardConfig[pos0].piece.pieceName,
    ];
    const [oldCapPos, oldCapType, oldCapName] = [
      pos1,
      this.BoardConfig[pos1].piece.type,
      this.BoardConfig[pos1].piece.pieceName,
    ];
    // swap
    this.BoardConfig[pos0].piece.position = oldCapPos;
    this.BoardConfig[pos0].piece.type = oldCapType;
    this.BoardConfig[pos0].piece.pieceName = oldCapName;

    this.BoardConfig[pos1].piece.position = oldKingPos;
    this.BoardConfig[pos1].piece.type = oldKingType;
    this.BoardConfig[pos1].piece.pieceName = oldKingName;

    const outVal = this.isCheck(attackerColor);

    // swap again
    this.BoardConfig[pos1].piece.position = oldCapPos;
    this.BoardConfig[pos1].piece.type = oldCapType;
    this.BoardConfig[pos1].piece.pieceName = oldCapName;

    this.BoardConfig[pos0].piece.position = oldKingPos;
    this.BoardConfig[pos0].piece.type = oldKingType;
    this.BoardConfig[pos0].piece.pieceName = oldKingName;

    return outVal.attackingPieces.length == 0;
  }

  /**
   * Determine if the king opposite to `piece` is in check by any pieces of the color of `piece`
   * @param {PieceProps} piece
   * @returns {[boolean, number, number, Array<number>]} The position of the king in check (if any, else -1)
   */

  public isCheck(attackerColor: string): CheckProps {
    const targetPiece = (attackerColor === "white" ? "black" : "white") + "-king";
    let outVal: CheckProps = { 
      selfKingPos: -1, 
      oppKingPos: -1, 
      selfPossibleMoves: [], 
      oppPossibleMoves: [], 
      attackingPieces: [],
    };
    for (let index = 0; index < 64; index++) {
      if (Utils.getPieceName(this.BoardConfig[index].piece) === null) {
        continue;
      } else {
        const moves = this.showValidMoves(this.BoardConfig[index].piece, MoveType.CAPTURE);
        if (Utils.getPieceColor(this.BoardConfig[index].piece) === attackerColor) {
          if (Utils.getPieceName(this.BoardConfig[index].piece) === "king") {
            outVal.selfKingPos = index;
          }
          outVal.selfPossibleMoves = [...outVal.selfPossibleMoves, ...moves];
          for (let pos = 0; pos < moves.length; pos++) {
            if (this.BoardConfig[moves[pos]].piece.pieceName === targetPiece) {
              outVal.oppKingPos = moves[pos];
              outVal.attackingPieces.push(index);
            }
          }
        } else {
          if (this.BoardConfig[index].piece.pieceName === targetPiece) {
            outVal.oppKingPos = index;
          } else {
            outVal.oppPossibleMoves = [...outVal.oppPossibleMoves, ...moves];
          } 
        }
      }
    }
    return outVal;
  }

  /**
   * Get all valid moves for the given Pawn `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given Pawn
   */

  public getPawnNormalMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    if (color === "white") {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x - 1, y, color);
      if (currMove) {
        moves.push(Utils.getIndex(x - 1, y));
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x - 2, y, color);
        if (x == 6 && currMove) {
          moves.push(Utils.getIndex(x - 2, y));
        }
      }
    } else {
      // Pawn free movement
      let [currMove, nextMove] = this.checkPawnMoveValidity(x + 1, y, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + 1, y));
      }
      if (nextMove === true) {
        let [currMove, nextMove] = this.checkPawnMoveValidity(x + 2, y, color);
        if (x == 1 && currMove) {
          moves.push(Utils.getIndex(x + 2, y));
        }
      }
    }
    return moves;
  }

  /**
   * Get all valid captures for the given Pawn `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given Pawn
   */

  public getPawnCaptureMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    if (color === "white") {
      let [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y + 1, color);
      if (currMove) {
        moves.push(Utils.getIndex(x - 1, y + 1));
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x - 1, y - 1, color);
      if (currMove) {
        moves.push(Utils.getIndex(x - 1, y - 1));
      }
    } else {
      let [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y + 1, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + 1, y + 1));
      }
      [currMove, nextMove] = this.checkPawnCaptureValidity(x + 1, y - 1, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + 1, y - 1));
      }
    }
    return moves;
  }


  /**
   * Get all valid moves and captures for the given Pawn `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given Pawn
   */

   public getPawnMoves(piece: PieceProps): Array<number> {
    let moves = Array<number>();
    moves = [...moves, ...this.getPawnNormalMoves(piece)];
    moves = [...moves, ...this.getPawnCaptureMoves(piece)];
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Rook `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given Rook
   */

  public getRookMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    for (let dx = 1; dx < 8 - x; dx++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx, y, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + dx, y));
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
        moves.push(Utils.getIndex(x + dx, y));
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
        moves.push(Utils.getIndex(x, y + dy));
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
        moves.push(Utils.getIndex(x, y + dy));
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
   * @returns {Array<number>} Valid moves for given Knight
   */

  public getKnightMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    const dx = [2, 2, -2, -2, 1, 1, -1, -1];
    const dy = [1, -1, 1, -1, 2, -2, 2, -2];
    for (let index = 0; index < 8; index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx[index], y + dy[index], color);
      if (currMove) {
        moves.push(Utils.getIndex(x + dx[index], y + dy[index]));
      }
    }
    return moves;
  }

  /**
   * Get all valid moves and captures for the given Bishop `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given Bishop
   */

  public getBishopMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    for (let index = 1; index < 8 - Math.max(x, y); index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + index, y + index, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + index, y + index));
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = -1; index >= -Math.min(x, y); index--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + index, y + index, color);
      if (currMove) {
        moves.push(Utils.getIndex(x + index, y + index));
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = 1; index <= Math.min(x, 7 - y); index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x - index, y + index, color);
      if (currMove) {
        moves.push(Utils.getIndex(x - index, y + index));
        if (nextMove === false) {
          break;
        }
      } else {
        break;
      }
    }
    for (let index = -1; index >= -Math.min(7 - x, y); index--) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x - index, y + index, color);
      if (currMove) {
        moves.push(Utils.getIndex(x - index, y + index));
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
   * @returns {Array<number>} Valid moves for given Queen
   */

  public getQueenMoves(piece: PieceProps): Array<number> {
    let moves = new Array<number>();
    moves = [...moves, ...this.getBishopMoves(piece)];
    moves = [...moves, ...this.getRookMoves(piece)];
    return moves;
  }

  private isSafe(position: number, attackerColor: string): boolean {
    let safe = true;
    for (let index = 0; index < 64; index++) {
      if (Utils.getPieceName(this.BoardConfig[index].piece) === null) {
        continue;
      } else if (Utils.getPieceColor(this.BoardConfig[index].piece) === attackerColor) {
        const moves = this.showValidMoves(this.BoardConfig[index].piece);
        if (moves.includes(position)) {
          return false;
        }
      }
    }
    return safe;
  }

  public isCastlePossible(fromPos: number, toPos: number): boolean {
    let isPossible = true;
    // rook should not have moved
    isPossible &&= this.BoardConfig[toPos].piece.numMoves === 0;
    if (isPossible === false) {
      return false;
    }

    const L = Math.min(fromPos, toPos) + 1,
      R = Math.max(fromPos, toPos) - 1;
    // all squares between are empty
    for (let index = L; index <= R; index++) {
      isPossible &&= Utils.getPieceName(this.BoardConfig[index].piece) === null;
      if (isPossible === false) {
        return false;
      }
    }

    const kingColor = Utils.getPieceColor(this.BoardConfig[fromPos].piece);
    const attackerColor = kingColor === "white" ? "black" : "white";

    if (fromPos < toPos) {
      // kingSide
      for (let index = fromPos; index <= fromPos + 2; index++) {
        isPossible &&= this.isSafe(index, attackerColor);
        if (isPossible === false) {
          return false;
        }
      }
    } else {
      // queenSide
      for (let index = fromPos; index >= fromPos - 2; index--) {
        isPossible &&= this.isSafe(index, attackerColor);
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

  public getCastlingMoves(kingPiece: PieceProps): Array<number> {
    let moves = new Array<number>();
    if (kingPiece.numMoves === 0) {
      const pieceColor = Utils.getPieceColor(kingPiece);
      const [x, y] = Utils.getCoordinates(kingPiece.position);
      const kingSideCastlePos = Utils.getIndex(x, y + 3);
      const queenSideCastlePos = Utils.getIndex(x, y - 4);

      let kingSideCastleValid = true;
      // piece should be rook
      kingSideCastleValid &&= this.BoardConfig[kingSideCastlePos].piece.pieceName === pieceColor + "-rook";
      kingSideCastleValid &&= this.isCastlePossible(kingPiece.position, kingSideCastlePos);

      if (kingSideCastleValid) {
        moves.push(kingSideCastlePos);
      }

      let queenSideCastleValid = true;
      // piece should be rook
      queenSideCastleValid &&= this.BoardConfig[queenSideCastlePos].piece.pieceName === pieceColor + "-rook";
      queenSideCastleValid &&= this.isCastlePossible(kingPiece.position, queenSideCastlePos);

      if (queenSideCastleValid) {
        moves.push(queenSideCastlePos);
      }
    }

    return moves;
  }

  /**
   * Get all valid moves and captures for the given King `piece`
   * @param {PieceProps} piece
   * @returns {Array<number>} Valid moves for given King
   */

  public getKingMoves(piece: PieceProps): Array<number> {
    const color = Utils.getPieceColor(piece);
    const [x, y] = Utils.getCoordinates(piece.position);
    let moves = [];
    const dx = [1, 1, 1, -1, -1, -1, 0, 0];
    const dy = [0, 1, -1, 0, 1, -1, 1, -1];
    for (let index = 0; index < 8; index++) {
      let [currMove, nextMove] = this.checkCoordinateValidity(x + dx[index], y + dy[index], color);
      if (currMove) {
        moves.push(Utils.getIndex(x + dx[index], y + dy[index]));
      }
    }
    moves = [...moves, ...this.getCastlingMoves(piece)];
    return moves;
  }
}

export default Moves;
