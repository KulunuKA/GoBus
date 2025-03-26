import React from "react";
import "./style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrival from "../../assets/images/arrival.png";
import departure from "../../assets/images/departure.png";

export default function RouteQueueSlider({
  busRoutes,
  busType,
  busName,
  busNumber,
  busOwner,
}) {
  const regularSettings = {
    dots: false,
    infinite: true,
    speed: 10000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1,
    cssEase: "linear",
    arrows: false,
  };

  const specialTripSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    arrows: false,
    fade: true,
    pauseOnHover: true,
  };

  const busData = [
    busName,
    busNumber,
    busOwner,
    "This bus is available for hiring! - ",
  ];

  return (
    <div className="route-slider">
      {busType !== "special service" ? (
        <Slider {...regularSettings}>
          {busRoutes.map((route, index) => (
            <div key={index} className="route-slide">
              <div className="route-arrival-departure">
                <div className="route-arrival arrival-departure">
                  <img src={arrival} alt="" />
                  <h3>{route.route.from}</h3>
                </div>
                <h3> to </h3>
                <div className="route-departure arrival-departure">
                  <img src={departure} alt="" />
                  <h3>{route.route.to}</h3>
                </div>
              </div>
              <p>Time: {route.time}</p>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="special-trip-container">
          <Slider {...specialTripSettings}>
            {busData.map((bus, index) => (
              <div key={index} className="special-trip-slide">
                <span className={`special-trip-text special-text-${index + 1}`}>
                  {bus}
                </span>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
