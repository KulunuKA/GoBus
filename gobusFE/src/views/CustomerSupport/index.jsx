import React, { useState } from "react";
import MyInput from "../../components/input";
import { Space, Upload, message, Button, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { passengerData } from "../../store/passengerSlice";
import { useSelector } from "react-redux";
import UseOneImgUpload from "../../hooks/UseOneImgUpload";
import { openTicket } from "../../apis/passengerAPIs";
import MyButton from "../../components/button/index";
import { MousePointer2 } from "lucide-react";

export default function CustomerSupport() {
  const { id: u_id } = useSelector(passengerData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [ticket, setTicket] = useState({
    userId: u_id,
    subject: "",
    description: "",
    fileList: [],
  });

  const handleUploadChange = ({ fileList: newFileList }) => {
    setTicket({ ...ticket, fileList: newFileList });
  };

  const validateTicket = () => {
    let newError = {};
    if (!ticket.subject) {
      newError.subject = "Subject is required";
    }

    if (!ticket.description) {
      newError.description = "Description is required";
    }

    if (ticket.description.length < 20) {
      newError.description = "Description must be at least 20 characters";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateTicket()) {
      return;
    }

    try {
      setLoading(true);

      const uploadedImageUrls = [];

      for (const file of ticket.fileList) {
        const url = await UseOneImgUpload({ file: file.originFileObj });
        uploadedImageUrls.push(url);
      }

      const ticketPayload = {
        userId: ticket.userId,
        subject: ticket.subject,
        description: ticket.description,
        pictures: uploadedImageUrls,
      };

      const { data, code, msg } = await openTicket(ticketPayload);

      if (code == 0) {
        notification.success({ message: msg });

        console.log("Your Ticket: ", ticket);

        setTicket({
          userId: u_id,
          subject: "",
          description: "",
          fileList: [],
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting ticket:", error);
      message.error("Failed to submit ticket.");
    }
  };

  return (
    <div className="main-passenger-container">
      <div className="pc-header">
        <h3>Customer Support</h3>
        <p>
          Need help? Our support team is here to assist you. Open a support
          ticket to get started.
        </p>
      </div>

      <div
        className="support-ticket-section"
        style={{
          minHeight: "50vh",
        }}
      >
        <div
          className="support-ticket"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "40%",
            margin: "auto",
            padding: "50px 0",
          }}
        >
          <div className="st-input">
            <MyInput
              label="Subject"
              borderRadius="5px"
              value={ticket.subject}
              onChange={(e) => {
                setError({ ...error, subject: "" });
                setTicket({ ...ticket, subject: e.target.value });
              }}
              error={error.subject}
              errorMessage={error.subject}
            />
          </div>

          <div className="st-input">
            <p
              style={{
                color: "#2d3436",
                fontWeight: "500",
                marginBottom: "5px",
              }}
            >
              Description
            </p>
            <Space direction="vertical" style={{ width: "100%" }}>
              <TextArea
                rows={4}
                placeholder="Describe your issue"
                minLength={10}
                maxLength={300}
                value={ticket.description}
                onChange={(e) =>
                  setTicket({ ...ticket, description: e.target.value })
                }
                style={{
                  borderRadius: "5px",
                  borderColor: error.description ? "#F5222D" : "#d9d9d9",
                }}
              />
              {error.description && (
                <p style={{ color: "#F5222D", fontSize: "14px" }}>
                  {error.description}
                </p>
              )}
            </Space>
          </div>

          <div className="st-input" style={{ marginTop: "20px" }}>
            <Upload
              listType="picture"
              fileList={ticket.fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept="image/*"
              multiple
              maxCount={3}
            >
              <Button icon={<UploadOutlined />}>Attach Images (Max: 3)</Button>
            </Upload>
          </div>

          <div className="st-input" style={{ marginTop: "20px" }}>
            <MyButton
              name="Submit Ticket"
              onClick={handleSubmit}
              icon={<MousePointer2 />}
              color={"#05944f"}
              loading={loading}
              width={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
