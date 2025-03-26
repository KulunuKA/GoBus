import React, { useEffect, useState } from "react";
import "./style.css";
import NavTabs from "../../components/NavTabs/Index";
import activities from "../../assets/images/activitywhite.png";
import tripvector from "../../assets/images/tripvector.jpeg";
import { useHashTab } from "../../hooks/useHashTab";
import TripDetailsCard from "../../components/TripDetailsCard";
import { getTrips } from "../../apis/passengerAPIs";
import { passengerData } from "../../store/passengerSlice";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

export default function Trips() {
  const { id } = useSelector(passengerData);
  const activatedTab = useHashTab("upcomings");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const upcomingTrips = trips.filter(
    (trip) => trip.status === "approved" && trip.date >= today
  );

  const oldTrips = trips.filter(
    (trip) => trip.status === "approved" && trip.date < today
  );

  const pendingTrips = trips.filter((trip) => trip.status === "pending");

  const declinedTrips = trips.filter((trip) => trip.status === "rejected");

  const TabList = [
    { name: "Upcomings", tabName: "upcomings" },
    { name: "Pendings", tabName: "pendings" },
    { name: "Declines", tabName: "declines" },
  ];

  const fetchTrips = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getTrips(id);
      if (code === 0) {
        setTrips(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <>
      <div className="trips-navTabs">
        <NavTabs
          pageIcon={activities}
          pageName="Activities"
          tabList={TabList}
        />
      </div>

      <div className="trips-section-container">
        <div className="trip-section-main">
          <div className="trips-section-header">
            <h2>
              {activatedTab === "upcomings" && "Upcoming Trips"}
              {activatedTab === "pendings" && "Pending Requests"}
              {activatedTab === "declines" && "Declined Requests"}
            </h2>
          </div>
          <div className="trips-section-contents">
            {loading ? (
              <Loading size={70} />
            ) : isError ? (
              <ErrorMessage message={isError} />
            ) : (
              <div className="trips-section-trip-data-section">
                {activatedTab === "upcomings" && (
                  <>
                    <div className="trip-data-section-upcomings">
                      <div className="upcoming-trips-section-image">
                        <img src={tripvector} alt="" />
                      </div>
                      {upcomingTrips.length > 0 ? (
                        <div className="trip-cards-section">
                          {upcomingTrips.map((trip) => (
                            <TripDetailsCard trip={trip} />
                          ))}
                        </div>
                      ) : (
                        <EmptyTrips
                          msg={"You have no upcoming trips."}
                          btnName={"Hire a Bus"}
                        />
                      )}
                    </div>
                    <div className="trip-data-section-past">
                      <div className="trip-data-section-past-header">
                        <h2>Past</h2>
                      </div>
                      <div className="trip-data-section-past-trip-cards-section">
                        {oldTrips.length > 0 ? (
                          <div className="trips-cards-past-trips-section">
                            {oldTrips.map((trip) => (
                              <TripDetailsCard trip={trip} />
                            ))}
                          </div>
                        ) : (
                          <div className="trips-cards-no-data-message-box">
                            <p>You have no past trips to show.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {activatedTab === "pendings" && (
                  <>
                    <div className="trip-data-section-pending-declined">
                      {pendingTrips.length > 0 ? (
                        <div className="trips-cards-pending-declined-trips-section">
                          {pendingTrips.map((trip) => (
                            <TripDetailsCard trip={trip} />
                          ))}
                        </div>
                      ) : (
                        <EmptyTrips
                          msg={"You have no pending trips to show."}
                          btnName={"Hire a Bus"}
                        />
                      )}
                    </div>
                  </>
                )}
                {activatedTab === "declines" && (
                  <>
                    <div className="trip-data-section-pending-declined">
                      {declinedTrips.length > 0 ? (
                        <div className="trips-cards-pending-declined-trips-section">
                          {declinedTrips.map((trip) => (
                            <TripDetailsCard trip={trip} />
                          ))}
                        </div>
                      ) : (
                        <EmptyTrips
                          msg={"You have no declined trips to show."}
                          btnName={"Hire a Bus"}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="trips-section-contents-sidebar">
          <div className="trips-section-contents-sidebar-content">
            <img src={tripvector} alt="" />
            <p className="trips-sidebar-topic">Get a Bus For Trip</p>
            <p className="trips-sidebar-para">
              Request for a hire in minutes and plan a awesome trip
            </p>
            <div className="trips-sidebar-btn">
              <p>Explore Bus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const EmptyTrips = ({ msg, btnName }) => {
  const navigate = useNavigate();

  return (
    <div className="trip-cards-section">
      <div className="trips-cards-no-data-message-box">
        <p>{msg}</p>
        <div
          className="trips-cards-no-data-message-box-btn"
          onClick={() => navigate("/special")}
        >
          <p>{btnName}</p>
        </div>
      </div>
    </div>
  );
};
