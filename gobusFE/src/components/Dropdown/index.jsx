import React from "react";
import { Select } from "antd";
import "./style.css";

export default function Dropdown({
  options,
  placeholder,
  onChange,
  defaultValue,
  value,
  width,
  borderRadius = "26px",
}) {
  return (
    <Select
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
  );
}
