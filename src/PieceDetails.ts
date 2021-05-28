// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode

/**
 * Interface representing the details of the Chess Board Pieces
 */

export interface PieceDetailsProps {
  pieceName: string /** The name of the piece (such as white-pawn, black-rook, etc.) */;
  label: string /** The unicode string representation of the piece */;
  value: number /** The chess piece relative value of the `piece` \
                    (King is assigned value 0 for the sake of implementation) */;
  identifier: string /** Algebraic notation identifier for the `piece` */;
}

/**
 * A record representing the details `PieceDetailsProps` for each Chess Board Piece
 */

const PieceDetails: Record<any, PieceDetailsProps> = {
  WHITE_PAWN: {
    pieceName: "white-pawn",
    label: "♙",
    value: 1,
    identifier: "",
  },
  WHITE_ROOK: {
    pieceName: "white-rook",
    label: "♖",
    value: 5,
    identifier: "R",
  },
  WHITE_KNIGHT: {
    pieceName: "white-knight",
    label: "♘",
    value: 3,
    identifier: "N",
  },
  WHITE_BISHOP: {
    pieceName: "white-bishop",
    label: "♗",
    value: 3,
    identifier: "B",
  },
  WHITE_QUEEN: {
    pieceName: "white-queen",
    label: "♕",
    value: 9,
    identifier: "Q",
  },
  WHITE_KING: {
    pieceName: "white-king",
    label: "♔",
    value: 0,
    identifier: "K",
  },
  BLACK_PAWN: {
    pieceName: "black-pawn",
    label: "♙",
    value: 1,
    identifier: "",
  },
  BLACK_ROOK: {
    pieceName: "black-rook",
    label: "♖",
    value: 5,
    identifier: "R",
  },
  BLACK_KNIGHT: {
    pieceName: "black-knight",
    label: "♘",
    value: 3,
    identifier: "N",
  },
  BLACK_BISHOP: {
    pieceName: "black-bishop",
    label: "♗",
    value: 3,
    identifier: "B",
  },
  BLACK_QUEEN: {
    pieceName: "black-queen",
    label: "♕",
    value: 9,
    identifier: "Q",
  },
  BLACK_KING: {
    pieceName: "black-king",
    label: "♔",
    value: 0,
    identifier: "K",
  },
};

export default PieceDetails;
