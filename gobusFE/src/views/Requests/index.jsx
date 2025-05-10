// import React, { useEffect, useState } from "react";
// import MyInput from "../../components/input";
// import MyButton from "../../components/button";
// import { SearchOutlined } from "@ant-design/icons";
// import Loading from "../../components/Loading";
// import ErrorMessage from "../../components/ErrorMessage";
// import EmptyDataMessage from "../../components/EmptyDataMessage";
// import { getRequests, handleTrips } from "../../apis/busOwner";
// import { useSelector } from "react-redux";
// import { busOwnerData } from "../../store/busOwnerSlice";
// import { Modal, notification } from "antd";

// export default function Requests() {
//   const { id } = useSelector(busOwnerData);
//   const { confirm } = Modal;
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errLoading, setErrLoading] = useState(false);
//   const [isError, setIsError] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [btnLoadingId, setBtnLoadingId] = useState("");

//   const fetchRequests = async () => {
//     try {
//       setIsError("");
//       setLoading(true);
//       const { data, code, msg } = await getRequests(id);
//       if (code === 0) {
//         setRequests(data);
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       setIsError("Something went wrong!");
//       console.log(error);
//     }
//   };

//   const handleTrip = async (id, status) => {
//     try {
//       setIsError("");
//       const { data, code, msg } = await handleTrips(id, status);
//       if (code === 0) {
//         notification.success({
//           message: msg,
//         });
//         const updatedReq = requests.filter((req) =>
//           req._id === id ? (req.status = status) : req
//         );
//         setRequests(updatedReq);
//       }
//       setBtnLoadingId("");
//     } catch (error) {
//       setBtnLoadingId("");
//       notification.error({
//         message: "Something went wrong!",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   //TODO: auto rejected due date
//   const filteredRequests = requests
//     .filter((e) =>
//       e?.busID?.busNumber.toLowerCase().includes(searchText.toLowerCase())
//     )
//     .sort((a, b) => {
//       const statusPriority = {
//         pending: 3,
//         approved: 2,
//         rejected: 1,
//       };
//       if (statusPriority[a.status] !== statusPriority[b.status]) {
//         return statusPriority[b.status] - statusPriority[a.status];
//       }
//     });

//   const handleConfirmTrip = (request, status) => {
//     confirm({
//       title: `Do you want to ${status} this trip request?`,
//       onOk() {
//         setBtnLoadingId(request._id);
//         handleTrip(request._id, status);
//       },
//     });
//   };

//   useEffect(() => {}, [btnLoadingId]);
//   return (
//     <div>
//       <div className="bus-header">
//         <h1>Requests</h1>
//       </div>
//       <div className="bus-body">
//         <div className="bus-body-header">
//           <div>
//             <MyInput
//               placeholder="Enter Bus Number"
//               prefix={<SearchOutlined />}
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               height=""
//             />
//           </div>
//         </div>
//         <div className="req-body-content">
//           {loading ? (
//             <Loading size={70} />
//           ) : requests.length === 0 ? (
//             <EmptyDataMessage message={"Not received trips"} />
//           ) : isError ? (
//             <ErrorMessage message={isError} />
//           ) : (
//             filteredRequests.map((request) => (
//               <div className="request-card" key={request._id}>
//                 <div className="request-top">
//                   <p>{`${request.busID.busNumber} received a ${request.days} days ${request.type} from ${request.userID.username}`}</p>
//                 </div>
//                 <div className={"request-bottom"}>
//                   <div className={"requestDetail"}>
//                     <span className={"detailLabel"}>Description:</span>
//                     <p>{request.description}</p>
//                   </div>
//                   <div className={"requestDetail"}>
//                     <span className={"detailLabel"}>Venue:</span>
//                     <p>{request.venue}</p>
//                   </div>
//                   <div className={"requestDetail"}>
//                     <span className={"detailLabel"}>Date:</span>
//                     <p>{request.date.split("T")[0]}</p>
//                   </div>
//                   <div className={"requestDetail"}>
//                     <span className={"detailLabel"}>Contact:</span>
//                     <p>{request.contact_no}</p>
//                   </div>
//                   <div className={"requestDetail"}>
//                     <span className={"detailLabel"}>Days:</span>
//                     <p>{request.days}</p>
//                   </div>
//                 </div>

