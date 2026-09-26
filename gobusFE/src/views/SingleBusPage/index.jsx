import React, { useEffect, useState } from "react";
import "./style.css";
import bus from "../../assets/images/singlebus.jpg";
import driver from "../../assets/images/passenger.jpg";
import RouteQueueSlider from "../../components/RouteQueueSlider/index";
import location from "../../assets/images/location.png";
import reservation from "../../assets/images/reservation.png";
import PassengerButton from "../../components/PassengerButton";
import { getBus } from "../../apis/passengerAPIs";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import BookForm from "../../components/BookForm";
import SignInModal from "../../components/SignInModal";
import { passengerData } from "../../store/passengerSlice";
import { useSelector } from "react-redux";
import { convertTo12HourFormat } from "../../util/time_format";
import Feedback from "./Feedback";

const busDetails = {
  busNumber: "NB-1234",
  busName: "A9 Express",
  model: "Ashok Leyland",
  manufactureYear: 2018,
  type: "Public Transport", //Public Transport, Special Trip, Dual-Service
  capacity: 56,
  currentStatus: "In Route", //In Stand, In Route, Not Working, In Service
  currentDetails: {
    delay: false,
    breakDown: false,
  },
  authority: "NCG Express",
  rating: 3.5,
  feedbacks: [
    { username: "Dilshan", review: "Good Service 01" },
    { username: "Kulunu", review: "Good Service 02" },
    { username: "Pasindu", review: "Good Service 03" },
    { username: "Ridmi", review: "Good Service 04" },
    { username: "Chethana", review: "Good Service 05" },
  ],
  image: bus,
  driver: {
    name: "Michael Johnson",
    image: driver,
    rating: 4.5,
    feedbacks: [
      { username: "Dilshan", review: "Good Driver 01" },
      { username: "Kulunu", review: "Good Driver 02" },
      { username: "Pasindu", review: "Good Driver 03" },
      { username: "Ridmi", review: "Good Driver 04" },
      { username: "Chethana", review: "Good Driver 05" },
    ],
  },
};



const busRoutes = [
  {
    route: {
      from: "Colombo",
      to: "Kurunegala",
    },
    time: "6:30 AM",
    arrivalTime: "9.30 AM",
  },
  // {
  //   route: {
  //     from: "Kurunegala",
  //     to: "Colombo",
  //   },
  //   time: "11:30 AM",
  //   arrivalTime: "14.30 AM",
  // },
  // {
  //   route: {
  //     from: "Colombo",
  //     to: "Kurunegala",
  //   },
  //   time: "16:30 PM",
  //   arrivalTime: "19.30 AM",
  // },
  // {
  //   route: {
  //     from: "Kurunegala",
  //     to: "Colombo",
  //   },
  //   time: "20:30 PM",
  //   arrivalTime: "23.30 AM",
  // },
];

