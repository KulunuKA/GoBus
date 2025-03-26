import React from "react";
import { Star } from "lucide-react";
import "./style.css";

export default function BusItemCard({
  id,
  name,
  rating = 4.8,
  authority,
  image,
}) {
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
    <div className="bus-card">
      {/* Bus Image */}
      <img className="bus-image" src={image} alt={`${name} bus`} />

      {/* Content Container */}
      <div className="card-content">
        {/* Bus Name */}
        <h2 className="bus-name">{name}</h2>

        {/* Rating */}
        <div className="rating-wrapper">{renderStars(rating)}</div>

        {/* Authority */}
        <p className="authority-info"> {authority}</p>

        {/* Request Button */}
        <button className="request-button">View Bus</button>
      </div>
    </div>
  );
}
