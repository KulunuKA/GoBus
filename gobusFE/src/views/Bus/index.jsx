import React, { useEffect, useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import BusForm from "../../components/BusAddForm";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Modal, notification } from "antd";
import { useSelector } from "react-redux";
import "./style.css";
import { busOwnerData } from "../../store/busOwnerSlice";
import { deleteBusAPI, getBuses } from "../../apis/busOwner";
import Loading from "../../components/Loading";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import ErrorMessage from "../../components/ErrorMessage";
import BusUpdateForm from "../../components/BusUpdateForm";
import BusDetails from "../../components/BusDetails";
import DataTable from "../../components/DataTable";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Circle,
  Rect,
  Path,
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
    width: 90,
    height: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D3436",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 5,
  },
  busCard: {
    margin: 5,
    marginBottom: 20,
    padding: 5,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  busHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  busNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 5,
  },
  fuelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  fuelGaugeContainer: {
    width: "40%",
  },
  fuelInfoContainer: {
    width: "60%",
    paddingLeft: 10,
  },
  fuelDetailRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  fuelLabel: {
    fontSize: 10,
    color: "#555",
    width: "45%",
  },
  fuelValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  fuelPercentage: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    color: "#05944F",
  },
  gaugeBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginTop: 5,
  },
  gaugeFill: {
    height: 12,
    borderRadius: 6,
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
  summarySection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f7f4",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#05944F",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 3,
  },
  sectionDivider: {
    borderBottom: "1px dashed #ccc",
    marginVertical: 10,
  },
});

