import React from "react";
import "./style.css";
import NavTabs from "../../components/NavTabs/Index";
import activities from "../../assets/images/activitywhite.png";
import tripvector from "../../assets/images/tripvector.jpeg";
import { useHashTab } from "../../hooks/useHashTab";
import PassengerButton from "../../components/PassengerButton/index";
import TripDetailsCard from "../../components/TripDetailsCard";

export default function Trips() {
  const activatedTab = useHashTab("upcomings");

  const today = new Date().toISOString().split("T")[0];

  const tripsData = [
    {
      id: 1,
      type: "Family Trip",
      to: "Colombo",
      days: 3,
      bus: { id: 1, number: "ND 1234" },
      date: "2024-07-15",
      status: "approved",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 2,
      type: "School Anual Trip",
      to: "Galle",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2024-07-16",
      status: "approved",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 3,
      type: "Association Trip",
      to: "Jaffna",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2024-07-17",
      status: "pendings",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 3,
      type: "Association Trip",
      to: "Jaffna",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2024-07-17",
      status: "pendings",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 3,
      type: "Association Trip",
      to: "Jaffna",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2024-07-17",
      status: "pendings",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 3,
      type: "Association Trip",
      to: "Jaffna",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2024-07-17",
      status: "pendings",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 4,
      type: "Office Anual Trip",
      to: "Badulla",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2025-07-18",
      status: "approved",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 5,
      type: "Family Trip",
      to: "Ella",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2025-07-18",
      status: "approved",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 6,
      type: "Office Anual Trip",
      to: "Nuwaraeliya",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2025-06-18",
      status: "declined",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
    {
      id: 7,
      type: "School Anual Trip",
      to: "Kataragama",
      days: 3,
      bus: { id: 1, number: "NB 2345" },
      date: "2025-06-18",
      status: "declined",
      note: "ABCDEFGSDJGSDGSADJKADSAHDASHDHAKSDKSADSDJASKLD",
      reply: "weeeeeeeewqwfdfffffffffffvdcssssss",
    },
  ];

  const upcomingTrips = tripsData.filter(
    (trip) => trip.status === "approved" && trip.date >= today
  );

  const oldTrips = tripsData.filter(
    (trip) => trip.status === "approved" && trip.date < today
  );

  const pendingTrips = tripsData.filter((trip) => trip.status === "pendings");

  const declinedTrips = tripsData.filter((trip) => trip.status === "declined");

  const TabList = [
    { name: "Upcomings", tabName: "upcomings" },
    { name: "Pendings", tabName: "pendings" },
    { name: "Declines", tabName: "declines" },
  ];

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
                      <div className="trip-cards-section">
                        <div className="trips-cards-no-data-message-box">
                          <p>You have no upcoming trips.</p>
                          <div className="trips-cards-no-data-message-box-btn">
                            <p>Hire a Bus</p>
                          </div>
                        </div>
                      </div>
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
                      <>
                        <div className="trips-cards-no-data-message-box message-box-pending-declined">
                          <p>You have no pending trips to show.</p>
                          <div className="trips-cards-no-data-message-box-btn">
                            <p>Hire a Bus</p>
                          </div>
                        </div>
                      </>
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
                      <>
                        <div className="trips-cards-no-data-message-box message-box-pending-declined">
                          <p>You have no declined trips to show.</p>
                          <div className="trips-cards-no-data-message-box-btn">
                            <p>Hire a Bus</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
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
