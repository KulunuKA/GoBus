import React from "react";
import { Star } from "lucide-react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineDirectionsBus, MdOutlineSecurity } from "react-icons/md";
import { PiSeat } from "react-icons/pi";

export default function BusItemCard({
  id,
  name,
  rating = 4.8,
  authority,
  image,
  busNumber,
  seatCount,
  busCondition, //ac / none ac
}) {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];

    const fullStars = Math.floor(rating);

    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} fill="#FFD700" color="#FFD700" size={18} />
      );
    }

    if (halfStar) {
      stars.push(
        <div key="half-star" className="half-star-container">
          <Star
            fill="#FFD700"
            color="#FFD700"
            size={18}
            className="half-star"
          />
          <Star color="#FFD700" size={18} />
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} color="#FFD700" size={18} />);
    }

    return (
      <div className="rating-container">
        <div className="stars-container">{stars}</div>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bus-card" onClick={() => navigate(`/bus/${id}`)}>
      <img className="bus-image" src={image} alt={`${name} bus`} />

      <div className="card-content">
        <h2 className="bus-name">
          {name} / <span>{busNumber}</span>
        </h2>

        <p className="authority-info">
          <MdOutlineSecurity /> {authority}
        </p>
        <div className="bus-conditions">
          <p className="bus-seatCount">
           <div> <PiSeat /> {seatCount}</div>
          </p>

          <p className="bus-seatCount">
           <div> <MdOutlineDirectionsBus /> {busCondition ? "A/C" : "Non-A/C"}</div>
          </p>
        </div>
        <div className="bc-btn-sec">
          <div className="rating-wrapper">{renderStars(rating)}</div>

          <button className="request-button">View Bus</button>
        </div>
      </div>
    </div>
  );
}
