import React, { useState } from "react";
import "./style.css";
import MyInput from "../../components/input";
import Dropdown from "../../components/Dropdown";
import PassengerButton from "../../components/PassengerButton";
import { onlyCities } from "../../assets/district_city.js";
import { SearchOutlined } from "@ant-design/icons";
import typing from "../../assets/images/publictype.png";
import selectIcon from "../../assets/images/publicselect.png";
import trackIcon from "../../assets/images/publictrack.png";
import PublicBusRouteCard from "../../components/PublicBusRouteCard/index.jsx";

const steps = [
  {
    icon: typing,
    title: "Enter Your Destination",
    description:
      "Start by entering your destination to find available public service buses today.",
  },
  {
    icon: selectIcon,
    title: "Select a Suitable Bus",
    description:
      "Choose the best bus for your journey based on timing, route, and availability.",
  },
  {
    icon: trackIcon,
    title: "Track Your Bus Location",
    description:
      "Stay updated with real-time bus tracking and know exactly when it will arrive.",
  },
];

const routeSchedule = [
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Route",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Stand",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Route",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Stand",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Route",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "In Stand",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
  {
    bus: {
      id: 1,
      name: "NCG Express",
      number: "NB 1234",
      driver: "Pasindu Malshan",
      tele: "7234567",
      status: "Not Working",
    },
    route: {
      id: 2,
      number: "172/2",
      starting: "Kurunegala",
      end: "Colombo",
      time: "08:30", // Departure time (HH:mm)
      arrivalTime: "11:45", // Expected arrival time (HH:mm)
    },
  },
];

export default function PublicPage() {
  const [searchText, setSearchText] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  return (
    <>
      <div className="main-passenger-container">
        <div className="public-topic-section">
          <h1>Where are you headed today?</h1>
        </div>
        <div className="public-image-section"></div>
        <div className="public-menu-bar-section">
          <div className="public-main-container">
            <div className="public-menu-bar">
              <div className="public-menu-bar-title">
                <p>Hop On! Discover Public Service Buses Today!</p>
              </div>

              <div className="public-menu-bar-content">
                <div className="public-search-bar">
                  <MyInput
                    placeholder="Enter Bus Name"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    borderRadius="0"
                    label="Enter Bus Name:"
                  />
                </div>
                <div className="public-filters-section">
                  <div className="public-filter">
                    <Dropdown
                      placeholder={"Select Your Location"}
                      onChange={(value) => {
                        setDistrict(value);
                      }}
                      options={onlyCities.map((e) => ({
                        label: e,
                        value: e,
                      }))}
                      width="200px"
                      borderRadius="0"
                      label="From:"
                    />
                  </div>
                  <div className="public-filter">
                    <Dropdown
                      placeholder={"Select Your Destination"}
                      onChange={(value) => {
                        setCity(value);
                      }}
                      options={onlyCities.map((e) => ({
                        label: e,
                        value: e,
                      }))}
                      width="200px"
                      borderRadius="0"
                      label="To:"
                    />
                  </div>
                  <div className="public-filter">
                    <Dropdown
                      placeholder={"AC / Non AC"}
                      onChange={(value) => {
                        setCity(value);
                      }}
                      // options={(citiesWithDistrict[district] || [])
                      //   .filter((cit) => cit != "All City")
                      //   .map((c) => ({
                      //     label: c,
                      //     value: c,
                      //   }))}
                      width="200px"
                      borderRadius="0"
                      label="Condition:"
                    />
                  </div>
                </div>

                <div className="public-btn-section">
                  <PassengerButton
                    name="Search Bus"
                    borderRadius="5px"
                    fontSize="18px"
                    fontWeight="500"
                    // onClick={() => {
                    //   fetchBuses("special service", district, city);
                    // }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="public-steps-result-section">
          <div className="public-main-container">
            <div className="public-steps-section">
              {steps.map((step) => (
                <div className="feature-box">
                  <div className="feature-icon-box">
                    <img src={step.icon} alt="" />
                  </div>
                  <div className="features-text-box">
                    <p className="feature-title">{step.title}</p>
                    <p className="feature-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="public-result-section">
              <div className="public-result-topic">
                <h2>Active Buses on Route Today</h2>
              </div>
              <div className="public-result-container">
                <div className="public-results-boxes">
                  {routeSchedule.map((route) => (
                    <>
                      <PublicBusRouteCard route={route} />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
