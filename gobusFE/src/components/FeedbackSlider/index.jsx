import React from "react";
import "./style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FeedbackSlider({ feedbackArray }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  return (
    <>
      <div className="feedbackSlider-container">
        <Slider {...settings}>
          {feedbackArray.map((feedback, index) => (
            <div key={index} className="single-bus-overall-feedbacks-content">
              <p className="feedback-content">{feedback.feedback}</p>
              <p className="feedback-writer">{feedback.user_id.username}</p>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
