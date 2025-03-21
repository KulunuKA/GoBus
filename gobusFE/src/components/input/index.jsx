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
  errorMessage = "",
  id,
  name,
  required = false,
  disabled = false,
  maxLength,
  className = "",
  onBlur,
  onFocus,
}) {
  const inputContainerStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyles = {
    color: "#3D3C3C",
    fontSize: "16px",
    fontWeight: "500",
  };

  const errorTextStyles = {
    color: "#F5222D",
    fontSize: "14px",
    marginTop: "1px",
  };

  const inputId =
    id ||
    `input-${
      label?.toLowerCase().replace(/\s+/g, "-") ||
      Math.random().toString(36).substring(2, 9)
    }`;

  return (
    <div style={inputContainerStyles} className={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyles}>
          {label}
          {required && <span style={{ color: "#F5222D" }}> *</span>}
        </label>
      )}
      <Input
        id={inputId}
        name={name || inputId}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        type={type}
        status={error ? "error" : ""}
        prefix={prefix}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{
          backgroundColor: "transparent",
          borderRadius: "30px",
        }}
      />
      {error && errorMessage && (
        <div id={`${inputId}-error`} style={errorTextStyles} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
