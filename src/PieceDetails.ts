// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode

/**
 * Interface representing the details of the Chess Board Pieces
 */

export interface PieceDetailsProps {
  pieceName: string;
  label: string;
  value: number;
}

/**
 * A record representing the details `PieceDetailsProps` for each Chess Board Piece
 */

const PieceDetails: Record<any, PieceDetailsProps> = {
  WHITE_PAWN: {
    pieceName: "white-pawn",
    label: "♙",
    value: 1,
  },
  WHITE_ROOK: {
    pieceName: "white-rook",
    label: "♖",
    value: 5,
  },
  WHITE_KNIGHT: {
    pieceName: "white-knight",
    label: "♘",
    value: 3,
  },
  WHITE_BISHOP: {
    pieceName: "white-bishop",
    label: "♗",
    value: 3,
  },
  WHITE_QUEEN: {
    pieceName: "white-queen",
    label: "♕",
    value: 9,
  },
  WHITE_KING: {
    pieceName: "white-king",
    label: "♔",
    value: 0,
  },
  BLACK_PAWN: {
    pieceName: "black-pawn",
    label: "♙",
    value: 1,
  },
  BLACK_ROOK: {
    pieceName: "black-rook",
    label: "♖",
    value: 5,
  },
  BLACK_KNIGHT: {
    pieceName: "black-knight",
    label: "♘",
    value: 3,
  },
  BLACK_BISHOP: {
    pieceName: "black-bishop",
    label: "♗",
    value: 3,
  },
  BLACK_QUEEN: {
    pieceName: "black-queen",
    label: "♕",
    value: 9,
  },
  BLACK_KING: {
    pieceName: "black-king",
    label: "♔",
    value: 0,
  },
};

export default PieceDetails;
