import React from "react";
import { Select } from "antd";
import "./style.css";

export default function Dropdown({
  options,
  placeholder,
  onChange,
  defaultValue,
  value,
  width = '100%',
  borderRadius = "26px",
  mode = "default",
}) {
  return (
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
  );
}
