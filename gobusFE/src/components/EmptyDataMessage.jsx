import React from "react";
import empty from "../assets/images/empty.png";

const EmptyDataMessage = ({ message = "No data available" }) => {
  return (
    <div style={styles.container}>
      <img src={empty} alt="" style={styles.icon}/>
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
    color: "#6b7280", 
    textAlign: "center",
  },
  icon: {
    width: "158px",
    // height: "48px",
    marginBottom: "8px",
    color: "#9ca3af",
  },
  text: {
    fontSize: "16px",
  },
};

export default EmptyDataMessage;
