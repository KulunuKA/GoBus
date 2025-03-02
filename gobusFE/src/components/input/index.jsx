import React from "react";
import { Input } from "antd";

export default function MyInput({
  placeholder = "Type here",
  onChange = () => {},
  value = "",
  type = "text",
  label,
  prefix,
  error = false,
}) {
  const inputStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const labelStyles = {
    color: "#3D3C3C",
    fontSize: "16px",
    fontWeight: "500",
  };

  return (
    <div style={inputStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <Input
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        type={type}
        status={error ? "error" : ""}
        prefix={prefix}
        style={{
          backgroundColor: "#F1EFEF",
          borderRadius: "30px",
          borderColor: error ? "red" : undefined,
        }}
      />
    </div>
  );
}
