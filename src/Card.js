import React from "react";
import "./Card.css";

function Card({ card, onClick, isFlipped }) {
  return (
    <div className={`card ${isFlipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">{isFlipped ? card : "?"}</div>
        <div className="card-back">?</div>
      </div>
    </div>
  );
}

export default Card;
