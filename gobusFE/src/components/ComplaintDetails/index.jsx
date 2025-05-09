import React, { useState } from "react";
import { Modal, notification } from "antd";
import "./style.css";
import { updateComplaintsAD } from "../../apis/adminAPIs";
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
  complaintDetail: {
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
const ComplaintPDF = ({ complaint, values }) => {
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

        <Text style={styles.title}>Complaint Report</Text>

        <View style={styles.section}>
          {values.map((item, index) =>
            item.key !== "Description" ? (
              <View style={styles.complaintDetail} key={index}>
                <Text style={styles.label}>{item.key}:</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ) : (
              <View style={styles.description} key={index}>
                <Text style={styles.descriptionLabel}>{item.key}:</Text>
                <Text style={styles.descriptionValue}>{item.value}</Text>
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

export default function ComplaintDetails({ isOpen, onClose, complaint }) {
  const key_values = [
    { key: "Complaint Id", value: complaint._id },
    { key: "User Id", value: complaint.userID },
    { key: "About", value: complaint.complaintType },
    { key: "Date", value: complaint.date },
    { key: "Description", value: complaint.complaint },
    { key: "Status", value: complaint.status },
  ];
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(key_values);
  const [pdfReady, setPdfReady] = useState(false);

  const handleChecked = async () => {
    try {
      setLoading(true);
      const { data, code, msg } = await updateComplaintsAD(complaint._id, {
        status: "Resolved",
      });
      if (code == 0) {
        notification.success({
          message: msg,
        });
        onClose();
        setValues((prev) => {
          return prev.map((item) => {
            if (item.key === "Status") {
              return { key: item.key, value: "Resolved" };
            }
            return item;
          });
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Something went wrong",
      });
    }
  };

  // Set PDF as ready when the modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setPdfReady(true);
    }
  }, [isOpen]);

  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="complaint-details">
          <div className="cd-header">
            <p>Complaint Details</p>
            <div className="download-pdf-btn">
              {pdfReady && (
                <PDFDownloadLink
                  document={
                    <ComplaintPDF complaint={complaint} values={values} />
                  }
                  fileName={`Complaint_${complaint._id}.pdf`}
                  className="pdf-download-link"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Preparing PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          <div className="cd-content">
            <div>
              {values.map((item, index) => (
                <div
                  key={index}
                  className={`cd-content-item ${
                    item.key === "Description" ? "des-content" : ""
                  }`}
                >
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="action-buttons">
          {key_values[5].value === "Inprogress" && (
            <p className="resolve-btn" onClick={handleChecked}>
              {loading ? "Loading.." : "Mark as Resolved"}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
