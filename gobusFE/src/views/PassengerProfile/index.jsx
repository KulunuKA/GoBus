import man from "../../assets/images/passenger.jpg";
import activity from "../../assets/images/activity.png";
import favourite from "../../assets/images/favourite.png";
import notification from "../../assets/images/notification.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";

const buttonsList = [
  { name: "Activities", image: activity, path: "/activity" },
  { name: "Favourites", image: favourite, path: "/favourites" },
  { name: "Notifications", image: notification, path: "/notifications" },
];

export default function PassengerProfile() {
  const reduxUser = useSelector(passengerData);
  const user = {
    username: reduxUser.username,
    email: reduxUser.email,
    propic: man,
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="passenger-profile-home">
        <div className="passenger-profile-home-image-name">
          <img
            src={user.propic}
            alt=""
            className="passenger-profile-home-image"
          />
          <p className="passenger-profile-home-name">{user.username}</p>
          <p className="passenger-profile-home-mail">{user.email}</p>
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
