import React, { useState } from "react";
import "./style.css";
import PassengerButton from "../../components/PassengerButton/index";
import submit from "../../assets/images/click.png";
import ComplaintAddForm from "../../components/ComplaintAddForm";

export default function PassengerComplaints() {
  const [isAdd, setIsAdd] = useState(false);

  const userComplaints = [
    {
      id: 1,
      date: "2025-12-13",
      description: "abshgsjfsksksajfkaasfhkslafhsadfsad",
      status: "Resolved",
    },
    {
      id: 1,
      date: "2025-12-13",
      description: "abshgsjfsksksajfkaasfhkslafhsadfsad",
      status: "In Progress",
    },
    {
      id: 1,
      date: "2025-12-13",
      description: "abshgsjfsksksajfkaasfhkslafhsadfsad",
      status: "Resolved",
    },
  ];

  return (
    <>
      <div className="main-passenger-container">
        <div className="pc-header">
          <h3>Passenger Complaints</h3>
          <p>
            We value your feedback. Share your complaints to help us improve our
            service.
          </p>
        </div>
        <div className="passenger-complains-container">
          <div className="complaints-btn">
            <PassengerButton
              name="Submit a New Complaint"
              fontWeight="500"
              icon={submit}
              fontSize="18px"
              onClick={() => setIsAdd(true)}
            />
          </div>
          <div className="prev-complaints">
            <div className="prev-complaits-title">
              <p>Your Previous Complaints</p>
            </div>
            {userComplaints.map((complaint) => (
              <div className="prev-complaint" key={complaint.id}>
                <div className="prev-complaint-data">
                  <p className="complaint-id">
                    <span>Complaint ID :</span> {complaint.id}
                  </p>
                  <p className="complaint-date">{complaint.date}</p>
                  <p className="complaint-description">
                    {complaint.description}
                  </p>
                </div>
                <div className="prev-comp-status">
                  <p
                    className={
                      complaint.status === "In Progress"
                        ? "inprogress"
                        : "resolved"
                    }
                  >
                    {complaint.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ComplaintAddForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
        }}
      />
    </>
  );
}
