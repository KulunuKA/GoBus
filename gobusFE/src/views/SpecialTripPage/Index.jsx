import React, { useState } from "react";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import MyInput from "../../components/input";
import Dropdown from "../../components/Dropdown/index";
import {
  citiesWithDistrict,
  sriLankanDistricts,
} from "../../assets/district_city.js";
import PassengerButton from "../../components/PassengerButton/index.jsx";
import island from "../../assets/images/map.png";
import wallet from "../../assets/images/wallet.png";
import review from "../../assets/images/review.png";
import BusItemCard from "../../components/BusItemCard/index.jsx";

const features = [
  {
    icon: island,
    title: "Islandwide Coverage",
    description:
      "Searching over 10,000 busses islandwide to find you the right bus at the right price",
  },
  {
    icon: wallet,
    title: "Book with Confidence",
    description:
      "Free cancellations on most bookings and no hidden charges or credit card fees",
  },
  {
    icon: review,
    title: "Review a Driver or Bus Before You Hire",
    description:
      "Get insights from other travelers by reading reviews and feedback on drivers and buses before making your booking. ",
  },
];

const busData = [
  {
    id: "bus-123",
    name: "City Express 42",
    rating: 4.5,
    authority: "Metro Transit Authority",
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "bus-456",
    name: "Downtown Connector 12",
    rating: 4.2,
    authority: "Urban Transport Co.",
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "bus-789",
    name: "Green Line Shuttle",
    rating: 4.8,
    authority: "City Green Transit",
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "bus-101",
    name: "Rapid Line 7A",
    rating: 4.0,
    authority: "Express Bus Corp.",
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "bus-202",
    name: "Sunrise Commuter 3",
    rating: 3.9,
    authority: "Regional Bus Network",
    imageUrl: "/api/placeholder/300/200",
  },
];

export default function Special() {
  const [searchText, setSearchText] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  return (
    <>
      <div className="special-topic-section">
        <h1>Search for the Best Special Trip Bus Deals</h1>
      </div>
      <div className="special-image-section"></div>

      <div className="special-menu-bar-section">
        <div className="special-main-container">
          <div className="special-menu-bar">
            <div className="special-menu-bar-title">
              <p>Find Your Perfect Ride: Discover Special Trip Buses!</p>
            </div>

            <div className="special-menu-bar-content">
              <div className="special-search-bar">
                <MyInput
                  placeholder="Enter Bus Name"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  borderRadius="0"
                />
              </div>
              <div className="special-filters-section">
                <div className="special-filter">
                  <Dropdown
                    placeholder={"Select District"}
                    onChange={(value) => {
                      setDistrict(value);
                    }}
                    options={(sriLankanDistricts || [])
                      .filter((cit) => cit != "All City")
                      .map((c) => ({
                        label: c,
                        value: c,
                      }))}
                    width="200px"
                    borderRadius="0"
                  />
                </div>
                <div className="special-filter">
                  <Dropdown
                    placeholder={"Select City"}
                    onChange={(value) => {
                      setCity(value);
                    }}
                    options={(citiesWithDistrict[district] || [])
                      .filter((cit) => cit != "All City")
                      .map((c) => ({
                        label: c,
                        value: c,
                      }))}
                    width="200px"
                    borderRadius="0"
                  />
                </div>
              </div>

              <div className="special-btn-section">
                <PassengerButton
                  name="Search Bus"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="special-result-section">
        <div className="special-main-container">
          <div className="special-features-section">
            {features.map((feature) => (
              <div className="feature-box">
                <div className="feature-icon-box">
                  <img src={feature.icon} alt="" />
                </div>
                <div className="features-text-box">
                  <p className="feature-title">{feature.title}</p>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="special-result-section">
            <div className="special-result-topic">
              <h2>Top Rated Buses for Your Trip</h2>
            </div>
            <div className="special-results">
              {busData.map((bus) => (
                <div key={bus.id} className="special-result">
                  <BusItemCard
                    name={bus.name}
                    rating={bus.rating}
                    id={bus.id}
                    authority={bus.authority}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
