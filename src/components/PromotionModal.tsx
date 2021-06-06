import React, { useEffect } from "react";
import PieceDetails, { PieceDetailsProps } from "../core/PieceDetails";
import Piece, { PieceProps } from "../core/Piece";

import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import "../styles.css";

export interface PromotionModalProps {
  show: boolean;
  socket: Socket<DefaultEventsMap,DefaultEventsMap>;
  promotionType: string;
  fromPos: number;
  toPos: number;
  gameCode: string;
}

const whiteButtonStyles = {
  backgroundColor: "#36312b", 
  color: "white", 
  borderColor: "#36312b", 
  fontSize: "8vmin",
  margin: "1vmin",
  borderRadius: "2vmin",
}

const blackButtonStyles = {
  backgroundColor: "white", 
  color: "#36312b", 
  borderColor: "#5a5958", 
  fontSize: "8vmin",
  margin: "1vmin",
  borderRadius: "2vmin",
}

/**
 * The PromotionModal component
 * Renders the PromotionModal of the game which allows the player to start a new game or join an existing one
 * @returns {React.ReactElement} React component
 */

const PromotionModal: React.FC<PromotionModalProps> = (props) => {
  const { show, socket, promotionType, fromPos, toPos, gameCode } = props;

  const pieceType: string = promotionType.split("-")[0] + "-piece";

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

  const pieces = [
    PieceDetails.WHITE_QUEEN,
    PieceDetails.WHITE_KNIGHT,
    PieceDetails.WHITE_BISHOP,
    PieceDetails.WHITE_ROOK,
  ];

  const handleChoosePiece = (piecePos: number) => {
    const newPiece = getNewPiece(pieces[piecePos], toPos);
    const oldPiece = getEmptyCell(fromPos);
    socket.emit("promote", {
      newPiece: newPiece,
      oldPiece: oldPiece,
      newPiecePos: toPos,
      oldPiecePos: fromPos,
      gameCode: gameCode
    });
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Promote Pawn to ...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ButtonGroup style={{display: "flex", justifyContent: "center"}}>
        <Button style={whiteButtonStyles} onClick={() => handleChoosePiece(0)}>
          {pieces[0].label}
        </Button>
        <Button style={whiteButtonStyles} onClick={() => handleChoosePiece(1)}>
          {pieces[1].label}
        </Button>
        <Button style={whiteButtonStyles} onClick={() => handleChoosePiece(2)}>
          {pieces[2].label}
        </Button>
        <Button style={whiteButtonStyles} onClick={() => handleChoosePiece(3)}>
          {pieces[3].label}
        </Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  );
};

export default PromotionModal;
