import React from "react";
import "../styles.css";

const Square = (props) => {

  let className = props.color;
  return <div className={className}></div>;
};

export default Square;
