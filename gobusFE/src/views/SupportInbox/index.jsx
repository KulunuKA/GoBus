import React, { useEffect, useState } from "react";
import "./style.css";
import NavTabs from "../../components/NavTabs/Index";
import inbox from "../../assets/images/inbox-in.png";
import { useHashTab } from "../../hooks/useHashTab";
import { passengerData } from "../../store/passengerSlice";
import { useSelector } from "react-redux";
import { getUserTickets } from "../../apis/passengerAPIs";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import TicketDetailsCard from "../../components/TicketDetailsCard";
import supportVector from "../../assets/images/tripvector.jpeg";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/button";

export default function SupportInbox() {
  const { id } = useSelector(passengerData);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [tickets, setTickets] = useState([]);

  const activatedTab = useHashTab("opendTickets");

  const TabList = [
    { name: "Opend Tickets", tabName: "opendTickets" },
    { name: "In Progress", tabName: "supportInbox" },
    { name: "Closed Tickets", tabName: "closedTickets" },
  ];

  const opendTickets = tickets.filter((ticket) => ticket.status === "open");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  );
  const closedTickets = tickets.filter((ticket) => ticket.status === "closed");

  const fetchTickets = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getUserTickets(id);
      if (code === 0) {
        setTickets(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <div className="tickets-navTabs">
        <NavTabs
          pageIcon={inbox}
          pageName="Support Inbox"
          tabList={TabList}
          initialTab="opendTickets"
        />
      </div>

      <div className="tickets-section-container">
        <div className="ticket-section-main">
          <div className="tickets-section-header">
            <h2>
              {activatedTab === "opendTickets" && "Opend Tickets"}
              {activatedTab === "supportInbox" && "Tickets In Progress"}
              {activatedTab === "closedTickets" && "Closed Tickets"}
            </h2>
          </div>
          <div className="tickets-section-contents">
            {loading ? (
              <Loading size={70} />
            ) : isError ? (
              <ErrorMessage message={isError} />
            ) : (
              <div className="tickets-section-ticket-data-section">
                {activatedTab === "opendTickets" && (
                  <div className="ticket-data-section-pending-declined">
                    {opendTickets.length > 0 ? (
                      <div className="ticket-cards-pending-declined-tickets-section">
                        {opendTickets.map((ticket, index) => (
                          <TicketDetailsCard
                            key={index}
                            ticket={ticket}
                            refresh={fetchTickets}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyTickets
                        msg={"You have no opend tickets."}
                        btnName={"Create New Ticket"}
                        navigateTo={"/customer-support"}
                      />
                    )}
                  </div>
                )}

                {activatedTab === "supportInbox" && (
                  <div className="ticket-data-section-pending-declined">
                    {inProgressTickets.length > 0 ? (
                      <div className="ticket-cards-pending-declined-tickets-section">
                        {inProgressTickets.map((ticket, index) => (
                          <TicketDetailsCard
                            key={index}
                            ticket={ticket}
                            refresh={fetchTickets}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyTickets
                        msg={"You have no In Progress Tickets tickets."}
                      />
                    )}
                  </div>
                )}

                {activatedTab === "closedTickets" && (
                  <div className="ticket-data-section-pending-declined">
                    {closedTickets.length > 0 ? (
                      <div className="ticket-cards-pending-declined-tickets-section">
                        {closedTickets.map((ticket, index) => (
                          <TicketDetailsCard ticket={ticket} key={index} />
                        ))}
                      </div>
                    ) : (
                      <EmptyTickets msg={"You have no closed tickets."} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="tickets-section-contents-sidebar">
          <div className="tickets-section-contents-sidebar-content">
            <img src={supportVector} alt="" />
            <p className="tickets-sidebar-topic">Need Assistance?</p>
            <p className="tickets-sidebar-para">
              Reach out to our support team for any queries or issues you might
              have.
            </p>
            <div
              className="tickets-sidebar-btn"
              onClick={() => navigate("/customer-support")}
            >
              <p>Create New Ticket</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const EmptyTickets = ({ msg, btnName, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="ticket-cards-section">
      <div className="ticket-cards-no-data-message-box">
        <p>{msg}</p>
        {btnName && (
          <MyButton
            name="Create New Ticket"
            color={"#28a745"}
            onClick={() => navigate(navigateTo)}
          />
        )}
      </div>
    </div>
  );
};
