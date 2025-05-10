import React, { useEffect, useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { getRequests, handleTrips } from "../../apis/busOwner";
import { useSelector } from "react-redux";
import { busOwnerData } from "../../store/busOwnerSlice";
import { Modal, notification } from "antd";

export default function Requests() {
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errLoading, setErrLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [btnLoadingId, setBtnLoadingId] = useState("");

  const fetchRequests = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getRequests(id);
      if (code === 0) {
        setRequests(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const handleTrip = async (id, status) => {
    try {
      setIsError("");
      const { data, code, msg } = await handleTrips(id, status);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        const updatedReq = requests.filter((req) =>
          req._id === id ? (req.status = status) : req
        );
        setRequests(updatedReq);
      }
      setBtnLoadingId("");
    } catch (error) {
      setBtnLoadingId("");
      notification.error({
        message: "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  //TODO: auto rejected due date
  const filteredRequests = requests
    .filter((e) =>
      e?.busID?.busNumber.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const statusPriority = {
        pending: 3,
        approved: 2,
        rejected: 1,
      };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[b.status] - statusPriority[a.status];
      }
    });

  const handleConfirmTrip = (request, status) => {
    confirm({
      title: `Do you want to ${status} this trip request?`,
      onOk() {
        setBtnLoadingId(request._id);
        handleTrip(request._id, status);
      },
    });
  };

  useEffect(() => {}, [btnLoadingId]);
  return (
    <div>
      <div className="bus-header">
        <h1>Requests</h1>
      </div>
      <div className="bus-body">
        <div className="bus-body-header">
          <div>
            <MyInput
              placeholder="Enter Bus Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              height=""
            />
          </div>
        </div>
        <div className="req-body-content">
          {loading ? (
            <Loading size={70} />
          ) : requests.length === 0 ? (
            <EmptyDataMessage message={"Not received trips"} />
          ) : isError ? (
            <ErrorMessage message={isError} />
          ) : (
            filteredRequests.map((request) => (
              <div className="request-card" key={request._id}>
                <div className="request-top">
                  <p>{`${request.busID.busNumber} received a ${request.days} days ${request.type} from ${request.userID.username}`}</p>
                </div>
                <div className={"request-bottom"}>
                  <div className={"requestDetail"}>
                    <span className={"detailLabel"}>Description:</span>
                    <p>{request.description}</p>
                  </div>
                  <div className={"requestDetail"}>
                    <span className={"detailLabel"}>Venue:</span>
                    <p>{request.venue}</p>
                  </div>
                  <div className={"requestDetail"}>
                    <span className={"detailLabel"}>Date:</span>
                    <p>{request.date.split("T")[0]}</p>
                  </div>
                  <div className={"requestDetail"}>
                    <span className={"detailLabel"}>Contact:</span>
                    <p>{request.contact_no}</p>
                  </div>
                  <div className={"requestDetail"}>
                    <span className={"detailLabel"}>Days:</span>
                    <p>{request.days}</p>
                  </div>
                </div>

                <div className={"requestActions"}>
                  <div>
                    {request.status === "pending" && (
                      <MyButton
                        name="Approve"
                        color={"rgba(5, 148, 79, 1)"}
                        width={"100px"}
                        onClick={() => handleConfirmTrip(request, "approved")}
                        loading={btnLoadingId === request._id}
                      />
                    )}

                    {request.status === "pending" && (
                      <MyButton
                        name="Reject"
                        width={"100px"}
                        onClick={() => handleConfirmTrip(request, "rejected")}
                        danger={true}
                        loading={btnLoadingId === request._id}
                      />
                    )}

                    {request.status != "pending" && (
                      <MyButton
                        name={request.status}
                        disabled={true}
                        color={
                          request.status === "approved"
                            ? "rgba(5, 148, 79, 1)"
                            : "#e74c3c"
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
