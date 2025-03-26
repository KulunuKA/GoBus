import React from "react";
import busIcon from "../../assets/images/bus.png";

export default function PassengerButton({
  name = "Track Bus",
  backgroundColor = "#05944f",
  color = "#f5f5f5",
  borderRadius = "7px",
  fontSize = "18px",
  fontWeight = "600",
  hoverColor = "#047240",
  icon = busIcon,
  onClick,
  width,
}) {
  const buttonStyle = {
    width: width,
    backgroundColor: backgroundColor,
    color: color,
    borderRadius: borderRadius,
    fontWeight: fontWeight,
    fontSize: fontSize,
    cursor: "pointer",
    padding: "7px 15px",
    textDecoration: "none",
    border: "none",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    transition: "background-color 0.3s ease",
  };

  const iconStyle = {
    width: "25px",
    backgroundColor: "transparent",
    pointerEvents: "none", // Prevent mouse events from affecting the icon
  };
  return (
    <>
      <button
        onClick={onClick}
        style={buttonStyle}
        onMouseEnter={(event) =>
          (event.target.style.backgroundColor = hoverColor)
        }
        onMouseLeave={(event) =>
          (event.target.style.backgroundColor = backgroundColor)
        }
      >
        {name} <img src={icon} alt="" style={iconStyle} />
      </button>
    </>
  );
}
