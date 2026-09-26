import React, { useState, useEffect } from "react";
import { Modal, notification } from "antd";
import "./style.css";
import MyButton from "../button";
import { useNavigate } from "react-router-dom";
import {
  createOrOpenChatAD,
  updateTicketInProgressAD,
} from "../../apis/adminAPIs";
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
  ticketDetail: {
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
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
    width: "60%",
  },
  description: {
    marginBottom: 10,
    maxWidth: "100%",
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
    flexWrap: "wrap",
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
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 5,
    marginTop: 10,
  },
  ticketImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginBottom: 10,
    objectFit: "contain",
  },
});

// PDF Document Component
const TicketPDF = ({ ticket, values }) => {
  const currentDate = new Date().toLocaleDateString();

  const wrapText = (text, isDescription = false) => {
    if (!text) return "";

    const maxCharsPerLine = isDescription ? 70 : 50;
    let result = "";

    for (let i = 0; i < text.length; i += maxCharsPerLine) {
      result +=
        text.substring(i, i + maxCharsPerLine) +
        (i + maxCharsPerLine < text.length ? " " : "");
    }

    return result;
  };

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

        <Text style={styles.title}>Support Ticket Report</Text>

        <View style={styles.section}>
          {values.map((item, index) =>
            item.key !== "Description" ? (
              <View style={styles.ticketDetail} key={index}>
                <Text style={styles.label}>{item.key}:</Text>
                <Text style={styles.value}>{wrapText(item.value)}</Text>
              </View>
            ) : (
              <View style={styles.description} key={index}>
                <Text style={styles.descriptionLabel}>{item.key}:</Text>
                <Text style={styles.descriptionValue}>
                  {wrapText(item.value, true)}
                </Text>
              </View>
            )
          )}

          {ticket?.pictures &&
            ticket.pictures.filter((e) => e !== "").length > 0 && (
              <>
                <Text style={styles.imageTitle}>Attached Images:</Text>
                <View style={styles.images}>
                  {ticket.pictures
                    .filter((e) => e !== "")
                    .map((pic, index) => (
                      <Image key={index} src={pic} style={styles.ticketImage} />
                    ))}
                </View>
              </>
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

export default function TicketDetails({ isOpen, onClose, ticket }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);

  const key_values = [
    { key: "Ticket ID", value: ticket?._id || "N/A" },
    { key: "User ID", value: ticket?.userId || "N/A" },
    { key: "Subject", value: ticket?.subject || "N/A" },
    { key: "Date", value: ticket?.date || "N/A" },
    { key: "Description", value: ticket?.description || "N/A" },
    { key: "Status", value: ticket?.status || "N/A" },
  ];

  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!ticket?._id) {
      setError("Ticket ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Starting chat for ticket:", ticket._id);

      const updateResponse = await updateTicketInProgressAD(ticket._id, {
        status: "in_progress",
      });

      console.log("Update ticket response:", updateResponse);

      if (!updateResponse) {
        throw new Error("No response received from update ticket API");
      }

      console.log(
        "Creating or opening chat for ticket:",
        ticket._id,
        "and user:",
        ticket.userId
      );
      const chatResponse = await createOrOpenChatAD(ticket._id, ticket.userId);

      console.log("Chat response:", chatResponse);

      console.log("The Passing ticket id for chat: ", ticket._id);
      console.log("The Passing user id for chat: ", ticket.userId);
      navigate(`/administrator/chatRoom/${ticket._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setError(err.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  // Set PDF as ready when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setPdfReady(true);
    }
  }, [isOpen]);

  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="ticket-details">
          <div className="td-header">
            <p>Ticket Details</p>
            <div className="download-pdf-btn">
              {pdfReady && (
                <PDFDownloadLink
                  document={<TicketPDF ticket={ticket} values={key_values} />}
                  fileName={`Ticket_${ticket?._id || "details"}.pdf`}
                  className="pdf-download-link"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Preparing PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          <div className="td-content">
            <div>
              {key_values.map((item, index) => (
                <div
                  key={index}
                  className={`td-content-item ${
                    item.key === "Description" ? "des-content" : ""
                  }`}
                >
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
              <div className="ticket-pictures-container">
                {ticket?.pictures &&
                  ticket.pictures
                    .filter((e) => e !== "")
                    .map((pic, index) => (
                      <img
                        src={pic}
                        key={index}
                        alt={`Ticket attachment ${index}`}
                      />
                    ))}
              </div>
              {error && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "10px" }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            {ticket.status !== "closed" && (
              <MyButton
                name={loading ? "Processing..." : "Start Chat"}
                color="#05944f"
                onClick={handleStartChat}
                disabled={loading}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
