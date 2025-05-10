import { useEffect, useState } from "react";
import {
  ArrowRight,
  Truck,
  DollarSign,
  MapPin,
  ReceiptTextIcon,
} from "lucide-react";
import "./style.css";
import MyButton from "../../components/button";
import { BusIncomePDFDownload } from "./BusIncome";

export default function BusIncomeDisplay({ busData }) {
  const [selectedBus, setSelectedBus] = useState(null);
  const [incomeData, setIncomeData] = useState([]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle card click to show details
  const handleCardClick = (index) => {
    if (selectedBus === index) {
      setSelectedBus(null);
    } else {
      setSelectedBus(index);
    }
  };

  useEffect(() => {
    if (busData && busData.length > 0) {
      setIncomeData(busData);
    }
  }, [busData]);

  return (
    <div className="bus-dashboard-container">
      <h1 className="dashboard-heading">Bus Income</h1>

      <div className="cards-list">
        {busData.map((bus, index) => (
          <div
            key={bus.busNumber}
            className="bus-card"
            onClick={() => handleCardClick(index)}
          >
            <div className="card-header">
              <div className="bus-info">
                <div className="icon-container">
                  <Truck className="icon" size={24} />
                </div>
                <div>
                  <h2 className="bus-number">{bus.busNumber}</h2>
                  <p className="trip-count">
                    {bus.income.length
                      ? `${bus.income.length} trip${
                          bus.income.length > 1 ? "s" : ""
                        } recorded`
                      : "No trips recorded"}
                  </p>
                </div>
              </div>

              <div className="income-info">
                <span className="total-income">
                  {bus.income
                    .reduce((total, item) => total + item.income, 0)
                    .toLocaleString()}{" "}
                  LKR
                </span>
                <ArrowRight
                  className={selectedBus === index ? "arrow rotated" : "arrow"}
                  size={20}
                />
              </div>
            </div>

            {selectedBus === index && bus.income.length > 0 && (
              <div className="details-container">
                <h3 className="details-heading">Trip Details:</h3>
                {bus.income.map((trip) => (
                  <div key={trip._id} className="trip-item">
                    <div className="trip-header">
                      <div className="trip-date">
                        <span>{formatDate(trip.date)}</span>
                      </div>
                    </div>

                    <div className="trip-details">
                      <div className="detail-item">
                        <DollarSign
                          size={16}
                          className="detail-icon income-icon"
                        />
                        <span className="income-text">
                          {trip.income.toLocaleString()} LKR
                        </span>
                      </div>
                      <div className="detail-item">
                        <MapPin
                          size={16}
                          className="detail-icon distance-icon"
                        />
                        <span className="distance-text">
                          {trip?.distance?.toFixed(2)} km
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBus === index && bus.income.length === 0 && (
              <div className="details-container">
                <p className="no-data">No trip data available for this bus.</p>
              </div>
            )}
          </div>
        ))}

        <BusIncomePDFDownload busData={busData} />
      </div>
    </div>
  );
}
