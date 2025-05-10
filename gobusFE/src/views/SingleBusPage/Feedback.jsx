import React, { useEffect, useState } from "react";
import FeedbackSlider from "../../components/FeedbackSlider/index";
import PassengerButton from "../../components/PassengerButton";
import click from "../../assets/images/click.png";
import { notification, Rate } from "antd";
import "./style.css";
import TextArea from "antd/es/input/TextArea";
import { addFeedback, getFeedbacks } from "../../apis/passengerAPIs";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";
import Loading from "../../components/Loading";
import MyButton from "../../components/button";
import { MousePointer2 } from "lucide-react";
import SignInModal from "../../components/SignInModal";

export default function Feedback({ busDetails }) {
  const { id: u_id } = useSelector(passengerData);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [feedbackData, setFeedBackData] = useState({
    user_id: u_id,
    bus_id: "",
    rating: 2.5,
    feedback: "",
  });
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleRatingChange = (value) => {
    setFeedBackData((prev) => ({ ...prev, rating: value }));
  };

  const handleFeedbackChange = (e) => {
    setFeedBackData((prev) => ({ ...prev, feedback: e.target.value }));
  };

  let feedbackContent;

  if (feedbacks.length > 0) {
    feedbackContent = (
      <>
        <FeedbackSlider feedbackArray={feedbacks} />
      </>
    );
  }

  const handleClickHere = () => {
    if (!u_id) {
      setShowSignInModal(true);
      return;
    }
    setShowRatingForm(true);
  };

  const handleClickOnReview = () => {
    setShowRatingForm((prev) => !prev);
  };

  const handleAddFeedback = async () => {
    try {
      if (!u_id) {
        setShowSignInModal(true);
        return;
      }
       setLoading(true);
      let feedback = {
        ...feedbackData,
        bus_id: busDetails._id,
      };

      const { data, code, msg } = await addFeedback(feedback);
      if (code === 0) {
        feedbacks.push(data);
        notification.success({
          message: "Feedback added successfully",
        });
        setShowRatingForm(false);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      notification.error({
        message: "Failed to add feedback",
      });
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data, code, msg } = await getFeedbacks(busDetails._id);
      if (code === 0) {
        data.length > 0 ? setFeedbacks(data) : setShowRatingForm(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (busDetails._id) {
      fetchFeedbacks();
    }
  }, [busDetails._id]);

  return (
    <div className="single-bus-feedback-rating-section">
      <div className="single-bus-info-box">
        <div className="info-box-header">
          <h3>Feedback & Ratings</h3>
        </div>

        {!showRatingForm && (
          <div className="single-bus-overall-feedbacks">
            <div className="single-bus-overall-feedbacks-contents">
              {feedbackContent}
            </div>
          </div>
        )}

        <div className="single-bus-passenger-feedbacking-section">
          {showRatingForm && (
            <div className="single-bus-overall-feedbacks">
              <div className="single-bus-overall-feedbacks-contents">
                <div className="single-bus-feedback-rate-box">
                  <div className="star-rate-section">
                    <p>Rate Our Service : </p>
                    <Rate
                      allowHalf
                      defaultValue={feedbackData.rating}
                      onChange={handleRatingChange}
                    />
                  </div>
                  <div className="star-rate-section">
                    <p>Give Your Feedback about Service : </p>

                    <TextArea
                      rows={4}
                      placeholder="Enter your feedback here..."
                      value={feedbackData.feedback}
                      onChange={handleFeedbackChange}
                      style={{ margin: "10px 0" }}
                    />
                  </div>
                  <div>
                    <MyButton
                      name="Submit"
                      icon={<MousePointer2 />}
                      color={"#05944f"}
                      loading={loading}
                      onClick={handleAddFeedback}
                      width={200}
                      disabled={
                        feedbackData.feedback.length < 5 || loading
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showRatingForm ? (
            <div className="single-bus-passenger-feedbacking-section-message">
              <p>
                We value your feedback!{" "}
                <span onClick={handleClickHere}>Click here</span> to rate our
                service!
              </p>
            </div>
          ) : (
            <div className="single-bus-passenger-feedbacking-section-message">
              <p>
                You can <span onClick={handleClickOnReview}>Click here</span> to
                see your feedbacks!
              </p>
            </div>
          )}
        </div>
      </div>

      <SignInModal
        isOpen={showSignInModal}
        closeModal={() => setShowSignInModal(false)}
      />
    </div>
  );
}
