import React, { useEffect, useState } from "react";
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
import { getSpecialBuses } from "../../apis/passengerAPIs.js";
import Loading from "../../components/Loading.jsx";
import EmptyDataMessage from "../../components/EmptyDataMessage.jsx";

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

export default function Special() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const fetchBuses = async (type = "special service", dis, cit) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getSpecialBuses(type, dis, cit);
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
                    onClick={() => {
                      fetchBuses("special service", district, city);
                    }}
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
              <div className="special-result-container">
                {loading ? (
                  <Loading size={70} />
                ) : buses.length === 0 ? (
                  <EmptyDataMessage message="Not found buses!" />
                ) : (
                  <div className="special-results">
                    {buses
                      ?.filter((e) => e.name.includes(searchText))
                      .map((bus) => (
                        <div key={bus._id} className="special-result">
                          <BusItemCard
                            id={bus._id}
                            name={bus.name}
                            rating={bus.rating}
                            authority={bus.ownerID.authorityName}
                            image={bus.pictures[0]}
                          />
                        </div>
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
