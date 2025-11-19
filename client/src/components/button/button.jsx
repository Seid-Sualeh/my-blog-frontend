import React from "react";
import "./button.css";

const Button = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${
        fullWidth ? "btn--full-width" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