// PDF Document Component for Fuel Levels
const FuelReportPDF = ({ busesData }) => {
  const currentDate = new Date().toLocaleDateString();

  // Calculate fleet stats
  const calculateFleetStats = () => {
    let totalFuel = 0;
    let totalCapacity = 0;
    let lowestLevel = 100;
    let lowestBus = "";
    let highestLevel = 0;
    let highestBus = "";

    busesData.forEach((bus) => {
      const currentFuel = parseFloat(bus.current_fuel_level) || 0;
      const maxFuel = parseFloat(bus.max_fuel_level) || 1;
      const percentage = (currentFuel / maxFuel) * 100;

      totalFuel += currentFuel;
      totalCapacity += maxFuel;

      if (percentage < lowestLevel) {
        lowestLevel = percentage;
        lowestBus = bus.busNumber;
      }

      if (percentage > highestLevel) {
        highestLevel = percentage;
        highestBus = bus.busNumber;
      }
    });

    return {
      totalFuel: totalFuel.toFixed(1),
      totalCapacity: totalCapacity.toFixed(1),
      fleetPercentage: ((totalFuel / totalCapacity) * 100).toFixed(1),
      lowestLevel: lowestLevel.toFixed(1),
      lowestBus,
      highestLevel: highestLevel.toFixed(1),
      highestBus,
    };
  };

  const fleetStats = calculateFleetStats();

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

        <Text style={styles.title}>Bus Fleet Fuel Levels Report</Text>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Fleet Summary</Text>
          <Text style={styles.summaryText}>
            Total Fleet Fuel: {fleetStats.totalFuel} Liters (
            {fleetStats.fleetPercentage}% of capacity)
          </Text>
          <Text style={styles.summaryText}>
            Lowest Fuel Level: {fleetStats.lowestBus} ({fleetStats.lowestLevel}
            %)
          </Text>
          <Text style={styles.summaryText}>
            Highest Fuel Level: {fleetStats.highestBus} (
            {fleetStats.highestLevel}%)
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionHeader}>Individual Bus Fuel Status</Text>

        {busesData.map((bus) => {
          // Calculate fuel percentage
          const currentFuel = parseFloat(bus.current_fuel_level) || 0;
          const maxFuel = parseFloat(bus.max_fuel_level) || 1;
          const percentage = Math.min(
            100,
            Math.round((currentFuel / maxFuel) * 100)
          );

          return (
            <View key={bus._id} style={styles.busCard}>
              <View style={styles.busHeader}>
                <Text style={styles.busNumber}>
                  Bus Number: {bus.busNumber}
                </Text>
              </View>

              <View style={styles.fuelContainer}>
                <View style={styles.fuelGaugeContainer}>
                  <View style={styles.gaugeBackground}>
                    <View
                      style={[
                        styles.gaugeFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage < 25
                              ? "#e74c3c"
                              : percentage < 50
                              ? "#f39c12"
                              : percentage < 75
                              ? "#3498db"
                              : "#05944F",
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.fuelPercentage,
                      {
                        color:
                          percentage < 25
                            ? "#e74c3c"
                            : percentage < 50
                            ? "#f39c12"
                            : percentage < 75
                            ? "#3498db"
                            : "#05944F",
                      },
                    ]}
                  >
                    {percentage}%
                  </Text>
                </View>

                <View style={styles.fuelInfoContainer}>
                  <View style={styles.fuelDetailRow}>
                    <Text style={styles.fuelLabel}>Current Fuel:</Text>
                    <Text style={styles.fuelValue}>
                      {bus.current_fuel_level} Liters
                    </Text>
                  </View>

                  <View style={styles.fuelDetailRow}>
                    <Text style={styles.fuelLabel}>Tank Capacity:</Text>
                    <Text style={styles.fuelValue}>
                      {bus.max_fuel_level} Liters
                    </Text>
                  </View>

                  <View style={styles.fuelDetailRow}>
                    <Text style={styles.fuelLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.fuelValue,
                        {
                          color:
                            percentage < 25
                              ? "#e74c3c"
                              : percentage < 50
                              ? "#f39c12"
                              : percentage < 75
                              ? "#3498db"
                              : "#05944F",
                        },
                      ]}
                    >
                      {percentage < 25
                        ? "Low"
                        : percentage < 50
                        ? "Medium"
                        : percentage < 75
                        ? "Good"
                        : "Excellent"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>GoBus Digital Mobility Solutions Limited</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function Bus() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [view, setView] = useState(false);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);

  const fetchBuses = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getBuses(id);
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

  const deleteBus = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deleteBusAPI(id);
      if (code === 0) {
        setBuses((prev) => prev.filter((e) => e._id !== id));
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

  // Define columns for the DataTable
  const columns = [
    { key: "pictures", title: "Bus", type: "image" },
    { key: "busNumber", title: "Bus Number", type: "text" },
    { key: "driverID.name", title: "Driver", type: "text" },
    { key: "route_id.route_number", title: "Route Number", type: "text" },
    { key: "busType", title: "Bus Type", type: "text" },
  ];

  useEffect(() => {
    fetchBuses();
  }, [id]);

  return (
    <div>
      <div className="bus-header">
        <h1>Bus</h1>
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
          <div>
            {buses.length > 0 ? (
              <PDFDownloadLink
                document={<FuelReportPDF busesData={buses} />}
                fileName={`Fuel_Report_All_Buses_${new Date().toLocaleDateString()}.pdf`}
                className="pdf-download-link-fuel"
              >
                {({ url, loading, error }) =>
                  loading ? "Generating PDF..." : "Download Fuel Report"
                }
              </PDFDownloadLink>
            ) : (
              <MyButton
                name="Download Fuel Report"
                icon={<PlusCircleOutlined />}
                color={"#05944F"}
                disabled={true}
              />
            )}
            <MyButton
              name="Add Bus"
              icon={<PlusCircleOutlined />}
              color={"#2D3436"}
              onClick={() => setIsAdd(true)}
              ml={10}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Bus</th>
              <th>Bus Number</th>
              <th>A/C</th>
              <th>Route</th>
              <th>Bus Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody onClick={() => setView(!view)}>
            {loading ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <Loading size={70} />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <ErrorMessage message={isError} />
                </td>
              </tr>
            ) : buses.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No bus added" />
                </td>
              </tr>
            ) : (
              buses
                .filter((e) =>
                  e.busNumber?.toLowerCase().includes(searchText?.toLowerCase())
                )
                .map((bus, index) => (
                  <tr key={bus._id} onClick={() => setSelectedBusDetails(bus)}>
                    <td>
                      <img
                        src={bus?.pictures[0]}
                        className="bus-pic"
                        alt={`Bus ${bus.busNumber}`}
                      />
                    </td>
                    <td>{bus.busNumber}</td>
                    <td>{bus.ac ? "A/C" : "Non A/C"}</td>
                    <td>{bus.route_id?.route_number || "Not Assigned"}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {bus.busType}
                    </td>
                    <td>
                      <MyButton
                        name="Edit"
                        size="small"
                        color={" #05944F"}
                        icon={<EditOutlined />}
                        mt={10}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBus(bus);
                          setIsUpdate(true);
                        }}
                      />
                      <MyButton
                        size="small"
                        name="Delete"
                        color={"#e74c3c"}
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirm({
                            title: "Do you want to delete this bus?",
                            icon: <ExclamationCircleFilled />,
                            okText: "Yes",
                            okType: "danger",
                            cancelText: "No",
                            onOk() {
                              deleteBus(bus._id);
                            },
                            onCancel() {
                              console.log("Cancel");
                            },
                          });
                        }}
                        ml={5}
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <BusForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
        }}
        refresh={() => {
          fetchBuses();
        }}
      />

      {isUpdate && (
        <BusUpdateForm
          data={selectedBus}
          isOpen={isUpdate}
          onCancel={() => {
            setIsUpdate(false);
          }}
          refresh={() => {
            fetchBuses();
          }}
        />
      )}

      {view && (
        <BusDetails
          isOpen={view}
          onClose={() => setView(!view)}
          bus={selectedBusDetails}
        />
      )}
    </div>
  );
}
