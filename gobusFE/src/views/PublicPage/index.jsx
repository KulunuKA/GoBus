import React, { useEffect, useState } from "react";
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
import { getPublicBuses } from "../../apis/passengerAPIs.js";
import EmptyDataMessage from "../../components/EmptyDataMessage.jsx";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage.jsx";

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
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [condition, setCondition] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const fetchBuses = async (
    type = "public transport",
    start,
    end,
    condition
  ) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getPublicBuses(
        type,
        start,
        end,
        condition
      );
      if (code === 0) {
        setBuses(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);
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
                        setStart(value);
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
                        setEnd(value);
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
                        setCondition(value === "A/C" ? "true" : "false");
                      }}
                      options={["A/C", "Non A/C"].map((c) => ({
                        label: c,
                        value: c,
                      }))}
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
                    onClick={() => {
                      fetchBuses("public transport", start, end, condition);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="public-steps-result-section">
          <div className="public-main-container">
            <div className="public-steps-section">
              {steps.map((step, index) => (
                <div className="feature-box" key={index}>
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
                {loading ? (
                  <Loading size={70} />
                ) : buses.length === 0 ? (
                  <EmptyDataMessage message="No buses available matching the route" />
                ) : isError ? (
                  <ErrorMessage message={isError} />
                ) : (
                  <div className="public-results-boxes">
                    {buses
                      ?.filter((e) => e.name.includes(searchText))
                      .map((bus) => (
                        <PublicBusRouteCard bus={bus} key={bus._id} />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
