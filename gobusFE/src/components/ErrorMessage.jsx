import React from "react";
import error from "../assets/images/error.png"

const ErrorMessage = ({ message = "Something went wrong" }) => {
  return (
    <div style={styles.container}>
      <img src={error} alt="" style={styles.icon}/>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    color: "#ef4444",
    textAlign: "center",
  },
  icon: {
    width: "158px",
    marginBottom: "8px",
    color: "#f87171",
  },
  text: {
    fontSize: "16px",
  },
};

export default ErrorMessage;
