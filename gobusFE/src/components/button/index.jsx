import React from "react";
import { Button } from "antd";

export default function MyButton({
  name = "Submit",
  onClick,
  loading,
  disabled,
  size = "large",
  icon,
  danger,
  ghost,
  color,
  width,
  mt
}) {
  return (
    <Button
      htmlType="submit"
      type="primary"
      shape="round"
      size={size}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      icon={icon}
      danger={danger}
      ghost={ghost}
      style={{
        marginRight:mt,
        backgroundColor: color,
        width: width,
        color: "white",
        fontSize: loading && 20,
      }}
    >
      {loading ? "" : name}
    </Button>
  );
}
