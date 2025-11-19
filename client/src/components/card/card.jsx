import React from "react";
import "./card.css";

const Card = ({
  children,
  className = "",
  padding = "medium",
  hover = true,
}) => {
  return (
    <div
      className={`card card--${padding} ${
        hover ? "card--hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
