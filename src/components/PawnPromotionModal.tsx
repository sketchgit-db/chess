import React from "react";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import PieceDetails, { PieceDetailsProps } from "../core/PieceDetails";
import Piece, { PieceProps } from "../core/Piece";

import "../styles.css";

export interface PawnPromotionModalProps {
  show: boolean /** Display the Pawn Promotion Modal or not */;
  setShow: React.Dispatch<React.SetStateAction<string>> /** Callback to set the above state */;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> /** The socket on which the player is connected */;
  promotionType: string /** white-promotion or black-promotion */;
  fromPos: number /** Current position of pawn */;
  toPos: number /** Position of pawn after promotion */;
  gameCode: string /** The gameCode for the current Game */;
}

/** Styles for pieces displayed for white pawn promotion */
const whiteButtonStyles = {
  backgroundColor: "#36312b",
  color: "white",
  borderColor: "#36312b",
  fontSize: "8vmin",
  margin: "1vmin",
  borderRadius: "2vmin",
};

/** Styles for pieces displayed for black pawn promotion */
const blackButtonStyles = {
  backgroundColor: "white",
  color: "#36312b",
  borderColor: "#5a5958",
  fontSize: "8vmin",
  margin: "1vmin",
  borderRadius: "2vmin",
};

/**
 * The PromotionModal component
 * Renders the PromotionModal of the game which allows the player to start a new game or join an existing one
 * @returns {React.ReactElement} React component
 */

const PawnPromotionModal: React.FC<PawnPromotionModalProps> = (props) => {
  const { show, setShow, socket, promotionType, fromPos, toPos, gameCode } = props;

  const pieceType: string = promotionType.split("-")[0] + "-piece";

  const styles = promotionType === "white-promotion" ? whiteButtonStyles : blackButtonStyles;

  /**
   * Get a new piece (often used to create an empty cell on capture)
   * @param {number} position
   * @returns {PieceProps} The required Piece
   */

  const getEmptyCell = (position: number): PieceProps => {
    return new Piece("empty-cell", null, "", position, 0, "", 0);
  };

  /**
   * Get a new piece
   * @param {PieceDetailsProps} data The piece metadata
   * @returns {PieceProps} The required Piece
   */

  const getNewPiece = (data: PieceDetailsProps, position: number): PieceProps => {
    return new Piece(pieceType, data.pieceName, data.label, position, data.value, data.identifier, 0);
  };

  const pieces_white = [
    PieceDetails.WHITE_QUEEN,
    PieceDetails.WHITE_KNIGHT,
    PieceDetails.WHITE_BISHOP,
    PieceDetails.WHITE_ROOK,
  ];

  const pieces_black = [
    PieceDetails.BLACK_QUEEN,
    PieceDetails.BLACK_KNIGHT,
    PieceDetails.BLACK_BISHOP,
    PieceDetails.BLACK_ROOK,
  ];

  const handleChoosePiece = (piecePos: number) => {
    setShow("");
    const newPiece =
      promotionType === "white-promotion"
        ? getNewPiece(pieces_white[piecePos], toPos)
        : getNewPiece(pieces_black[piecePos], toPos);
    const oldPiece = getEmptyCell(fromPos);
    socket.emit("promote", {
      newPiece: newPiece,
      oldPiece: oldPiece,
      newPiecePos: toPos,
      oldPiecePos: fromPos,
      gameCode: gameCode,
    });
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Promote Pawn to ...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ButtonGroup style={{ display: "flex", justifyContent: "center" }}>
          <Button style={styles} onClick={() => handleChoosePiece(0)}>
            {pieces_white[0].label}
          </Button>
          <Button style={styles} onClick={() => handleChoosePiece(1)}>
            {pieces_white[1].label}
          </Button>
          <Button style={styles} onClick={() => handleChoosePiece(2)}>
            {pieces_white[2].label}
          </Button>
          <Button style={styles} onClick={() => handleChoosePiece(3)}>
            {pieces_white[3].label}
          </Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  );
};

export default PawnPromotionModal;
