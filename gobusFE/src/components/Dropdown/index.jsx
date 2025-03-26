import React from "react";
import { Select } from "antd";
import "./style.css";

export default function Dropdown({
  options,
  placeholder,
  onChange,
  defaultValue,
  value,
  width = "100%",
  borderRadius = "26px",
  mode = "default",
  label,
  required = false,
  error = false,
  errorMessage = "",
  className,
}) {
  const inputContainerStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyles = {
    color: "#2D3436",
    fontSize: "16px",
    fontWeight: "500",
  };

  const errorTextStyles = {
    color: "#F5222D",
    fontSize: "14px",
    marginTop: "1px",
  };

  return (
    <div style={inputContainerStyles} className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: "#F5222D" }}> *</span>}
        </label>
      )}

      <Select
        mode={mode}
        maxCount={10}
        allowClear
        className="dropdown"
        showSearch
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        options={options}
        defaultValue={defaultValue}
        style={{
          width: width,
          borderRadius: borderRadius,
        }}
      />

      {error && errorMessage && (
        <div style={errorTextStyles} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
