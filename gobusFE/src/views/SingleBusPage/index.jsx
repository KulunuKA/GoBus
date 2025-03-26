import React, { useState } from "react";
import "./style.css";
import bus from "../../assets/images/singlebus.jpg";
import driver from "../../assets/images/passenger.jpg";
import click from "../../assets/images/click.png";
import RouteQueueSlider from "../../components/RouteQueueSlider/index";
import BusAvailabilityLogic from "../../components/BusAvailabilityLogic/index";
import FeedbackSlider from "../../components/FeedbackSlider/index";
import PassengerButton from "../../components/PassengerButton";
import { Rate } from "antd";
import TextArea from "antd/es/input/TextArea";

const busDetails = {
  busNumber: "NB-1234",
  busName: "A9 Express",
  model: "Ashok Leyland",
  manufactureYear: 2018,
  type: "Public Transport", //Public Transport, Special Trip, Dual-Service
  capacity: 56,
  currentStatus: "In Route", //In Stand, In Route, Not Working, In Service
  currentDetails: {
    delay: false,
    breakDown: false,
  },
  authority: "NCG Express",
  rating: 3.5,
  feedbacks: [
    { username: "Dilshan", review: "Good Service 01" },
    { username: "Kulunu", review: "Good Service 02" },
    { username: "Pasindu", review: "Good Service 03" },
    { username: "Ridmi", review: "Good Service 04" },
    { username: "Chethana", review: "Good Service 05" },
  ],
  image: bus,
  driver: {
    name: "Michael Johnson",
    image: driver,
    rating: 4.5,
    feedbacks: [
      { username: "Dilshan", review: "Good Driver 01" },
      { username: "Kulunu", review: "Good Driver 02" },
      { username: "Pasindu", review: "Good Driver 03" },
      { username: "Ridmi", review: "Good Driver 04" },
      { username: "Chethana", review: "Good Driver 05" },
    ],
  },
};

const busRoute = {
  routeNumber: 142,
  startPoint: "Central Station",
  endPoint: "Westside Terminal",
};

const calOverallReviewsCount = (numReviewBus, numReviewDriver) => {
  return numReviewBus + numReviewDriver;
};

const calOverallRating = (busRating, driverRating) => {
  if (typeof busRating !== "number" || typeof driverRating !== "number") {
    throw new Error("Invalid rating value");
  }

  const overallRating = (busRating + driverRating) / 2;

  return Math.round(overallRating * 10) / 10;
};

const busRoutes = [
  {
    route: {
      from: "Colombo",
      to: "Kurunegala",
    },
    time: "6:30 AM",
    arrivalTime: "9.30 AM",
  },
  {
    route: {
      from: "Kurunegala",
      to: "Colombo",
    },
    time: "11:30 AM",
    arrivalTime: "14.30 AM",
  },
  {
    route: {
      from: "Colombo",
      to: "Kurunegala",
    },
    time: "16:30 PM",
    arrivalTime: "19.30 AM",
  },
  {
    route: {
      from: "Kurunegala",
      to: "Colombo",
    },
    time: "20:30 PM",
    arrivalTime: "23.30 AM",
  },
];

