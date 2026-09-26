import React, { useEffect, useState } from "react";
import "./style.css";
import {
  ExclamationCircleFilled,
  FilePdfOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MyButton from "../../components/button";
import MyInput from "../../components/input";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { Modal, notification } from "antd";
import { deletePassengerAD, getPassengersAD } from "../../apis/adminAPIs";
import DataTable from "../../components/DataTable";
import AdminUserAddForm from "../../components/AdminUserAddForm";
import AdminUserUpdateFormForm from "../../components/AdminUserUpdateForm";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
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
  table: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33.33%", 
    backgroundColor: "#05944F",
    color: "white",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    borderRight: "1px solid white",
  },
  tableCol: {
    width: "33.33%", 
    padding: 8,
    fontSize: 10,
    borderRight: "1px solid #ddd",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
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
const PassengerPDF = ({ passengers, columns }) => {
  const currentDate = new Date().toLocaleDateString();

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

        <Text style={styles.title}>Passenger Management Report</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map((col) => (
              <View style={styles.tableColHeader} key={col.key}>
                <Text style={styles.tableCell}>{col.title}</Text>
              </View>
            ))}
          </View>
          {passengers.map((passenger) => (
            <View style={styles.tableRow} key={passenger._id}>
              {columns.map((col) => (
                <View style={styles.tableCol} key={`${passenger._id}-${col.key}`}>
                  <Text style={styles.tableCell}>{passenger[col.key]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>GoBus Digital Mobility Solutions Limited</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function PassengerManagement() {
  const [isAdd, setIsAdd] = useState(false);
  const { confirm } = Modal;
  const [passengers, setPassenger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [view, setView] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const columns = [
    { key: "username", title: "Username", type: "text" },
    { key: "email", title: "Email", type: "text" },
    { key: "mobile", title: "Mobile", type: "number" },
  ];

  const fetchPassengers = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getPassengersAD();
      if (code === 0) {
        setPassenger(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deletePas = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deletePassengerAD(id);
      if (code === 0) {
        setPassenger((prev) => prev.filter((e) => e._id !== id));
        notification.success({
          message: msg,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const filteredPassengers = passengers.filter((e) =>
    e?.username.toLocaleLowerCase().includes(searchText?.toLocaleLowerCase())
  );

  useEffect(() => {
    fetchPassengers();
  }, []);

  return (
    <div className="passenger-management">
      <div className="pm-header">
        <h1>Passenger Management</h1>
      </div>
      <div className="pm-body">
        <div className="apm-body-header">
          <div>
            <MyInput
              placeholder="Search by username"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              height=""
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <PDFDownloadLink
              document={<PassengerPDF passengers={filteredPassengers} columns={columns} />}
              fileName="passenger_management_report.pdf"
            >
              {({ blob, url, loading, error }) => (
                <MyButton
                  name={loading ? "Preparing PDF..." : "Generate PDF"}
                  icon={<FilePdfOutlined />}
                  color={"#D63031"}
                  onClick={() => {}}
                  loading={loading}
                  disabled={loading || isError || filteredPassengers.length === 0}
                />
              )}
            </PDFDownloadLink>
            <MyButton
              name="Add Passenger"
              icon={<PlusCircleOutlined />}
              color={"#2D3436"}
              onClick={() => setView(true)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loading size={70} />
      ) : isError ? (
        <ErrorMessage message={isError} />
      ) : passengers.length === 0 ? (
        <EmptyDataMessage message="No user to show" />
      ) : (
        <DataTable
          onView={(data) => {
            console.log("onView: ", data);
          }}
          columns={columns}
          data={filteredPassengers}
          onEdit={(data) => {
            console.log("Edit Button Clicked", data);
            setSelectedPassenger(data);
            setIsUpdate(true);
          }}
          onDelete={(data) => {
            confirm({
              title: "Are you sure you want to delete this passenger?",
              icon: <ExclamationCircleFilled />,
              onOk() {
                deletePas(data._id);
              },
            });
          }}
        />
      )}

      {view && (
        <AdminUserAddForm
          isOpen={view}
          user="passenger"
          onClose={() => {
            setView(!view);
          }}
        />
      )}
      {isUpdate && (
        <AdminUserUpdateFormForm
          user="passenger"
          isOpen={isUpdate}
          selectedUser={selectedPassenger}
          onClose={() => {
            setIsUpdate(!isUpdate);
          }}
        />
      )}
    </div>
  );
}