//                 <div className={"requestActions"}>
//                   <div>
//                     {request.status === "pending" && (
//                       <MyButton
//                         name="Approve"
//                         color={"rgba(5, 148, 79, 1)"}
//                         width={"100px"}
//                         onClick={() => handleConfirmTrip(request, "approved")}
//                         loading={btnLoadingId === request._id}
//                       />
//                     )}

//                     {request.status === "pending" && (
//                       <MyButton
//                         name="Reject"
//                         width={"100px"}
//                         onClick={() => handleConfirmTrip(request, "rejected")}
//                         danger={true}
//                         loading={btnLoadingId === request._id}
//                       />
//                     )}

//                     {request.status != "pending" && (
// <MyButton
//   name={request.status}
//   disabled={true}
//   color={
//     request.status === "approved"
//       ? "rgba(5, 148, 79, 1)"
//       : "#e74c3c"
//   }
// />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
import "./style.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #05944F",
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05944F",
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  detailRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3436",
    width: "30%",
  },
  value: {
    fontSize: 12,
    color: "#2D3436",
    width: "70%",
    wordBreak: "break-word",
  },
  description: {
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 5,
  },
  descriptionValue: {
    fontSize: 12,
    color: "#2D3436",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderLeft: "1px solid #05944F",
    wordBreak: "break-word",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "#2D3436",
    textAlign: "center",
    borderTop: "1px solid #05944F",
    paddingTop: 10,
  },
  companyName: {
    fontSize: 10,
    color: "#05944F",
    fontWeight: "bold",
  },
});

// PDF Document Component
const RequestPDF = ({ request }) => {
  const currentDate = new Date().toLocaleDateString();

  const tripDetails = [
    { key: "Request ID", value: request._id },
    { key: "User", value: request.userID.username },
    { key: "Bus Number", value: request.busID.busNumber },
    { key: "Trip Type", value: request.type },
    { key: "Days", value: request.days },
    { key: "Description", value: request.description },
    { key: "Venue", value: request.venue },
    { key: "Date", value: request.date.split("T")[0] },
    { key: "Contact", value: request.contact_no },
    { key: "Status", value: request.status },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://res.cloudinary.com/difzxsfeq/image/upload/v1746732778/logo-no-background_vzxxjl.png"
            style={styles.logo}
          />
          <Text style={styles.companyName}>
            GoBus Digital Mobility Solutions Limited
          </Text>
        </View>

        <Text style={styles.title}>Trip Request Details</Text>

        <View style={styles.section}>
          {tripDetails.map((item, index) =>
            item.key === "Description" ? (
              <View style={styles.description} key={index}>
                <Text style={styles.descriptionLabel}>{item.key}:</Text>
                <Text style={styles.descriptionValue}>{item.value}</Text>
              </View>
            ) : (
              <View style={styles.detailRow} key={index}>
                <Text style={styles.label}>{item.key}:</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>GoBus Digital Mobility Solutions Limited</Text>
        </View>
      </Page>
    </Document>
  );
};

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
        const updatedReq = requests.map((req) =>
          req._id === id ? { ...req, status: status } : req
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
  }, [id]); // Fetch requests when bus owner ID is available

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
      return 0; // Keep original order if statuses are the same
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
                      <>
                        <MyButton
                          name="Approve"
                          color={"rgba(5, 148, 79, 1)"}
                          width={"100px"}
                          onClick={() => handleConfirmTrip(request, "approved")}
                          loading={btnLoadingId === request._id}
                        />
                        <MyButton
                          name="Reject"
                          width={"100px"}
                          onClick={() => handleConfirmTrip(request, "rejected")}
                          danger={true}
                          loading={btnLoadingId === request._id}
                        />
                      </>
                    )}

                    {request.status === "approved" && (
                      <div>
                        <MyButton
                          name={request.status}
                          disabled={true}
                          color={
                            request.status === "approved"
                              ? "rgba(5, 148, 79, 1)"
                              : "#e74c3c"
                          }
                        />
                        <PDFDownloadLink
                          document={<RequestPDF request={request} />}
                          fileName={`Trip_Request_${request._id}.pdf`}
                          className="pdf-download-link-request"
                        >
                          {({ blob, url, loading, error }) =>
                            loading ? "Generating PDF..." : "Download PDF"
                          }
                        </PDFDownloadLink>
                      </div>
                    )}

                    {request.status !== "pending" &&
                      request.status !== "approved" && (
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
