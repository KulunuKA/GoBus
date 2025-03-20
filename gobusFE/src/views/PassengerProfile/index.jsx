import man from "../../assets/images/passenger.jpg";
import activity from "../../assets/images/activity.png";
import favourite from "../../assets/images/favourite.png";
import notification from "../../assets/images/notification.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const buttonsList = [
  { name: "Activities", image: activity, path: "/activities" },
  { name: "Favourites", image: favourite, path: "/favourites" },
  { name: "Notifications", image: notification, path: "/notifications" },
];

export default function PassengerProfile() {
  const navigate = useNavigate();

  return (
    <>
      <div className="passenger-profile-home">
        <div className="passenger-profile-home-image-name">
          <img src={man} alt="" className="passenger-profile-home-image" />
          <p className="passenger-profile-home-name">Dilshan</p>
          <p className="passenger-profile-home-mail">
            dilshanwanasinghe63@gmail.com
          </p>
        </div>
        <div className="passenger-profile-home-btns">
          {buttonsList.map((b) => (
            <div
              key={b.name}
              className="passenger-profile-home-btn"
              onClick={() => {
                navigate(`${b.path}`);
              }}
            >
              <img src={b.image} alt="" />
              <p>{b.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
