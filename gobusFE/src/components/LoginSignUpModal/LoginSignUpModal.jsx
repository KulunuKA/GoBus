import React from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.css";
import passenger from "../../assets/images/passenger.jpg";
import busOwner from "../../assets/images/busOwner.jpg";
import "./style.css";

export default function SignUp_Popup({ isOpen, isCancel }) {
  const navigate = useNavigate();
  function redirectRegister(role) {
    navigate(`/register/${role}`);

    if (isCancel) {
      isCancel();
    }
  }

  return (
    <>
      <Modal
        className="loginModal"
        open={isOpen}
        onCancel={isCancel}
        footer={null}
      >
        <section className="loginModal-con">
          <div
            className="subContainer"
            onClick={() => {
              redirectRegister("passenger");
            }}
          >
            <img src={passenger} alt="passenger" />
            <section className="subSection">
              <p>As a Passenger</p>
              <p>Let’s Ride & Track in Real-Time.</p>
            </section>
          </div>

          <div
            className="subContainer"
            onClick={() => redirectRegister("busOwner")}
          >
            <img src={busOwner} alt="Restaurant" />
            <section className="subSection">
              <p>As a Bus Authority</p>
              <p>Let’s Manage Routes & Fleet Smartly.</p>
            </section>
          </div>
        </section>
      </Modal>
    </>
  );
}
