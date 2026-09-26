import React from "react";
import "./style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Rate } from "antd";

export default function FeedbackSlider({ feedbackArray }) {

  console.log("Feedback array", feedbackArray);
  if (!feedbackArray || feedbackArray.length === 0) {
    return <div className="no-feedbacks">No feedbacks available</div>;
  }

  const settings = {
    dots: feedbackArray.length > 1,
    infinite: feedbackArray.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: feedbackArray.length > 1,
    arrows: feedbackArray.length > 1,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className="feedbackSlider-container">
        <Slider {...settings}>
          {feedbackArray.map((feedback, index) => (
            <div key={index} className="single-bus-overall-feedbacks-content">
              <Rate value={feedback.rating} disabled/>
              <p className="feedback-content">{feedback.feedback}</p>
              <p className="feedback-writer">{feedback.user_id.username}</p>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
