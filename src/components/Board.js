import React from "react";
import Square from './Square';
import "../styles.css";

const Board = () => {

  const renderSquares = () => {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      console.log(i, parseInt((i/8) + i) % 2);
      if (parseInt((i/8) + i) % 2) {
        squares.push(<Square color='white'/>);
      } else {
        squares.push(<Square color='black'/>);
      }
    }
    return squares;
  }

  return <div className="board">
    {renderSquares()}
  </div>;
};

export default Board;
