import React from "react";
import { Outlet } from "react-router-dom";
import ControllPanel from "../ControllPanel/Index";

export default function AdministratorLayout() {
  const divStyles = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  };
  return (
    <div style={divStyles}>
      <ControllPanel />
      <main
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "20px",
          marginLeft: "250px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
