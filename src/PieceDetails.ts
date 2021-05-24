// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode

export interface PieceDetailsProps {
  pieceName: string;
  label: string;
}

const PieceDetails: Record<any, PieceDetailsProps> = {
  WHITE_PAWN: {
    pieceName: "white-pawn",
    label: "♙",
  },
  WHITE_ROOK: {
    pieceName: "white-rook",
    label: "♖",
  },
  WHITE_KNIGHT: {
    pieceName: "white-knight",
    label: "♘",
  },
  WHITE_BISHOP: {
    pieceName: "white-bishop",
    label: "♗",
  },
  WHITE_QUEEN: {
    pieceName: "white-queen",
    label: "♕",
  },
  WHITE_KING: {
    pieceName: "white-king",
    label: "♔",
  },

  BLACK_PAWN: {
    pieceName: "black-pawn",
    label: "♙",
  },
  BLACK_ROOK: {
    pieceName: "black-rook",
    label: "♖",
  },
  BLACK_KNIGHT: {
    pieceName: "black-knight",
    label: "♘",
  },
  BLACK_BISHOP: {
    pieceName: "black-bishop",
    label: "♗",
  },
  BLACK_QUEEN: {
    pieceName: "black-queen",
    label: "♕",
  },
  BLACK_KING: {
    pieceName: "black-king",
    label: "♔",
  },
};

export default PieceDetails;
