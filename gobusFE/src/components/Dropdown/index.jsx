import React from "react";
import { Select } from "antd";
import "./style.css";

export default function Dropdown({
  options,
  placeholder,
  onChange,
  defaultValue,
  value,
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
      style={{ width: "100%" }}
    />
  );
}
