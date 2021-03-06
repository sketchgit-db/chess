import { PieceProps } from "./Piece";
import { BoardStatusProps } from "../components/Board";
import * as Utils from "../utils/helpers";

interface CheckProps {
  selfKingPos: number /** Position of king of the attacking piece */;
  oppKingPos: number /** Position of king of the opponent type */;
  selfPossibleMoves: number[] /** Possible moves for self king */;
  oppPossibleMoves: number[] /** Possible moves for the opponent's king */;
  attackingPieces: number[] /** List of pieces giving check to the opponent king */;
}

enum MoveType {
  ANY = 0 /** Normal move or Capture */,
  CAPTURE = 1,
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

  protected getMoves = (piece: PieceProps, moveType: MoveType = MoveType.ANY): Array<number> => {
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
   * TODO
   * Removes all moves which cause immediate check to the `piece`'s king
   * @param {PieceProps} piece The piece under consideration
   * @param {number[]} moves The list of all possible moves for `piece`
   * @returns
   */

  public removeInValidMoves(piece: PieceProps, moves: number[]) {
    const from = piece.position;
    const attackerColor = Utils.opponentColor(piece);
    let validMoves = [];
    moves.forEach((to) => {
      if(this.checkMoveSafety(from, to, attackerColor)) {
        validMoves.push(to);
      }
    });
    return moves;
  }

  /**
   * TODO
   * Determine if the king opposite to `piece` is in stalemate
   * @param {string} attackerColor
   * @returns {boolean} The status of the stalemate
   */

  public isStaleMate(attackerColor: string): boolean {
    for (let index = 0; index < 64; index++) {
      if (Utils.getPieceName(this.BoardConfig[index].piece) === null) {
        continue;
      } else if (Utils.getPieceColor(this.BoardConfig[index].piece) !== attackerColor) {
        const moves = this.removeInValidMoves(
          this.BoardConfig[index].piece,
          this.getMoves(this.BoardConfig[index].piece)
        );
        if (moves.length > 0) {
          return false;
        }
      }
    }
    return false;
  }

  /**
   * Check if a move by from `from` to `to` doesn't lead to check by `attackerColor` pieces
   * @param {number} from The starting position of the moving piece
   * @param {number} to The destination of the moving piece
   * @param {string} attackerColor The color of the piece opposite to the moving piece
   * @returns {boolean} Whether the move from from to to is safe
   */

  public checkMoveSafety(from: number, to: number, attackerColor: string): boolean {

    const [fromType, fromName] = [this.BoardConfig[from].piece.type, this.BoardConfig[from].piece.pieceName];
    const [toType, toName] = [this.BoardConfig[to].piece.type, this.BoardConfig[to].piece.pieceName];

    // attempt move from from (becomes empty) to to (moving piece)
    this.BoardConfig[from].piece.type = "empty-cell";
    this.BoardConfig[from].piece.pieceName = null;

    this.BoardConfig[to].piece.type = fromType;
    this.BoardConfig[to].piece.pieceName = fromName;

    const outVal = this.isCheck(attackerColor);

    // undo the move
    this.BoardConfig[from].piece.type = fromType;
    this.BoardConfig[from].piece.pieceName = fromName;

    this.BoardConfig[to].piece.type = toType;
    this.BoardConfig[to].piece.pieceName = toName;

    return outVal.attackingPieces.length == 0;
  }

  /**
   * Check if the king with `validKingMoves` can move given the opponent's `oppMoves`
   * @param {number[]} validKingMoves
   * @param {number[]} oppMoves
   * @returns {boolean} Whether there exists a cell to which the king can move
   */

  public canKingMove(kingPos: number, validKingMoves: number[], oppMoves: number[]): boolean {
    for (let pos = 0; pos < validKingMoves.length; pos++) {
      if (oppMoves.includes(validKingMoves[pos])) {
        continue;
      } else if (Utils.getPieceName(this.BoardConfig[validKingMoves[pos]].piece) === null) {
        // empty cell not under attack => can move
        if (process.env.NODE_ENV === "development") {
          console.log("canKingMove - empty cell", kingPos, this.BoardConfig[validKingMoves[pos]].piece)
        }
        return true;
      } else {
        // capture by king
        const attackedPiece = this.BoardConfig[validKingMoves[pos]].piece;
        if (this.checkMoveSafety(kingPos, validKingMoves[pos], Utils.getPieceColor(attackedPiece))) {
          if (process.env.NODE_ENV === "development") {
            console.log("canKingMove - king capture", kingPos, this.BoardConfig[validKingMoves[pos]].piece)
          }
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get whether the king at `kingPos` is checkmate by the opponent
   * @param {number} kingPos The position of the king under check
   * @param {number[]} oppMoves The list of capture moves available to the opponent piece
   * @param {number[]} selfMoves The list of moves (simple move by pawn included) by the pieces of the king's type
   * @param {number[]} attacks The list of pieces putting the king in check
   * @returns {boolean} Whether the king at `kingPos` is checkmate by the opponent
   */

  public isCheckMate(kingPos: number, oppMoves: number[], selfMoves: number[], attacks: number[]) {
    const validKingMoves = this.getKingMoves(this.BoardConfig[kingPos].piece, true);
    if (attacks.length > 1) {
      // Only way out => king to move (or capture)
      const cannotMove = validKingMoves.every((val) => oppMoves.includes(val));
      if (cannotMove) {
        return true;
      } else {
        return !this.canKingMove(kingPos, validKingMoves, oppMoves);
      }
    } else {
      const attacker = attacks[0];
      if (selfMoves.includes(attacker)) {
        if (process.env.NODE_ENV === "development") {
          console.log("capture by non - king ", attacker, selfMoves);
        }
        // capture the attacking piece by non - king
        return false;
      } else if (
        validKingMoves.includes(attacker) &&
        this.checkMoveSafety(kingPos, attacker, Utils.getPieceColor(this.BoardConfig[attacker].piece))
      ) {
        if (process.env.NODE_ENV === "development") {
          console.log("capture by king", validKingMoves, attacker);
        }
        // capture by king
        return false;
      } else if (this.canKingMove(kingPos, validKingMoves, oppMoves)) {
        // move king to other cell
        return false;
      } else {
        // insert a piece in the way of king and attacker
        if (Utils.getPieceName(this.BoardConfig[attacker].piece) !== "knight") {
          const [x0, y0] = Utils.getCoordinates(kingPos);
          const [x1, y1] = Utils.getCoordinates(attacker);
          const available = new Array<number>();
          if (y1 - y0 === x1 - x0) {
            // diagonal
            for (let p = Math.min(x0, x1) + 1; p <= Math.max(x0, x1) - 1; p++) {
              available.push(Utils.getIndex(p, p + y0 - x0));
            }
          } else if (y1 - y0 == x0 - x1) {
            // diagonal
            for (let p = Math.min(x0, x1) + 1; p <= Math.max(x0, x1) - 1; p++) {
              available.push(Utils.getIndex(p, -p + y0 + x0));
            }
          } else if (x0 == x1) {
            // row-wise
            for (let y = Math.min(y0, y1) + 1; y <= Math.max(y0, y1) - 1; y++) {
              available.push(Utils.getIndex(x0, y));
            }
          } else if (y0 === y1) {
            // col-wise
            for (let x = Math.min(x0, x1) + 1; x <= Math.max(x0, x1) - 1; x++) {
              available.push(Utils.getIndex(x, y0));
            }
          }
          if (process.env.NODE_ENV === "development") {
            console.log("insert a piece in the way ", selfMoves, available);
          }
          for (let index = 0; index < available.length; index++) {
            if (selfMoves.includes(available[index])) {
              return false;
            }
          }
        }
      }
      return true;
    }
  }

  /**
   * Determine if the king opposite to `piece` is in check by any pieces of the color of `piece`
   * @param {string} attackerColor
   * @returns {CheckProps} The status of the king in check, along with valid moves of each piece type
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
        if (Utils.getPieceColor(this.BoardConfig[index].piece) === attackerColor) {
          const moves = this.getMoves(this.BoardConfig[index].piece, MoveType.CAPTURE);
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
          const moves = this.getMoves(this.BoardConfig[index].piece);
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

  /**
   * Checks if the empty cell at `position` is under attack by opponent piece or not
   * This function is specific to castling
   * @param {number} position The position of the empty cell
   * @param {string} attackerColor The color of the opponent piece
   * @returns {boolean} true if the cell is safe from an immediate attack, false otherwise
   */

  private isSafe(position: number, attackerColor: string): boolean {
    let safe = true;
    for (let index = 0; index < 64; index++) {
      if (Utils.getPieceName(this.BoardConfig[index].piece) === null) {
        continue;
      } else if (Utils.getPieceColor(this.BoardConfig[index].piece) === attackerColor) {
        const moves = this.getMoves(this.BoardConfig[index].piece);
        if (moves.includes(position)) {
          return false;
        }
      }
    }
    return safe;
  }

  /**
   * Checks if castling move is possible for king at `fromPos` and rook at `toPos`
   * @param {number} fromPos
   * @param {number} toPos
   * @returns {boolean} true if castling is possible, false otherwise
   */

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

    const attackerColor = Utils.opponentColor(this.BoardConfig[fromPos].piece);

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
   * @returns {number[]} The possible castling moves
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

  public getKingMoves(piece: PieceProps, inCheck: boolean = false): Array<number> {
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
    if (inCheck === false) {
      moves = [...moves, ...this.getCastlingMoves(piece)];
    }
    return moves;
  }
}

export default Moves;
