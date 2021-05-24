export interface MoveProps {
  type: string;
  pieceName: string
  label: string;
  position: number;
}

const Piece: Record<any, MoveProps> = {
  WHITE_PAWN: {
    type: "white-piece",
    pieceName: "white-pawn",
    label: "♙",
    position: -1,
  },
  WHITE_ROOK: {
    type: "white-piece",
    pieceName: "white-rook",
    label: "♖",
    position: -1,
  },
  WHITE_KNIGHT: {
    type: "white-piece",
    pieceName: "white-knight",
    label: "♘",
    position: -1,
  },
  WHITE_BISHOP: {
    type: "white-piece",
    pieceName: "white-bishop",
    label: "♗",
    position: -1,
  },
  WHITE_QUEEN: {
    type: "white-piece",
    pieceName: "white-queen",
    label: "♕",
    position: -1,
  },
  WHITE_KING: {
    type: "white-piece",
    pieceName: "white-king",
    label: "♔",
    position: -1,
  },

  BLACK_PAWN: {
    type: "black-piece",
    pieceName: "black-pawn",
    label: "♙",
    position: -1,
  },
  BLACK_ROOK: {
    type: "black-piece",
    pieceName: "black-rook",
    label: "♖",
    position: -1,
  },
  BLACK_KNIGHT: {
    type: "black-piece",
    pieceName: "black-knight",
    label: "♘",
    position: -1,
  },
  BLACK_BISHOP: {
    type: "black-piece",
    pieceName: "black-bishop",
    label: "♗",
    position: -1,
  },
  BLACK_QUEEN: {
    type: "black-piece",
    pieceName: "black-queen",
    label: "♕",
    position: -1,
  },
  BLACK_KING: {
    type: "black-piece",
    pieceName: "black-king",
    label: "♔",
    position: -1,
  },
};

export default Piece;
