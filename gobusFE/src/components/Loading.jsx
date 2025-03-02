import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loading({ size }) {
  return (
    <>
      <center>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: size, color: "#05944f", height: size }}
              spin
            />
          }
        />
      </center>
    </>
  );
}
