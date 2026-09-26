import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// Define styles for PDF
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
  subtitle: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    backgroundColor: "#05944F",
    color: "white",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    borderRight: "1px solid white",
  },
  tableCol: {
    width: "25%",
    padding: 8,
    fontSize: 10,
    borderRight: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
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
  summaryTable: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  summaryRow: {
    margin: "auto",
    flexDirection: "row",
  },
  summaryHeaderCol: {
    width: "50%",
    backgroundColor: "#05944F",
    color: "white",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    borderRight: "1px solid white",
  },
  summaryCol: {
    width: "50%",
    padding: 8,
    fontSize: 10,
    borderRight: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
  },
});

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Create PDF Document component
const BusIncomeReport = ({ busData }) => {
  // Calculate summary statistics
  const totalBuses = busData.length;
  const totalTrips = busData.reduce((acc, bus) => acc + bus.income.length, 0);
  const totalIncome = busData.reduce(
    (acc, bus) => acc + bus.income.reduce((sum, trip) => sum + trip.income, 0),
    0
  );
  const totalDistance = busData.reduce(
    (acc, bus) =>
      acc + bus.income.reduce((sum, trip) => sum + trip.distance, 0),
    0
  );

  const currentDate = new Date().toLocaleDateString();

  // Column definitions for trip details table
  const tripColumns = [
    { key: "date", title: "Date" },
    { key: "income", title: "Income" },
    { key: "distance", title: "Distance" },
    { key: "status", title: "Status" },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>
            GoBus Digital Mobility Solutions Limited
          </Text>
          {/* You can replace with your actual logo */}
          <Text style={{ fontSize: 12 }}>Bus Income Report</Text>
        </View>

        <Text style={styles.title}>Bus Income Management Report</Text>
        <Text style={styles.subtitle}>Summary of all bus income</Text>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryHeaderCol}>
              <Text style={styles.tableCell}>Summary Item</Text>
            </View>
            <View style={styles.summaryHeaderCol}>
              <Text style={styles.tableCell}>Value</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>Total Buses</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>{totalBuses}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>Total Income</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>
                {totalIncome.toLocaleString()} LKR
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>Total Distance</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.tableCell}>
                  {`${Number(totalDistance).toFixed(2)} km`}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Details Table - Only include if there are trips */}
        {totalTrips > 0 && (
          <>
            <Text style={[styles.title, { fontSize: 14, marginTop: 10 }]}>
              Trip Details
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {tripColumns.map((col) => (
                  <View style={styles.tableColHeader} key={col.key}>
                    <Text style={styles.tableCell}>{col.title}</Text>
                  </View>
                ))}
              </View>

              {busData.map((bus) =>
                bus.income.map((trip) => (
                  <View style={styles.tableRow} key={trip._id}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatDate(trip.date)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {trip.income.toLocaleString()} LRK
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{trip.distance} km</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Completed</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>GoBus Digital Mobility Solutions Limited</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Download Button Component
const BusIncomePDFDownload = ({ busData }) => (
  <PDFDownloadLink
    document={<BusIncomeReport busData={busData} />}
    fileName="bus-income-report.pdf"
    style={{
      backgroundColor: "#05944F",
      color: "white",
      padding: "10px 15px",
      borderRadius: "4px",
      textDecoration: "none",
      display: "inline-block",
      marginTop: "20px",
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      width: "230px",
    }}
  >
    {({ blob, url, loading, error }) =>
      loading ? "Generating PDF..." : "Download Income Report"
    }
  </PDFDownloadLink>
);

export { BusIncomeReport, BusIncomePDFDownload };
