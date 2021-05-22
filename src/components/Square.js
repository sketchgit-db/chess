import React from "react";
import "../styles.css";

const Square = (props) => {
  const className = props.color;
  const position = props.position;
  const piece = props.piece;
  return (
    <div className={className}>
      <div className={props.type}>
        {props.piece}
      </div>
    </div>
  );
};

export default Square;
