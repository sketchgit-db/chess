// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode

const Piece = {
  WHITE_PAWN: {
    type: "white",
    label: "♙",
    position: -1,
    isHome: true,
    isPromoted: false,
  },
  WHITE_ROOK: {
    type: "white",
    label: "♖",
    position: -1,
  },
  WHITE_KNIGHT: {
    type: "white",
    label: "♘",
    position: -1,
  },
  WHITE_BISHOP: {
    type: "white",
    label: "♗",
    position: -1,
  },
  WHITE_QUEEN: {
    type: "white",
    label: "♕",
    position: -1,
  },
  WHITE_KING: {
    type: "white",
    label: "♔",
    position: -1,
    isCheck: false,
    isMate: false,
  },

  BLACK_PAWN: {
    type: "black",
    label: "♙",
    position: -1,
    isHome: true,
    isPromoted: false,
  },
  BLACK_ROOK: {
    type: "black",
    label: "♖",
    position: -1,
  },
  BLACK_KNIGHT: {
    type: "black",
    label: "♘",
    position: -1,
  },
  BLACK_BISHOP: {
    type: "black",
    label: "♗",
    position: -1,
  },
  BLACK_QUEEN: {
    type: "black",
    label: "♕",
    position: -1,
  },
  BLACK_KING: {
    type: "black",
    label: "♔",
    position: -1,
    isCheck: false,
    isMate: false,
  },
};

export default Piece;
