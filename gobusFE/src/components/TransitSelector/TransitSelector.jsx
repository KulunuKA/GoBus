import "./style.css";
import locationTracking from "../../assets/images/location_tracking.svg";
import shuttle from "../../assets/images/shuttle.svg";
import specialtrip from "../../assets/images/specialtrip.svg";
import booking from "../../assets/images/booking.svg";
import officeman from "../../assets/images/officeman.png";
import trip from "../../assets/images/trip.png";
import seat from "../../assets/images/seat.png";
import buspic from "../../assets/images/buspic.png";
import { useState } from "react";

const transitOptions = [
  {
    id: "public-transport",
    icon: locationTracking,
    image: buspic,
    title: "Track Public Transport Bus",
    description:
      "OnBus brings real-time public transport tracking to all transit networks. Get updates on schedules, and plan your journeys without the hassle. Stay informed and connected with OnBus for a seamless travel experience!",
  },
  {
    id: "book-seat",
    icon: booking,
    image: seat,
    title: "Book Your Seat",
    description:
      "Reserve your seat in advance and travel with confidence. Our booking system ensures you always have a place to sit during your journey. Easy to use, reliable, and available across all major transit routes.",
  },
  {
    id: "find-bus",
    icon: specialtrip,
    image: trip,
    title: "Find Bus for your Special Trip",
    description:
      "Looking for the right bus for your journey? Our comprehensive search function helps you find the perfect bus based on your destination, preferred time, and required amenities. Plan smarter trips with our advanced bus finder.",
  },
  {
    id: "office-shuttle",
    icon: shuttle,
    image: officeman,
    title: "Track Your Office Shuttle",
    description:
      "Never miss your corporate shuttle again. Our office shuttle tracker provides real-time updates on your company transportation. Get notifications when the shuttle is approaching and plan your workday more efficiently.",
  },
];

export default function TransitSelector() {
  const [selectedOption, setSelectedOption] = useState(transitOptions[0]);

  const handleSelectedOption = (option) => {
    setSelectedOption(option);
  };

  //   console.log(selectedOption);

  return (
    <>
      <div className="intro-section-items">
        {transitOptions.map((option) => (
          <div
            className="intro-item"
            key={option.id}
            onClick={() => handleSelectedOption(option)}
          >
            <div className="item-img">
              <img src={option.icon} alt="Location Trackin image" />
            </div>
            <p className={option.id === selectedOption.id ? "active" : ""}>
              {option.title}
            </p>
          </div>
        ))}
      </div>

      <div className="intro-description-section">
        <div className="intro-description">
          <img src={selectedOption.image} alt="" />
          <div className="intro-desc-text">
            <h2>{selectedOption.title}</h2>
            <p>{selectedOption.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
