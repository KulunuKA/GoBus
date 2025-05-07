import React from "react";
import "./style.css";
import bus from "../../assets/images/busblack.png";
import article from "../../assets/images/content-writing.png";
import busauth from "../../assets/images/bus-station.png";
import complain from "../../assets/images/complain-icon.png";
import support from "../../assets/images/customer-support.png";
import faqs from "../../assets/images/faqicon.png";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();
  return (
    <>
      <div className="main-passenger-container">
        <div className="help-section-hero">
          <div className="help-hero-section-text">
            <div className="help-hero-section-topic">
              <h2>Welcome to GoBus Support</h2>
            </div>
            <div className="help-hero-section-description">
              <p>
                We’re here to help. Looking for customer service contact
                information? Explore support resources for the relevant products
                below to find the best way to reach out about your issue.
              </p>
            </div>
          </div>
          <div className="help-section-btns">
            <div className="help-section-btn">
              <img src={faqs} alt="" />
              <p className="help-btn-name">FAQs</p>
            </div>
            <div
              className="help-section-btn"
              onClick={() => navigate("/customer-support")}
            >
              <img src={support} alt="" />
              <p className="help-btn-name">Customer Support</p>
            </div>
            <div
              className="help-section-btn"
              onClick={() => navigate("/complaints")}
            >
              <img src={complain} alt="" />
              <p className="help-btn-name">Complains</p>
            </div>
            <div className="help-section-btn">
              <img src={busauth} alt="" />
              <p className="help-btn-name">Bus Authority</p>
            </div>
            <div className="help-section-btn">
              <img src={bus} alt="" />
              <p className="help-btn-name">Bus</p>
            </div>
            <div className="help-section-btn">
              <img src={article} alt="" />
              <p className="help-btn-name">Articles</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
