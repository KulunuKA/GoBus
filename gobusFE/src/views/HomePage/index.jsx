import React from "react";
import "./style.css";
import storelogo from "../../assets/images/storelogo.png";
import busIcon from "../../assets/images/bus.png";
import rightArrow from "../../assets/images/right-arrow.png";
import TransitSelector from "../../components/TransitSelector/TransitSelector";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PassengerButton from "../../components/PassengerButton/index";

const colomboPosition = [6.9271, 79.8612];

const stepsData = [
  {
    id: 1,
    title: "Book in Just 2 Taps",
    description:
      "Key in your pick-up and drop-off locations to get your estimated fare.",
  },
  {
    id: 2,
    title: "SEARCH FOR A BUS",
    description: "GoBus will find you the nearest available bus.",
  },
  {
    id: 3,
    title: "Track Your bus",
    description:
      "Know your bus’s location and estimated time of arrival in real-time.",
  },
];

export default function Home() {
  return (
    <>
      <div className="main-passenger-container">
        <section className="hero-section">
          <div className="hero-section-container sec-container">
            <div className="hero-text">
              <h1>
                ELIMINATING CHAOS <br /> <span>ONE RIDE AT A TIME </span>
              </h1>
              <p className="hero-description">
                GoBus is your all-in-one platform to simplify public transport
                across Sri Lanka. Whether you're a passenger looking to track
                buses, book seats, or plan special trips, or a bus owner
                managing your fleet, GoBus has got you covered.
              </p>
              <p>
                Join us in revolutionizing Sri Lanka's public transport system
                today!
              </p>
              <div className="hero-btn-section btn-home">
                <p>
                  Whether it’s your daily commute <br />{" "}
                  <span>Track real-time bus locations,</span>
                </p>
                <PassengerButton icon={rightArrow} />
              </div>
            </div>
          </div>
        </section>

        <section className="intro-section">
          <div className="intro-section-container sec-container">
            <div className="intro-topic">
              <h1>Find What Fits You</h1>
            </div>

            <TransitSelector />
          </div>
        </section>

        <section className="app-section">
          <div className="app-section-container sec-container">
            <div className="app-section-text">
              <h2>
                THE GOBUS APP
                <br />
                AND HOW IT WORKS
              </h2>
              <div className="steps">
                {stepsData.map((step) => (
                  <div className="step" key={step.id}>
                    <p className="step-number">0{step.id}</p>
                    <div className="step-text">
                      <p className="step-head">{step.title}</p>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="btn-section">
                <div className="download-btn">
                  <a href="#">Download Now</a>
                </div>
                <img src={storelogo} alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="track-section">
          <div className="track-section-container sec-container">
            <div className="track-section-text">
              <h1>
                Track Public Transport <br />
                Real-Time
              </h1>
              <div className="search-bus">
                <img src={busIcon} alt="" />
                <input type="text" placeholder="Enter the Bus Number" />
              </div>
              <div className="track-sec-btn btn-home">
                <PassengerButton icon={rightArrow} />
              </div>
            </div>
            <div className="track-map">
              <MapContainer
                center={colomboPosition}
                zoom={12}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={colomboPosition}>
                  <Popup>Colombo - The Capital of Sri Lanka</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