export default function SingleBusPage() {

  const { id } = useParams();
  const [bus, setBus] = useState({
    busNumber: "",
    ownerID: "",
    name: "",
    password: "",
    pictures: [],
    seatNumber: 0,
    busType: "",
    district: "",
    city: "",
    timetable: [],
  });
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchBus = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getBus(id);
      if (code === 0) {
        setBus(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
    }
  };


  useEffect(() => {
    fetchBus();
  }, []);

  useEffect(() => {
    if (bus?.pictures.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bus?.pictures.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex]);
  
  return (
    <>
      <div className="main-passenger-container">
        <div className="single-bus-image-section">
          <div className="img-section-img">
            <img src={bus?.pictures[currentIndex]} alt="" />
          </div>
          <div className="bus-number-section">
            <h2 className="bus-number-section-header">{bus.busNumber}</h2>
            <p className="bus-number-section-para">
              {bus.ownerID.authorityName}
            </p>
          </div>
        </div>
        <RouteQueueSlider
          busRoutes={bus.timetable}
          busType={bus.busType}
          busName={bus.name}
          busNumber={bus.busNumber}
          busOwner={bus.ownerID.authorityName}
        />
        <div className="single-bus-information-section-container">
          <div className="single-bus-information-section">
            <div className="single-bus-information-section-bus-info">
              <BusInfo data={bus} />
            </div>

            <div className="single-bus-information-section-route-info">
              <div className="single-bus-info-box">
                <div className="info-box-header">
                  {bus.busType !== "special service" ? (
                    <h3>Route Information</h3>
                  ) : (
                    <h3>Hiring Information</h3>
                  )}
                </div>
                <div className="info-box-data">
                  {bus.busType !== "special service" ? (
                    <>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Route Number:</p>
                        <p className="info-box-field-data">
                          {bus.route_id?.route_number}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Start Point:</p>
                        <p className="info-box-field-data">
                          {bus?.timetable[0]?.startPlace}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">End Point:</p>
                        <p className="info-box-field-data">
                          {bus?.timetable[0]?.endPlace}
                        </p>
                      </div>
                      <div className="info-box-field">
                        <p className="info-box-field-label">Driver:</p>
                        <p className="info-box-field-data">
                          {bus?.driverID?.name}
                        </p>
                      </div>
                      <div className="info-box-route-info-bus-driver-image">
                        <img
                          src={busDetails.driver.image}
                          alt=""
                          className="info-box-route-info-bus-driver-image-img"
                        />
                      </div>
                    </>
                  ) : (
                    <HiringInformation data={bus} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {bus.busType !== "special service" && (
            <div className="single-bus-route-schedule-section">
              <div className="single-bus-info-box">
                <div className="info-box-header">
                  <h3>Route Schedule</h3>
                </div>
                <div className="table-container">
                  <table className="bus-info-table">
                    <thead>
                      <tr className="table-header">
                        <th>Departure Time</th>
                        <th>Start Location</th>
                        <th>Arrival Time</th>
                        <th>End Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bus.timetable.map((bus, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "row-even" : "row-odd"}
                        >
                          <td>{convertTo12HourFormat(bus.startTime)}</td>
                          <td>{bus.startPlace}</td>
                          <td>{convertTo12HourFormat(bus.endTime)}</td>
                          <td>{bus.endPlace}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

         <Feedback busDetails={bus}/>
        </div>
      </div>
    </>
  );
}

const HiringInformation = ({ data }) => {
  const values = [
    { key: "Email", value: data?.ownerID?.email },
    { key: "Phone", value: data?.ownerID?.phone },
    { key: "Address", value: data?.ownerID?.address },
  ];
  return (
    <>
      {values.map((item, index) => (
        <div className="info-box-field">
          <p className="info-box-field-label">{item.key}</p>
          <p className="info-box-field-data">{item.value}</p>
        </div>
      ))}
      <div className="info-box-route-info-bus-driver-image">
        <img
          src={data?.ownerID?.logo}
          alt=""
          className="info-box-route-info-bus-driver-image-img"
        />
      </div>
    </>
  );
};

const BusInfo = ({ data }) => {
  const keyValue = [
    {
      key: "Authority Name",
      value: data.ownerID.authorityName,
    },
    {
      key: "Bus Number",
      value: data.busNumber,
    },
    {
      key: "Model",
      value: data.model || "Not Available",
    },
    {
      key: "Manufacture Year",
      value: data.manufactureYear || "Not Available",
    },
    {
      key: "Type",
      value: data.busType,
    },
    {
      key: "AC/Non-AC",
      value: data.ac ? "AC" : "Non-AC",
    },
    {
      key: "Capacity",
      value: data.seatNumber,
    },
    {
      key: "Current Status",
      value: data.currentStatus,
    },
  ];
  const [wantToBook, setWantToBook] = useState(false);
  const [signInModal, setSignInModal] = useState(false);
  const passengerRedux = useSelector(passengerData);
  const navigate = useNavigate();

  const role = passengerRedux?.role;

  const BusAvailabilityLogic = () => {
    return (
      <>
        {data.busType === "public transport" &&
          data.today_work &&
          data.start_trip &&
          !data.is_delay &&
          !data.is_breakdown && (
            <PassengerButton
              name="Track Location"
              borderRadius="5px"
              fontSize="18px"
              fontWeight="500"
              icon={location}
              onClick={() => {
                navigate(`/map/${data._id}`);
              }}
            />
          )}
        {data.busType === "public transport" &&
          data.start_trip &&
          data.is_delay &&
          !data.is_breakdown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Delay: The bus will be delayed.
              </p>
              <div className="information-with-btn-btn">
                <PassengerButton
                  name="Track Location"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                  icon={location}
                  onClick={() => {
                    navigate(`/map/${data._id}`);
                  }}
                />
              </div>
            </div>
          )}
        {data.busType === "public transport" &&
          data.start_trip &&
          data.is_breakdown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Breakdown: The bus has broken down.
              </p>
            </div>
          )}

        {data.busType === "public transport" &&
          data.start_trip &&
          data.is_breakdown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Breakdown: The bus has broken down.
              </p>
            </div>
          )}
        {data.busType === "public transport" &&
          data.start_trip &&
          data.is_delay &&
          !data.is_breakdown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Delay: The bus has not started yet and will be delayed.
              </p>
            </div>
          )}
        {data.busType === "public transport" && !data.today_work && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Notice: The bus will not be operating today.
            </p>
          </div>
        )}
        {data.busType === "special service" && (
          <PassengerButton
            name="Book For Special Trip"
            borderRadius="5px"
            fontSize="18px"
            fontWeight="500"
            icon={reservation}
            onClick={() => {
              if (!role) {
                setSignInModal(true);
              } else setWantToBook(true);
            }}
          />
        )}

        {data.busType === "Dual-Service" &&
          data.start_trip &&
          !data.currentDetails.delay &&
          !data.currentDetails.breakDown && (
            <div className="dual-service-btn-section">
              <PassengerButton
                name="Track Location"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={location}
              />
              <PassengerButton
                name="Book For special service"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={reservation}
              />
            </div>
          )}
        {data.busType === "Dual-Service" &&
          data.start_trip &&
          data.currentDetails.delay &&
          !data.currentDetails.breakDown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Delay: The bus will be delayed.
              </p>
              <div className="dual-service-btn-section">
                <PassengerButton
                  name="Track Location"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                  icon={location}
                />
                <PassengerButton
                  name="Book For special service"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                  icon={reservation}
                />
              </div>
            </div>
          )}
        {data.busType === "Dual-Service" &&
          data.start_trip &&
          data.currentDetails.delay &&
          data.currentDetails.breakDown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Breakdown: The bus has broken down.
              </p>
            </div>
          )}
        {data.busType === "Dual-Service" &&
          data.start_trip &&
          data.currentDetails.delay &&
          data.currentDetails.breakDown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Breakdown: The bus has broken down.
              </p>
            </div>
          )}
        {data.busType === "Dual-Service" &&
          data.start_trip &&
          !data.currentDetails.delay &&
          !data.currentDetails.breakDown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Status: The bus is on time but has not started yet.
              </p>
              <div className="information-with-btn-btn">
                <PassengerButton
                  name="Book For special service"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                  icon={reservation}
                />
              </div>
            </div>
          )}
        {data.busType === "Dual-Service" &&
          data.start_trip &&
          data.currentDetails.delay &&
          !data.currentDetails.breakDown && (
            <div className="information-with-btn">
              <p className="information-with-btn-para">
                Bus Delay: The bus has not started yet and will be delayed.
              </p>
              <div className="information-with-btn-btn">
                <PassengerButton
                  name="Book For special service"
                  borderRadius="5px"
                  fontSize="18px"
                  fontWeight="500"
                  icon={reservation}
                />
              </div>
            </div>
          )}
        {data.busType === "Dual-Service" && !data.today_work && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Notice: The bus will not be operating today and special
              service booking is temporarily unavailable.
            </p>
          </div>
        )}
      </>
    );
  };
  return (
    <div className="single-bus-info-box">
      <div className="info-box-header">
        <h3>Bus Information</h3>
      </div>
      <div className="info-box-data">
        {keyValue.map((item, index) => (
          <div className="info-box-field" key={index}>
            <p className="info-box-field-label">{item.key}</p>
            <p className="info-box-field-data">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="info-box-btn-section">{BusAvailabilityLogic()}</div>
      <BookForm isOpen={wantToBook} onClose={() => setWantToBook(false)} />
      <SignInModal
        isOpen={signInModal}
        closeModal={() => setSignInModal(false)}
      />
    </div>
  );
};