export default function SingleBusPage() {
  const [passengerFeedbacksShow, setPassengerFeedbacksShow] = useState(true);
  const [feedbackType, setFeedbackType] = useState("bus");
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [feedbackData, setFeedBackData] = useState({ rating: 0, feedback: "" });

  const handleRatingChange = (value) => {
    setFeedBackData((prev) => ({ ...prev, rating: value }));
  };

  const handleFeedbackChange = (e) => {
    setFeedBackData((prev) => ({ ...prev, feedback: e.target.value }));
  };

  const handleRatingSubmit = () => {
    if (feedbackType === "bus") {
      window.alert("You Gave Feedback for Bus Service!! ", feedbackData.rating);
    } else if (feedbackType === "driver") {
      window.alert("You Gave Feedback for Bus Driver!! ", feedbackData.rating);
    }
    setFeedBackData({ rating: 0, feedback: "" });
  };

  let feedbackContent;

  if (feedbackType === "bus") {
    feedbackContent = (
      <>
        <FeedbackSlider feedbackArray={busDetails.feedbacks} />
      </>
    );
  }

  if (feedbackType === "driver") {
    feedbackContent = (
      <>
        <FeedbackSlider feedbackArray={busDetails.driver.feedbacks} />
      </>
    );
  }

  const handleClickHere = () => {
    setPassengerFeedbacksShow(false);
    setShowRatingForm(true);
  };

  const handleClickOnReview = () => {
    setPassengerFeedbacksShow((prev) => !prev);
    setShowRatingForm((prev) => !prev);
  };

  return (
    <>
      <div className="main-passenger-container">
        <div className="single-bus-image-section">
          <div className="img-section-img">
            <img src={busDetails.image} alt="" />
          </div>
          <div className="bus-number-section">
            <h2 className="bus-number-section-header">
              {busDetails.busNumber}
            </h2>
            <p className="bus-number-section-para">{busDetails.authority}</p>
          </div>
        </div>
        <RouteQueueSlider
          busRoutes={busRoutes}
          busType={busDetails.type}
          busName={busDetails.busName}
          busNumber={busDetails.busNumber}
          busOwner={busDetails.authority}
        />
        <div className="single-bus-information-section-container">
          <div className="single-bus-information-section">
            <div className="single-bus-information-section-bus-info">
              <div className="single-bus-info-box">
                <div className="info-box-header">
                  <h3>Bus Information</h3>
                </div>
                <div className="info-box-data">
                  <div className="info-box-field">
                    <p className="info-box-field-label">Bus Number:</p>
                    <p className="info-box-field-data">
                      {busDetails.busNumber}
                    </p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Model:</p>
                    <p className="info-box-field-data">{busDetails.model}</p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Manufacture Year:</p>
                    <p className="info-box-field-data">
                      {busDetails.manufactureYear}
                    </p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Type:</p>
                    <p className="info-box-field-data">{busDetails.type}</p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Capacity:</p>
                    <p className="info-box-field-data">{busDetails.capacity}</p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Current Status:</p>
                    <p className="info-box-field-data">
                      {busDetails.currentStatus}
                    </p>
                  </div>
                  <div className="info-box-field">
                    <p className="info-box-field-label">Authority / Owner:</p>
                    <p className="info-box-field-data">
                      {busDetails.authority}
                    </p>
                  </div>
                </div>
                <div className="info-box-btn-section">
                  <BusAvailabilityLogic busDetails={busDetails} />
                </div>
              </div>
            </div>
            <div className="single-bus-information-section-route-info">
              <div className="single-bus-info-box">
                <div className="info-box-header">
                  {busDetails.type !== "Special Trip" ? (
                    <h3>Route Information</h3>
                  ) : (
                    <h3>Hiring Information</h3>
                  )}
                </div>
                <div className="info-box-data">
                  {busDetails.type !== "Special Trip" ? (
                    <>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Route Number:</p>
                        <p className="info-box-field-data">
                          {busRoute.routeNumber}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Start Point:</p>
                        <p className="info-box-field-data">
                          {busRoute.startPoint}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">End Point:</p>
                        <p className="info-box-field-data">
                          {busRoute.endPoint}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Driver:</p>
                        <p className="info-box-field-data">
                          {busDetails.driver.name}
                        </p>
                      </div>
                      <div className="info-box-route-info-bus-driver-image">
                        <img
                          src={busDetails.driver.image}
                          alt=""
                          className="info-box-route-info-bus-driver-image-img"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Driver:</p>
                        <p className="info-box-field-data">
                          {busDetails.driver.name}
                        </p>
                      </div>
                      <div className="info-box-route-info-bus-driver-image">
                        <img
                          src={busDetails.driver.image}
                          alt=""
                          className="info-box-route-info-bus-driver-image-img"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {busDetails.type !== "Special Trip" && (
            <div className="single-bus-route-schedule-section">
              <div className="single-bus-info-box">
                <div className="info-box-header">
                  <h3>Route Schedule</h3>
                </div>
                <div className="table-container">
                  <table className="bus-info-table">
                    <thead>
                      <tr className="table-header">
                        <th>Departure Time</th>
                        <th>Start Location</th>
                        <th>Arrival Time</th>
                        <th>End Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {busRoutes.map((bus, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "row-even" : "row-odd"}
                        >
                          <td>{bus.time}</td>
                          <td>{bus.route.from}</td>
                          <td>{bus.arrivalTime}</td>
                          <td>{bus.route.to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <div className="single-bus-feedback-rating-section">
            <div className="single-bus-info-box">
              <div className="info-box-header">
                <h3>Feedback & Ratings</h3>
              </div>
              <div className="single-bus-overall-ratings">
                <div className="rating-display-box">
                  <h2 className="rate-number">
                    {calOverallRating(
                      busDetails.rating,
                      busDetails.driver.rating
                    )}
                  </h2>
                  <p className="rate-category">Overall Rating</p>
                </div>
                <div className="rating-display-box">
                  <h2 className="rate-number">{busDetails.rating}</h2>
                  <p className="rate-category">Bus Service</p>
                </div>
                <div className="rating-display-box">
                  <h2 className="rate-number">{busDetails.driver.rating}</h2>
                  <p className="rate-category">Bus Driver</p>
                </div>
                <div
                  className="rating-display-box"
                  onClick={handleClickOnReview}
                >
                  <h2 className="rate-number">
                    {calOverallReviewsCount(
                      busDetails.feedbacks.length,
                      busDetails.driver.feedbacks.length
                    )}
                  </h2>
                  <p className="rate-category">Reviews</p>
                </div>
              </div>
              {passengerFeedbacksShow && (
                <div className="single-bus-overall-feedbacks">
                  <div className="single-bus-overall-feedbacks-header">
                    <p
                      className={feedbackType === "bus" ? "active" : ""}
                      onClick={() => setFeedbackType("bus")}
                    >
                      Reviews about Bus Service
                    </p>
                    <div className="vr-line"></div>
                    <p
                      className={feedbackType === "driver" ? "active" : ""}
                      onClick={() => setFeedbackType("driver")}
                    >
                      Reviews about Bus Driver
                    </p>
                  </div>
                  <div className="single-bus-overall-feedbacks-contents">
                    {feedbackContent}
                  </div>
                </div>
              )}
              <div className="single-bus-passenger-feedbacking-section">
                {!showRatingForm && (
                  <div className="single-bus-passenger-feedbacking-section-message">
                    <p>
                      We value your feedback!{" "}
                      <span onClick={handleClickHere}>Click here</span> to rate
                      our service!
                    </p>
                  </div>
                )}
                {showRatingForm && (
                  <div className="single-bus-overall-feedbacks">
                    <div className="single-bus-overall-feedbacks-header">
                      <p
                        className={feedbackType === "bus" ? "active" : ""}
                        onClick={() => setFeedbackType("bus")}
                      >
                        Rate about Bus Service
                      </p>
                      <div className="vr-line"></div>
                      <p
                        className={feedbackType === "driver" ? "active" : ""}
                        onClick={() => setFeedbackType("driver")}
                      >
                        Rate about Bus Driver
                      </p>
                    </div>
                    <div className="single-bus-overall-feedbacks-contents">
                      <div className="single-bus-feedback-rate-box">
                        <div className="star-rate-section">
                          {feedbackType === "bus" && (
                            <p>Give Your Rate about Service : </p>
                          )}
                          {feedbackType === "driver" && (
                            <p>Give Your Rate about Driver : </p>
                          )}
                          <Rate
                            allowHalf
                            defaultValue={2.5}
                            onChange={handleRatingChange}
                          />
                        </div>
                        <div className="star-rate-section">
                          {feedbackType === "bus" && (
                            <p>Give Your Feedback about Service : </p>
                          )}
                          {feedbackType === "driver" && (
                            <p>Give Your Feedback about Driver : </p>
                          )}
                          <TextArea
                            rows={4}
                            placeholder="Enter your feedback here..."
                            value={feedbackData.feedback}
                            onChange={handleFeedbackChange}
                            style={{ margin: "10px 0" }}
                          />
                        </div>
                        <div className="feedback-btn">
                          <PassengerButton
                            name="SUBMIT"
                            borderRadius="5px"
                            fontSize="18px"
                            fontWeight="500"
                            icon={click}
                            onClick={handleRatingSubmit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
