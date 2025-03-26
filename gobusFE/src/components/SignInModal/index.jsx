import { Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../button";
import "./style.css";

export default function SignInModal({ isOpen, closeModal }) {
  const navigate = useNavigate();

  return (
    <>
      <Modal open={isOpen} footer={false} onCancel={closeModal}>
        <div className="signModal">
          <h3>Please login in</h3>
          <p>
            Please login in to access more features in GoBus. <br />
            Do you want to login in?
          </p>
          <div className="signBtns">
            <MyButton name="No,Cancel" onClick={closeModal} color={"gray"}/>
            <MyButton name="Yes,Continue" onClick={() => navigate("/login")} color={"#05944f"}/>
          </div>
        </div>
      </Modal>
    </>
  );
}
