import React, { useEffect, useState } from "react";
import "./style.css";
import PassengerButton from "../../components/PassengerButton/index";
import submit from "../../assets/images/click.png";
import ComplaintAddForm from "../../components/ComplaintAddForm";
import { deleteComplaint, getComplaints } from "../../apis/passengerAPIs";
import { passengerData } from "../../store/passengerSlice";
import Loading from "../../components/Loading";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { useSelector } from "react-redux";
import ErrorMessage from "../../components/ErrorMessage";
import MyButton from "../../components/button";
import { DeleteFilled } from "@ant-design/icons";
import { Modal, notification } from "antd";

export default function PassengerComplaints() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(passengerData);
  const [userComplaints, setUserComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const { confirm } = Modal;

  const fetchComplaints = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getComplaints(id);
      if (code === 0) {
        setUserComplaints(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deleteComplaint(id);
      const newComplaints = userComplaints.filter(
        (complaint) => complaint._id !== id
      );
      setUserComplaints(newComplaints);

      if (code === 0) {
        notification.success({
          message: msg,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Something went wrong!",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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
          <div
            className="prev-complaints"
            style={
              userComplaints.length != 0
                ? { backgroundColor: "#f5f5f5" }
                : { backgroundColor: "#fff" }
            }
          >
            <div className="prev-complaits-title">
              <p>Your Previous Complaints</p>
            </div>
            {loading ? (
              <Loading size={70} />
            ) : isError ? (
              <ErrorMessage message={isError} />
            ) : userComplaints.length === 0 ? (
              <EmptyDataMessage message="No complaints found" />
            ) : (
              userComplaints.map((complaint) => (
                <div className="prev-complaint" key={complaint._id}>
                  <div className="prev-complaint-data">
                    <p className="complaint-id">
                      <span>Complaint ID :</span> {complaint._id}
                    </p>
                    <p className="complaint-id">
                      <span>Date :</span> {complaint?.date?.split("T")[0]}
                    </p>
                    <p className="complaint-description">
                      {complaint.complaint}
                    </p>
                  </div>
                  <div className="prev-comp-status">
                    <p
                      className={
                        complaint.status === "Inprogress"
                          ? "inprogress"
                          : "resolved"
                      }
                    >
                      {complaint.status}
                    </p>
                    {complaint.status === "Resolved" && (
                      <MyButton
                        name=""
                        size="small"
                        icon={<DeleteFilled style={{ color: "red" }} />}
                        color={loading ? "gray" : "transparent"}
                        onClick={() => {
                          confirm({
                            title:
                              "Are you sure you want to delete this complaint?",
                            content: "This action cannot be undone.",
                            onOk() {
                              handleDelete(complaint._id);
                            },
                            onCancel() {
                              console.log("Cancel");
                            },
                          });
                        }}
                        loading={loading}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ComplaintAddForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
          fetchComplaints();
        }}
      />
    </>
  );
}
